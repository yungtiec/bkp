const router = require("express").Router();
const userController = require("./controller");
const { ensureAuthentication } = require("../utils");
module.exports = router;

const ensureCorrectRole = (req, res, next) => {
  if (!req.user.roles || !req.user.roles.length) {
    res.send([]);
    return;
  } else {
    next();
  }
};

/**
 * Getting a list of users
 *
 * @name Get users
 * @route {GET} /api/users
 * @todo pagination
 *
 */
router.get("/", ensureAuthentication, userController.getUsers);

/**
 * Getting user by id
 *
 * @name Get user
 * @route {GET} /api/users/:userId
 * @authentication
 * @routeparam {Number} userId
 * @todo pagination
 *
 */
router.get(
  "/:userId",
  ensureAuthentication,
  // nothing senstiive here, we can let users decide what to diclose in their profile later on
  userController.getUser
);

/**
 * Getting a list of projects user has access to
 *
 * @name Get user's project
 * @route {GET} /api/users/:userId/projects
 * @authentication
 * @routeparam {Number} userId
 *
 */
router.get(
  "/:userId/projects",
  ensureAuthentication,
  ensureCorrectRole,
  userController.getUserProjects
);

/**
 * Getting a list of documents user has access to
 *
 * @name Get user's document
 * @route {GET} /api/users/:userId/documents
 * @authentication
 * @routeparam {Number} userId
 *
 */
router.get(
  "/:userId/documents",
  ensureAuthentication,
  ensureCorrectRole,
  userController.getUserDocuments
);

/**
 * Getting user's comments
 *
 * @name Get user's comments
 * @route {GET} /api/users/:userId/comments
 * @authentication
 * @routeparam {Number} userId
 * @queryparam {Number} limit
 * @queryparam {Number} offset
 * @queryparam {Array} reviewStatus is the review status (pending, spam, or verified) selected by user
 * @queryparam {Array} projects is the project filter selected by user
* @queryparam {Array} issueStatus is the issues status (open or closed) selected by user
 *
 */
router.get(
  "/:userId/comments",
  ensureAuthentication,
  // nothing senstiive here, we can let users decide what to diclose in their profile later on
  userController.getUserComments
);
