const router = require("express").Router({ mergeParams: true });
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
    const version = await Version.findOne({version_slug : req.params.version_slug});
    const documentId = version.document_id;
    const document = await Document.scope({
      method: [
        "includeVersions",
        {
          documentId: documentId
        }
      ]
    }).findOne();
    const isNotCreator =
      document && req.user && req.user.id !== document.creator_id;
    const isNotCollaborator =
      document &&
      req.user &&
      document.collaborators &&
      !document.collaborators.filter(c => req.user.id !== c.id).length;

    if (
      !document ||
      (document &&
        document.versions &&
        !document.versions[0].submitted &&
        //!isAdmin(req.user) &&
        (!req.user || (isNotCreator && isNotCollaborator)))
    )
      res.sendStatus(404);
    else next();
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
router.get("/", documentController.getDocuments);

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
