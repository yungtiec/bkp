const router = require("express").Router({ mergeParams: true });
const versionController = require("./controllers/version-controller");
const questionController = require("./controllers/question-controller");
const answerController = require("./controllers/answer-controller");
const commentController = require("../documents/comment-controller");
const annotatorController = require("./controllers/annotator-controller");
const {
  ensureAuthentication,
  ensureResourceAccess,
  isAdmin
} = require("../utils");
const { Version } = require("../../db/models");
Promise = require("bluebird");
module.exports = router;

const ensureDocumentSubmissionOrOwnership = async (req, res, next) => {
  try {
    const version = await Version.scope({
      method: ["basic", req.params.versionId]
    }).findOne();
    if (
      !version.submitted &&
      //!isAdmin(req.user) &&
      (!req.user || (req.user && req.user.id !== version.creator.id))
    )
      res.sendStatus(401);
    else next();
  } catch (err) {
    next(err);
  }
};

/**
 * Getting version metadata by id, i.e creator, comments, contents...etc
 *
 * @name Get version
 * @route {GET} /api/versions/:versionId/metadata
 * @routeparam {Number} versionId
 *
 */
router.get(
  "/:versionId/metadata",
  ensureDocumentSubmissionOrOwnership,
  versionController.getMetadata
);

/**
 * Getting version metadata by version_slug, i.e creator, comments, contents...etc
 *
 * @name Get version
 * @route {GET} /api/versions/:versionId/metadata
 * @routeparam {Number} versionId
 *
 */
router.get(
  "/:version_slug/metadata",
  ensureDocumentSubmissionOrOwnership,
  versionController.getMetadataBySlug
);

/**
 * Updating version scorecard by id
 *
 * @name Put version
 * @route {PUT} /api/versions/:versionId/scorecard
 * @routeparam {Number} versionId
 * @bodyparam {Object} scorecard
 *
 */
router.put("/:versionId/scorecard", versionController.putScorecard);

/**
 * Updating version content_json by id
 *
 * @name Put version
 * @route {PUT} /api/versions/:versionId/content-json
 * @routeparam {Number} versionId
 * @bodyparam {Object} content_json
 *
 */
router.put("/:versionId/content-json", versionController.putContentJson);

/**
 * Getting version's contents (consisted of series of questions and answers) by id
 *
 * @name Get version contents
 * @route {GET} /api/versions/:versionId/questions
 * @routeparam {Number} versionId
 *
 */
router.get(
  "/:versionId/questions",
  ensureDocumentSubmissionOrOwnership,
  questionController.getQuestions
);

/**
 * Updating version's question by id is done by creating a new row in version question table and referencing the previous row as parent.
 *
 * @name Post version question
 * @route {POST} /api/versions/:versionId/questions
 * @authentication
 * @routeparam {Number} versionId
 * @bodyparam {Number} versionQuestionId
 * @bodyparam {String} markdown
 *
 */
router.post(
  "/:versionId/questions",
  ensureAuthentication,
  questionController.postQuestion
);

/**
 * Updating version's question by reverting to previous edit.
 *
 * @name Put version question
 * @route {PUT} /api/versions/:versionId/questions
 * @authentication
 * @routeparam {Number} versionId
 * @bodyparam {Number} versionQuestionId
 * @bodyparam {Number} prevVersionQuestionId
 *
 */
router.put(
  "/:versionId/questions",
  ensureAuthentication,
  questionController.putQuestion
);

/**
 * Updating version's answer by id is done by creating a new row in version answer table and referencing the previous row as parent.
 *
 * @name Post version answer
 * @route {POST} /api/versions/:versionId/answers
 * @authentication
 * @routeparam {Number} versionId
 * @bodyparam {Number} versionAnswerId
 * @bodyparam {String} markdown
 *
 */
router.post(
  "/:versionId/answers",
  ensureAuthentication,
  answerController.postAnswer
);

/**
 * Updating version's answer by reverting to previous edit.
 *
 * @name Put version answer
 * @route {PUT} /api/versions/:versionId/answers
 * @authentication
 * @routeparam {Number} versionId
 * @bodyparam {Number} versionAnswerId
 * @bodyparam {Number} prevVersionAnswerId
 *
 */
