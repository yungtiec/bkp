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

/**
 * Posting reply
 *
 * @name Post reply
 * @route {POST} /api/questions/:questionId/comments/:parentId/reply
 * @authentication
 * @routeparam {Number} questionId
 * @routeparam {Number} parentId
 * @bodyparam {String} newComment
 *
 */
router.post(
  "/:questionId/comments/:parentId/reply",
  ensureAuthentication,
  ensureResourceAccess,
  questionController.postReply
);

/**
 * Posting upvote
 *
 * @name Post upvote
 * @route {POST} /api/questions/:questionId/comments/:commentId/upvote
 * @authentication
 * @routeparam {Number} questionId
 * @routeparam {Number} commentId
 * @bodyparam {Boolean} hasUpvoted
 *
 */
router.post(
  "/:questionId/comments/:commentId/upvote",
  ensureAuthentication,
  ensureResourceAccess,
  questionController.postCommentUpvote
);

/**
 * Updating comment
 *
 * @name Put comment
 * @route {PUT} /api/questions/:questionId/comments/:commentId/edit
 * @authentication
 * @routeparam {Number} questionId
 * @routeparam {Number} commentId
 * @bodyparam {String} newComment
 * @bodyparam {Array} tags
 * @bodyparam {Boolean} issueOpen
 *
 */
router.put(
  "/:questionId/comments/:commentId/edit",
  ensureAuthentication,
  ensureResourceAccess,
  questionController.putEditedComment
);
