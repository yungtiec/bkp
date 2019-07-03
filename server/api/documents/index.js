const router = require("express").Router({ mergeParams: true });
const commentController = require("./comment-controller");
const annotatorController = require("./annotator-controller");
const {
  isAdmin,
  ensureAuthentication,
  ensureResourceAccess,
  getEngagedUsers
} = require("../utils");
const { Document, Version } = require("../../db/models");
const documentController = require("./controller");
module.exports = router;

const ensureDocumentSubmissionOrOwnership = async (req, res, next) => {
  // if document has only one version, make sure the version is submitted
  try {
    let document;
    if (req.params.version_slug) {
      document = await Document.findOne({
        where: { slug: req.params.version_slug }
      });
    }
    if (req.params.doc_id) {
      document = await Document.findOne({ where: { id: req.params.doc_id } });
    }
    const isCreator =
      document && req.user && req.user.id === document.creator_id;
    const isCollaborator =
      document &&
      req.user &&
      document.collaborators &&
      document.collaborators.filter(c => req.user.id !== c.id).length;

    const documentSubmitted = document && document.submitted;
    const hasPermission = isCreator || isCollaborator;
    const isUserAdmin = !!isAdmin(req.user);

    if (documentSubmitted || hasPermission || isUserAdmin) {
      next();
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

router.get(
  "/:doc_id/comments",
  ensureDocumentSubmissionOrOwnership,
  documentController.getComments
);

/**
 * Getting a list of documents
 *
 * @name Get documents
 * @route {GET} /api/documents
 * @queryparam {Number} limit
 * @queryparam {Number} offset
 *
 */
router.get("/", documentController.rawSqlGetDocumentsWithFilters);

/**
 *
 */
router.get("/all", documentController.getDocumentsWithFilters);

/**
 * Getting a list of feature documents
 *
 * @name Get feature documents
 * @route {GET} /api/documents/feature
 * @queryparam {Number} limit
 * @queryparam {Number} offset
 *
 */
router.get("/feature", documentController.getFeatureDocuments);

/**
 * Getting a list of feature documents
 *
 * @name Get feature documents
 * @route {GET} /api/documents/feature
 * @queryparam {Number} limit
 * @queryparam {Number} offset
 *
 */
router.get("/featured", documentController.getFeaturedDocuments);

/**
 * Getting a list of user's drafts
 *
 * @name Get a list of user's drafts
 * @route {GET} /api/documents/drafts
 * @queryparam {Number} limit
 * @queryparam {Number} offset
 *
 */
router.get("/drafts", ensureAuthentication, documentController.getDrafts);

/**
 * Getting a list of user's drafts
 *
 * @name Get a list of user's drafts
 * @route {GET} /api/documents/drafts
 * @queryparam {Number} limit
 * @queryparam {Number} offset
 *
 */
router.get(
  "/drafts/:versionSlug",
  ensureAuthentication,
  documentController.getDraftBySlug
);

/**
 * Getting a list of user's published documents
 *
 * @name Get a list of user's published documents
 * @route {GET} /api/documents/published
 * @queryparam {Number} limit
 * @queryparam {Number} offset
 *
 */
router.get(
  "/published",
  ensureAuthentication,
  documentController.getPublishedDocuments
);

/**
 * Getting document metadata by version_slug, i.e upvotes, downvotes, creator, versions...etc
 *
 * @name Get document
 * @route {GET} /api/documents/:documentId
 * @routeparam {Number} documentId
 *
 */
router.get(
  "/slug/:version_slug",
  ensureDocumentSubmissionOrOwnership,
  documentController.getDocumentBySlug
);

/**
 * Getting document's latest version's contents (consisted of series of questions and answers) by version_slug
 *
 * @name Get document contents
 * @route {GET} /api/documents/:documentId/questions
 * @routeparam {Number} documentId
 *
 */
router.get(
  "/slug/:version_slug/questions",
  ensureDocumentSubmissionOrOwnership,
  documentController.getDocumentLatestQuestionBySlug
);

/**
 * Getting document metadata by id, i.e upvotes, downvotes, creator, versions...etc
 *
 * @name Get document
 * @route {GET} /api/documents/:documentId
 * @routeparam {Number} documentId
 *
 */
router.get(
  "/:documentId",
  ensureDocumentSubmissionOrOwnership,
  documentController.getDocument
);

/**
 * Getting document's latest version's contents (consisted of series of questions and answers) by id
 *
 * @name Get document contents
 * @route {GET} /api/documents/:documentId/questions
 * @routeparam {Number} documentId
 *
 */
router.get(
  "/:documentId/questions",
  ensureDocumentSubmissionOrOwnership,
  documentController.getDocumentLatestQuestion
);

/**
 * put document metadata by id
 *
 * @name Put document
 * @route {PUT} /api/documents/:documentId
 * @routeparam {Number} documentId
 *
 */
router.put(
  "/:documentId",
  ensureDocumentSubmissionOrOwnership,
  documentController.putDocument
);

/**
 * Posting document executes a series of database queries, including creating document, first version, questions and answers, and setting up associations.
 *
 * @name Post document
 * @route {POST} /api/documents
 * @authentication
 * @bodyparam {String} selectedProjectSymbol
 * @bodyparam {String} markdown is the md file uploaded by user, ready to be parsed into questions and answers
 * @bodyparam {Number} commentPeriodValue is the duration of the open period for the public comment initiative
 * @bodyparam {Number} commentPeriodUnit is the unit of comment period (days, weeks, and months)
 * @bodyparam {Object} scorecard
 * @bodyparam {String} versionNumber is specified by uploader
 * @bodyparam {Array} collaboratorEmails
 *
 */
router.post(
  "/",
  ensureAuthentication,
  ensureResourceAccess,
  documentController.postDocument
);

/**
 * Posting a new version executes a series of database queries, including creating version, questions and answers, and setting up associations.
 *
 * @name Post new version to document
 * @route {POST} /api/documents/:parentVersionId
 * @authentication
 * @routeparam {Number} parentVersionId is the version id of the last version
 * @bodyparam {String} markdown is the md file uploaded by user, ready to be parsed into questions and answers
 * @bodyparam {Array} resolvedIssueIds is an array of ids of issues resolved by the uploaded version
 * @bodyparam {Array} newResolvedIssues is an array of issues resolved by the uploaded version not previously raised by the community
 * @bodyparam {Number} commentPeriodValue is the duration of the open period for the public comment initiative
 * @bodyparam {Number} commentPeriodUnit is the unit of comment period (days, weeks, and months)
 * @bodyparam {Object} scorecard
 * @bodyparam {String} versionNumber is specified by uploader
 * @bodyparam {Array} collaboratorEmails
 *
 */
router.post(
  "/:parentVersionId",
  ensureAuthentication,
  ensureResourceAccess,
  documentController.postNewVersion
);

/**
 * Upvote document
 *
 * @name Post upvote
 * @authentication
 * @route {POST} /api/documents/:documentId/upvote
 * @authentication
 * @routeparam {Number} documentId
 * @bodyparam {Boolean} hasUpvoted
 * @bodyparam {Boolean} hasDownvoted
 *
 */
router.post(
  "/:documentId/upvote",
  ensureAuthentication,
  ensureResourceAccess,
  documentController.postUpvote
);

/**
 * Downvote document
 *
 * @name Post downvote
 * @route {POST} /api/documents/:documentId/downvote
 * @authentication
 * @routeparam {Number} documentId
 * @bodyparam {Boolean} hasUpvoted
 * @bodyparam {Boolean} hasDownvoted
 *
 */
router.post(
  "/:documentId/downvote",
  ensureAuthentication,
  ensureResourceAccess,
  documentController.postDownvote
);

router.put(
  "/slug/:slug",
  ensureAuthentication,
  ensureResourceAccess,
  documentController.putDocumentContentHTMLBySlug
);

router.put(
  "/slug/:slug/status",
  ensureAuthentication,
  ensureResourceAccess,
  documentController.updateDocumentStatus
);

/**
 * Getting version comments by version id
 *
 * @name Get version
 * @route {GET} /api/versions/:doc_id/comments
 * @routeparam {Number} versionId
 *
 */
router.get(
  "/:doc_id/comments",
  ensureDocumentSubmissionOrOwnership,
  commentController.getComments
);

/**
 * Posting comment
 *
 * @name Post comment
 * @route {POST} /api/versions/:doc_id/comments
 * @authentication
 * @routeparam {Number} versionId
 * @bodyparam {String} newComment
 * @bodyparam {Boolean} issueOpen
 *
 */
router.post(
  "/:doc_id/comments",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.postComment
);

/**
 * Posting reply
 *
 * @name Post reply
 * @route {POST} /api/versions/:doc_id/comments/:parentId/reply
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} parentId
 * @bodyparam {String} newComment
 *
 */
router.post(
  "/:doc_id/comments/:parentId/reply",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.postReply
);

/**
 * Posting upvote
 *
 * @name Post upvote
 * @route {POST} /api/versions/:doc_id/comments/:commentId/upvote
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @bodyparam {Boolean} hasUpvoted
 *
 */
router.post(
  "/:doc_id/comments/:commentId/upvote",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.postUpvote
);

/**
 * Updating comment
 *
 * @name Put comment
 * @route {PUT} /api/versions/:doc_id/comments/:commentId/edit
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @bodyparam {String} newComment
 * @bodyparam {Array} tags
 * @bodyparam {Boolean} issueOpen
 *
 */
router.put(
  "/:doc_id/comments/:commentId/edit",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.putEditedComment
);

/**
 * Removing comment's tag
 *
 * @name Delete comment's tag
 * @route {DELETE} /api/versions/:doc_id/comments/:commentId/tags/:tagId
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @routeparam {Number} tagId
 *
 */
router.delete(
  "/:doc_id/comments/:commentId/tags/:tagId",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.deleteTag
);

/**
 * Adding comment's tag
 *
 * @name Put comment's tag
 * @route {PUT} /api/versions/:doc_id/comments/:commentId/tags
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @bodyparam {String} tagname
 *
 */
router.put(
  "/:doc_id/comments/:commentId/tags",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.putTags
);

/**
 * Updating comment's review status
 *
 * @name Put comment's review status
 * @route {PUT} /api/versions/:doc_id/comments/:commentId/verify
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @bodyparam {String} reviewed
 *
 */
router.put(
  "/:doc_id/comments/:commentId/verify",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.putCommentStatus
);

/**
 * Updating comment's issue status
 *
 * @name Put comment's issue status
 * @route {PUT} /api/versions/:doc_id/comments/:commentId/issue
 * @authentication
 * @routeparam {Number} versionId
 * @routeparam {Number} commentId
 * @bodyparam {Boolean} open is the boolean indicating issue's status (open or closed)
 *
 */
router.put(
  "/:doc_id/comments/:commentId/issue",
  ensureAuthentication,
  ensureResourceAccess,
  commentController.putCommentIssueStatus
);

/**
 * Getting doc annotated comments by doc id
 *
 * @name Get doc
 * @route {GET} /api/documents/:doc_id/annotator
 * @routeparam {Number} doc_id
 * @todo camelcase version_question_id
 * @todo handle duplicated arguments in query and route param
 *
 */
router.get(
  "/:doc_id/annotator",
  //ensureDocumentSubmissionOrOwnership,
  annotatorController.getAnnotatedComments
);

/**
 * Posting annotated comment
 *
 * @name Post annotated comment
 * @route {POST} /api/documents/:doc_id/annotator
 * @routeparam {Number} doc_id
 * @bodyparam {Object} range defines the location of annotation
 * @bodyparam {String} quote is the annotated text
 * @bodyparam {String} text is the user's comment,
 * @bodyparam {String} uri is the address of the page
 * @bodyparam {Number} doc_id
 *
 */
router.post(
  "/:doc_id/annotator",
  ensureAuthentication,
  ensureResourceAccess,
  annotatorController.postAnnotatedComment
);
