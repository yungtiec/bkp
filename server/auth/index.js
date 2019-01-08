const router = require("express").Router();
const {
  User,
  Role,
  ProjectAdmin,
  ProjectEditor,
  Tag,
  TagLink
} = require("../db/models");
const _ = require("lodash");
const generateForgetPasswordHtml = require("./generateForgetPasswordHtml.js");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const moment = require("moment");
Promise = require("bluebird");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = router;

router.post("/login", async (req, res, next) => {
  User.findOne({
    where: { email: req.body.email },
    include: [
      {
        model: Role,
        attributes: ["name"]
      }
    ]
  })
    .then(user => {
      if (!user) {
        res.status(401).send("User not found");
      } else if (!user.correctPassword(req.body.password)) {
        res.status(401).send("Incorrect password");
      } else {
        req.login(user, async err => {
          if (err) next(err);
          user = await User.getContributions({
            includePrivateInfo: true,
            userId: user.id
          });
          res.send(user);
        });
      }
    })
    .catch(next);
});

router.post("/signup", (req, res, next) => {
  User.create(req.body)
    .then(async user => {
      user = await User.getContributions({
        includePrivateInfo: true,
        userId: user.id
      });
      req.login(user, err => (err ? next(err) : res.json(user)));
    })
    .catch(err => {
      console.log(err);
      if (err.name === "SequelizeUniqueConstraintError") {
        res.status(401).send("User already exists");
      } else {
        next(err);
      }
    });
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/me", async (req, res) => {
  if (req.user) {
    const user = await User.getContributions({
      includePrivateInfo: true,
      userId: req.user.id
    });
    res.send(user);
  } else {
    res.sendStatus(401);
  }
});

router.put("/profile", async (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  if (req.user.user_handle !== req.body.user_handle) res.sendStatus(401);
  else {
    try {
      var user = await User.findOne({
        where: { id: req.user.id },
        include: [{ model: Tag }]
      });
      const updatedTagIds = (req.body.location || [])
        .concat(req.body.careerRole || [])
        .map(tag => tag.value);
      const removeTagPromises = Promise.map(
        user.tags.filter(tag => updatedTagIds.indexOf(tag.id) === -1),
        removedTag =>
          TagLink.destroy({
            where: { tagId: removedTag.id, foreign_key: user.id, table: "user" }
          })
      );
      const addTagPromises = Promise.map(updatedTagIds, async tagId => {
        const tag = await Tag.findById(tagId);
        return user.addTag(tag);
      });
      await Promise.all([
        user.update(_.omit(req.body, ["careerRole", "location"])),
        removeTagPromises,
        addTagPromises
      ]);
      user = await User.findOne({
        where: { id: req.user.id },
        include: [{ model: Tag }]
      });
      res.send(user);
    } catch (err) {
      next(err);
    }
  }
});

router.put("/profile/anonymity", async (req, res, next) => {
  if (!req.user || (req.user && !req.user.id)) res.sendStatus(401);
  else {
    const user = await User.findById(req.user.id).then(user =>
      user.update({
        anonymity: !req.user.anonymity
      })
    );
    res.send(user);
  }
});

router.put("/profile/onboard", async (req, res, next) => {
  if (!req.user || (req.user && !req.user.id)) res.sendStatus(401);
  else {
    const user = await User.findById(req.user.id).then(user =>
      user.update({
        onboard: true
      })
    );
    res.send(user);
  }
});

router.put("/accounts/update-account", async (req, res, next) => {
  try {
    if (req.user.user_handle !== req.body.current_user_handle)
      res.sendStatus(401);
    var user = await User.findById(req.user.id);
    var putQuery = {};
    if (user.email !== req.body.email) {
      putQuery.email = req.body.email;
      putQuery.email_verified = false;
    }
    if (user.user_handle !== req.body.user_handle)
      putQuery.user_handle = req.body.user_handle;
    user = await user.update(putQuery);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

router.put("/accounts/update-password", async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const userEmail = user.dataValues.email;
    const isCorrectPassword = user.correctPassword(req.body.password);
    if (isCorrectPassword) {
      await user.update({
        password: req.body.newPassword
      });
      const message = {
        to: userEmail,
        from: "The Brooklyn Project <reset-password@thebkp.com>",
        subject: "The Brooklyn Project - Password Change",
        text:
          "You are receiving this because you (or someone else) have changed the password for your account.\n\n" +
          "If you did not request this, please contact an administrator immediately.\n"
      };
      await sgMail.send(message);
      res.send(200);
    } else {
      res.send(403);
    }
  } catch (err) {
    res.send(403);
  }
});

router.put("/reset-password", function(req, res, next) {
  const token = crypto.randomBytes(16).toString("hex");
  const message = {
    to: req.body.email,
    from: "The Brooklyn Project <reset-password@thebkp.com>",
    subject: "The Brooklyn Project - password Reset",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      "http://" +
      "localhost:8000/" +
      "/reset-password/" +
      token +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    html: generateForgetPasswordHtml(
      process.env.NODE_ENV === "production",
      token
    )
  };
  const expiration = moment()
    .add(7, "days")
    .format("x");
  User.findOne({ where: { email: req.body.email } })
    .then(function(user) {
      if (!user) {
        res.sendStatus(400);
      } else {
        user
          .update({
            reset_password_token: token,
            reset_passowrd_expiration: expiration
          })
          .then(() => sgMail.send(message))
          .then(() => res.sendStatus(200));
      }
    })
    .catch(err => next(err));
});

router.put("/reset-password/:token", async (req, res, next) => {
  try {
    var user = await User.findOne({
      where: { reset_password_token: req.params.token }
    });
    var error;
    if (!user) {
      error = new Error("User not found");
      error.status = 404;
      next(error);
    } else if (
      Number(user.reset_passowrd_expiration) - Number(moment().format("x")) <=
      0
    ) {
      error = new Error("Token expired");
      error.status = 410;
      next(error);
    } else {
      await user.update({
        reset_password_token: null,
        reset_password_expiration: null,
        password: req.body.password
      });
      req.logIn(user, async function(err) {
        if (err) res.sendStatus(400);
        else {
          user = await User.getContributions({
            includePrivateInfo: true,
            userId: user.id
          });
          res.send(user);
        }
      });
    }
  } catch (err) {
    next(err);
  }
});

router.use("/google", require("./google"));
router.use("/uport", require("./uport"));
