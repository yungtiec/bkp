const { User, Role, Comment } = require("../db/models");
const _ = require("lodash");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

const isAdmin = user => {
  return user.roles.filter(r => r.name === "admin").length;
};

const ensureAuthentication = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const ensureAdminRole = async (req, res, next) => {
  const requestor = await User.findOne({
    where: { id: req.user.id },
    include: [
      {
        model: Role
      }
    ]
  });
  if (requestor.roles.filter(r => r.name === "admin").length) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const ensureAdminRoleOrOwnership = async (req, res, next) => {
  try {
    const requestor = await User.scope({
      method: ["roles", Number(req.user.id)]
    }).findOne();
    if (
      requestor.roles.filter(r => r.name === "admin").length ||
      Number(req.params.userId) === req.user.id
    ) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
};

const ensureAdminRoleOrCommentOwnership = async (req, res, next) => {
  try {
    const requestor = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Role
        }
      ]
    });
    const comment = Comment.findById(req.body.commentId);
    if (
      requestor.roles.filter(r => r.name === "admin").length ||
      comment.owner_id === req.user.id
    ) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
};

const ensureResourceAccess = async (req, res, next) => {
  if (req.user.restricted_access) res.sendStatus(403);
  else next();
};

const getEngagedUsers = async ({ version, creator, collaboratorEmails }) => {
  var comments = await version.getComments({
    include: [
      {
        model: User,
        as: "owner"
      }
    ]
  });
  var commentators = _.uniqBy(comments.map(c => c.owner.toJSON()), "id").filter(
    c => collaboratorEmails.indexOf(c.email) === -1 && c.id !== creator.id
  );
  // we might want to tailor the notification based on their action
  return commentators;
};

const createSlug = async (docTitle, contentHtml) => {
  const strippedTitle  = docTitle.replace(/[^a-zA-Z 0-9 -]+/g, '');
  const sha256 = crypto.createHash("sha256");

  try {
    // Hash the original version obj as a JSON string
    // Convert the hash to base64 ([a-z], [A-Z], [0-9], +, /)
    const hash = sha256.update(contentHtml).digest("base64");

    // This is the  base64 key that corresponds to the given JSON string
    const base64Key = hash.slice(0, 8);

    // Convert base64 to hex string
    const docHash = Buffer.from(base64Key, "base64").toString("hex");

    const docSlug = `${strippedTitle
      .toLowerCase()
      .split(" ")
      .join("-")}-${docHash}`;

    return docTitle ? docSlug : docHash;
  } catch (err) {
    console.error(err);
  }
};

const sendEmail = ({ recipientEmail, subject, message }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: recipientEmail,
    from: "info@thebkp.com",
    subject: subject,
    text: message,
    html: message
  };
  return sgMail.send(msg);
};

const getAddedAndRemovedTags = ({ prevTags, curTags }) => {
  prevTags = prevTags || [];
  var removedTags = prevTags.filter(function(prevTag) {
    return curTags.map(tag => tag.value).indexOf(prevTag.name) === -1;
  });
  var addedTags = curTags
    ? curTags.filter(tag => {
        return prevTags.map(prevTag => prevTag.name).indexOf(tag.value) === -1;
      })
    : [];
  return {
    addedTags,
    removedTags
  };
};

const hasNotificationPermission = async (userId, commentType) => {
  const COMMENT = 'comments_and_replies';
  const VOTE = 'upvotes_and_downvotes';

  try {
    const requester = await User.findOne({
      where: { id: userId }
    });
    const notificationConfig = requester.notification_config;
    switch (commentType) {
      case 'COMMENT':
        return notificationConfig[COMMENT];
      case 'VOTE':
        return notificationConfig[VOTE];
      default:
        return false;
    }
  } catch (err) {
    return false;
  }
};


module.exports = {
  isAdmin,
  ensureAuthentication,
  ensureAdminRole,
  ensureAdminRoleOrCommentOwnership,
  ensureAdminRoleOrOwnership,
  ensureResourceAccess,
  getEngagedUsers,
  createSlug,
  sendEmail,
  getAddedAndRemovedTags,
  hasNotificationPermission
};
