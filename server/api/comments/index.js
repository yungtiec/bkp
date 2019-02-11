const router = require("express").Router({ mergeParams: true });
const {
  isAdmin,
  ensureAuthentication,
  ensureResourceAccess,
  getEngagedUsers
} = require("../utils");
const { Comment } = require("../../db/models");
const controller = require("./controller");
module.exports = router;

/**
 * Getting a list of comments
 *
 * @name Get comments
 * @route {GET} /api/comments
 * @queryparam {Number} limit
 * @queryparam {Number} offset
 *
 */
router.get("/", controller.getComments);
