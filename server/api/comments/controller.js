const router = require("express").Router({ mergeParams: true });
const db = require("../../db/index");
const permission = require("../../access-control")["Comment"];
const {
  Comment,
  User,
  Role,
  Tag,
  Issue,
  Notification,
  Project,
  ProjectAdmin,
  ProjectEditor
} = require("../../db/models/index");
const _ = require("lodash");
Promise = require("bluebird");

const getComments = async (req, res, next) => {
  try {
    var options = {
      offset: req.query.offset,
      order: [["createdAt", "DESC"]]
    };
    if (req.query.limit) options.limit = req.query.limit;
    const comments = await Comment.getCommentsWitRoot(options)
    res.send(comments);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getComments
};
