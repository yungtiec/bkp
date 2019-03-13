const router = require("express").Router();
const { ensureAuthentication, ensureResourceAccess } = require("../utils");
const questionController = require("./controller");
module.exports = router;

/**
 * Getting all questions
 *
 * @name Get questions
 * @route {GET} /api/questions
 * @todo pagination/loading on scroll
 *
 */
router.get("/", questionController.getQuestions);

/**
 * Posting question
 *
 * @name Post question
 * @route {POST} /api/questions
 * @body {Object} question object
 *
 */
router.post("/", questionController.postQuestion);

/**
 * Getting question by id
 *
 * @name Get question by tag
 * @route {GET} /api/questions/:slug
 * @routeparam {String} slug
 *
 */
router.get("/:slug", questionController.getQuestionBySlug);

/**
 * Upvote question
 *
 * @name Post upvote
 * @authentication
 * @route {POST} /api/questions/:questionId/upvote
 * @authentication
 * @routeparam {Number} questionId
 * @bodyparam {Boolean} hasUpvoted
 * @bodyparam {Boolean} hasDownvoted
 *
 */
router.post(
  "/:questionId/upvote",
  ensureAuthentication,
  ensureResourceAccess,
  questionController.postUpvote
);

/**
 * Downvote question
 *
 * @name Post downvote
 * @route {POST} /api/questions/:questionId/downvote
 * @authentication
 * @routeparam {Number} questionId
 * @bodyparam {Boolean} hasUpvoted
 * @bodyparam {Boolean} hasDownvoted
 *
 */
router.post(
  "/:questionId/downvote",
  ensureAuthentication,
  ensureResourceAccess,
  questionController.postDownvote
);

/**
 * Comment on question
 *
 * @name Post comment
 * @route {POST} /api/questions/:questionId/comment
 * @authentication
 * @routeparam {Number} questionId
 * @bodyparam {String} comment
 *
 */
router.post(
  "/:questionId/comments",
  ensureAuthentication,
  ensureResourceAccess,
  questionController.postComment
);

/**
 * Get a list of comments on question
 *
 * @name Get question's comments
 * @route {GET} /api/questions/:questionId/comment
 * @authentication
 * @routeparam {Number} questionId
 * @queryparam {Number} offset
 * @queryparam {Number} limit
 * @queryparam {string} order
 *
 */
router.get("/:slug/comments", questionController.getComments);
