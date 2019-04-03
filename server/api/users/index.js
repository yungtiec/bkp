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
 * Getting a list of delegated users
 *
 * @name Get users
 * @route {GET} /api/users/delegated
 *
 */
router.get(
  "/delegated",
  ensureAuthentication,
  userController.getDelegatedUsers
);

/**
 * Getting user by handle
 *
 * @name Get user
 * @route {GET} /api/users/:userHandle
 * @authentication
 * @routeparam {Number} userHandle
 * @todo pagination
 *
 */
router.get(
  "/:userHandle",
  // ensureAuthentication,
  // nothing senstiive here, we can let users decide what to diclose in their profile later on
  userController.getUser
);

/**
 * Check if an user handle exists already
 *
 * @name Check user handle
 * @route {GET} /api/users/:userHandle/check-handle
 * @authentication
 * @routeparam {Number} userHandle
 * @todo pagination
 *
 */
router.get(
  "/:userHandle/check-handle",
  ensureAuthentication,
  userController.checkUserHandle
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
 * Getting a list of user's contributions
 *
 * @name Get user's contributions
 * @route {GET} /api/users/:userHandle/contributions
 * @authentication
 * @routeparam {Number} userHandle
 *
 */
router.get(
  "/:userHandle/contributions",
  // ensureAuthentication,
  // ensureCorrectRole,
  userController.getUserContributions
);

/**
 * Getting a list of user's documents
 *
 * @name Get user's document
 * @route {GET} /api/users/:userId/documents
 * @authentication
 * @routeparam {Number} userId
 *
 */
router.get(
  "/:userHandle/documents",
  // ensureAuthentication,
  // ensureCorrectRole,
  userController.getUserDocuments
);

/**
 * Getting a list of documents user has access to
 *
 * @name Get user's document
 * @route {GET} /api/users/:userId/authorized-documents
 * @authentication
 * @routeparam {Number} userId
 *
 */
router.get(
  "/:userId/authorized-documents",
  ensureAuthentication,
  ensureCorrectRole,
  userController.getUserAuthorizedDocuments
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
  "/:userHandle/comments",
  // ensureAuthentication,
  // nothing senstiive here, we can let users decide what to diclose in their profile later on
  userController.getUserComments
);

/**
 * Getting a list of user's votes
 *
 * @name Get user's upvotes and downvotes
 * @route {GET} /api/users/:userId/votes
 * @authentication
 * @routeparam {Number} userId
 *
 */
router.get(
  "/:userHandle/votes",
  // ensureAuthentication,
  // ensureCorrectRole,
  userController.getUserVotes
);
