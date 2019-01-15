const router = require("express").Router();
const { User, Role } = require("../db/models");
const didJWT = require("did-jwt");

module.exports = router;

router.post("/", async (req, res, next) => {
  try {
    var user = await User.findOne({
      where: { uportAddress: req.body.address }
    });
    if (user)
      user = await User.getContributions({ uportAddress: req.body.address });
    else
      user = await User.create({
        name: req.body.name,
        uportAddress: req.body.address
      }).then(user =>
        User.getContributions({ uportAddress: req.body.address })
      );
    req.login(user, async err => {
      if (err) next(err);
      res.send({ user, authRedirectPath: req.session.authRedirectPath });
    });
  } catch (err) {
    next(err);
  }
});

router.post("/auth-redirect-path", async (req, res, next) => {
  req.session.authRedirectPath = req.body.authRedirectPath;
  res.sendStatus(200);
});

router.post("/mobile", async (req, res, next) => {
  try {
    const decoded = didJWT.decodeJWT(req.body.accessToken);
    var user = await User.findOne({
      where: { uportAddress: decoded.payload.nad }
    });
    if (user)
      user = await User.getContributions({ uportAddress: decoded.payload.nad });
    else
      user = await User.create({
        name: decoded.payload.own.name,
        uportAddress: decoded.payload.nad
      }).then(user =>
        User.getContributions({ uportAddress: decoded.payload.nad })
      );
    req.login(user, async err => {
      if (err) next(err);
      res.send({ user, authRedirectPath: req.session.authRedirectPath });
    });
  } catch (err) {
    next(err);
  }
});