router.put(
  "/:versionId/answers",
  ensureAuthentication,
  answerController.putAnswer
);

/**
 * Getting version comments by version id
 *
 * @name Get version
 * @route {GET} /api/versions/:versionId/comments
 * @routeparam {Number} versionId
 *
 */
router.get(
  "/:versionId/comments",
  ensureDocumentSubmissionOrOwnership,
  commentController.getComments
);

/**
 * Posting comment
 *
 * @name Post comment
 * @route {POST} /api/versions/:versionId/comments
 * @authentication
 * @routeparam {Number} versionId
 * @bodyparam {String} newComment
 * @bodyparam {Boolean} issueOpen
 *
 */
router.post(
  "/:versionId/comments",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.postComment
);

/**
 * Posting reply
 *
 * @name Post reply
 * @route {POST} /api/versions/:versionId/comments/:parentId/reply
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} parentId
 * @bodyparam {String} newComment
 *
 */
router.post(
  "/:versionId/comments/:parentId/reply",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.postReply
);

/**
 * Posting upvote
 *
 * @name Post upvote
 * @route {POST} /api/versions/:versionId/comments/:commentId/upvote
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @bodyparam {Boolean} hasUpvoted
 *
 */
router.post(
  "/:versionId/comments/:commentId/upvote",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.postUpvote
);

/**
 * Updating comment
 *
 * @name Put comment
 * @route {PUT} /api/versions/:versionId/comments/:commentId/edit
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @bodyparam {String} newComment
 * @bodyparam {Array} tags
 * @bodyparam {Boolean} issueOpen
 *
 */
router.put(
  "/:versionId/comments/:commentId/edit",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.putEditedComment
);

/**
 * Removing comment's tag
 *
 * @name Delete comment's tag
 * @route {DELETE} /api/versions/:versionId/comments/:commentId/tags/:tagId
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @routeparam {Number} tagId
 *
 */
router.delete(
  "/:versionId/comments/:commentId/tags/:tagId",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.deleteTag
);

/**
 * Adding comment's tag
 *
 * @name Put comment's tag
 * @route {PUT} /api/versions/:versionId/comments/:commentId/tags
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @bodyparam {String} tagname
 *
 */
router.put(
  "/:versionId/comments/:commentId/tags",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.putTags
);

/**
 * Updating comment's review status
 *
 * @name Put comment's review status
 * @route {PUT} /api/versions/:versionId/comments/:commentId/verify
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @bodyparam {String} reviewed
 *
 */
router.put(
  "/:versionId/comments/:commentId/verify",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.putCommentStatus
);

/**
 * Updating comment's issue status
 *
 * @name Put comment's issue status
 * @route {PUT} /api/versions/:versionId/comments/:commentId/issue
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @bodyparam {Boolean} open is the boolean indicating issue's status (open or closed)
 *
 */
router.put(
  "/:versionId/comments/:commentId/issue",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.putCommentIssueStatus
);

/**
 * Getting version annotated comments by version id
 *
 * @name Get version
 * @route {GET} /api/versions/:versionId/annotator
 * @routeparam {Number} versionId
 * @queryparam {Number} versionId
 * @queryparam {Number} version_question_id
 * @todo camelcase version_question_id
 * @todo handle duplicated arguments in query and route param
 *
 */
router.get(
  "/:versionId/annotator",
  ensureDocumentSubmissionOrOwnership,
  annotatorController.getAnnotatedComments
);

/**
 * Posting annotated comment
 *
 * @name Post annotated comment
 * @route {POST} /api/versions/:versionId/annotator
 * @routeparam {Number} versionId
 * @bodyparam {Object} range defines the location of annotation
 * @bodyparam {String} quote is the annotated text
 * @bodyparam {String} text is the user's comment,
 * @bodyparam {String} uri is the address of the page
 * @bodyparam {Number} version_id
 * @bodyparam {Number} version_question_id
 * @bodyparam {Array} tags is not used currently
 *
 */
router.post(
  "/:versionId/annotator",
  ensureAuthentication,
  ensureResourceAccess,
  annotatorController.postAnnotatedComment
);
