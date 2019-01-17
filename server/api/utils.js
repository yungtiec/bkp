const { User, Role, Comment } = require("../db/models");
const _ = require("lodash");
const crypto = require("crypto");

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
  var commentators = _
    .uniqBy(comments.map(c => c.owner.toJSON()), "id")
    .filter(
      c => collaboratorEmails.indexOf(c.email) === -1 && c.id !== creator.id
    );
  // we might want to tailor the notification based on their action
  return commentators;
};

const createSlug = async (docTitle, contentHtml) => {
  const sha256 = crypto.createHash("sha256");

  try {
    // Hash the original version obj as a JSON string
    // Convert the hash to base64 ([a-z], [A-Z], [0-9], +, /)
    const hash = sha256.update(contentHtml).digest("base64");

    // This is the  base64 key that corresponds to the given JSON string
    const base64Key = hash.slice(0, 8);

    // Convert base64 to hex string
    const docHash = Buffer.from(base64Key, "base64").toString("hex");

    const docSlug = `${docTitle
      .toLowerCase()
      .split(" ")
      .join("-")}-${docHash}`;

    return docTitle ? docSlug : docHash;
  } catch (err) {
    console.error(err);
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
  createSlug
};
