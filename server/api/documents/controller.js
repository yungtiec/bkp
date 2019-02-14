const Sequelize = require("sequelize");
const permission = require("../../access-control")["Disclosure"];
const {
  User,
  Project,
  Version,
  Document,
  VersionQuestion,
  VersionAnswer,
  Notification,
  Question,
  DocumentCollaborator,
  Issue,
  ProjectAdmin,
  ProjectEditor,
  WizardSchema,
  Comment
} = require("../../db/models");
const { getEngagedUsers, createSlug } = require("../utils");
const moment = require("moment");
const _ = require("lodash");
const MarkdownParsor = require("../../../script/markdown-parser");
const crypto = require("crypto");
Promise = require("bluebird");

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.scope({
      method: [
        "flatThreadByRootId",
        {
          where: {
            doc_id: req.params.doc_id,
            hierarchyLevel: 1
          }
        }
      ]
    }).findAll();
    res.send(comments);
  } catch (err) {
    next(err);
  }
};

const getFeatureDocuments = async (req, res, next) => {
  try {
    const documents = await Document.findAll({
      where: { feature: true },
      include: [
        {
          model: User,
          as: "collaborators",
          through: {
            model: DocumentCollaborator,
            where: { revoked_access: false }
          },
          required: false
        },
        {
          model: User,
          as: "creator"
        }
      ]
    });

    res.send(documents);
  } catch (err) {
    next(err);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    var options = {
      offset: req.query.offset
    };
    if (req.query.limit) options.limit = req.query.limit;
    const { count, documents } = await Document.getDocumentsWithStats(options);
    res.send({ count, documents });
  } catch (err) {
    next(err);
  }
};

const getDocumentsWithFilters = async (req, res, next) => {
  try {
    var where;
    if (req.query.order) req.query.order = JSON.parse(req.query.order);
    if (req.query.category)
      req.query.category = req.query.category.map(JSON.parse);
    var formattedSearchTerms;
    if (!req.query.search) formattedSearchTerms = null;
    else {
      var queryArray = req.query.search.trim().split(" ");
      formattedSearchTerms = queryArray
        .map(function(phrase) {
          return "%" + phrase + "%";
        })
        .join("");
    }
    var limit = Number(req.query.limit);
    var offset = Number(req.query.offset);
    var category =
      req.query.category && req.query.category.length
        ? {
            [Sequelize.Op.or]: req.query.category.map(c => ({
              [Sequelize.Op.eq]: c.value
            }))
          }
        : null;
    var order = req.query.order;
    var attributes;
    if (order && order.value === "date") {
      order = [["createdAt", "DESC"]];
    } else if (order && order.value === "most-upvoted") {
      order = [[Sequelize.literal("num_upvotes"), "DESC"]];
    } else if (order && order.value === "most-discussed") {
      order = [[Sequelize.literal("num_comments"), "DESC"]];
    }
    if (category) where = { category };
    if (formattedSearchTerms)
      where = where
        ? _.assign(where, { title: { $iLike: formattedSearchTerms } })
        : { title: { $iLike: formattedSearchTerms } };
    var options = {
      offset,
      order
    };
    if (req.query.limit) options.limit = limit;
    var documentQueryResult = await Document.scope({
      method: ["includeAllEngagements", where]
    }).findAndCountAll(options);
    res.send(documentQueryResult.rows);
  } catch (err) {
    next(err);
  }
};

const getDrafts = async (req, res, next) => {
  try {
    const { count, rows } = await Document.findAndCountAll({
      where: { creator_id: req.user.id, submitted: true, reviewed: false },
      limit: Number(req.query.limit),
      order: [["createdAt", "DESC"]]
    });
    res.send({ count, rows });
  } catch (err) {
    next(err);
  }
};

const getPublishedDocuments = async (req, res, next) => {
  try {
    const { count, rows } = await Document.findAndCountAll({
      where: { creator_id: req.user.id, submitted: true, reviewed: true },
      limit: Number(req.query.limit),
      order: [["createdAt", "DESC"]]
    });
    res.send({ count, rows });
  } catch (err) {
    next(err);
  }
};

const getDocumentBySlug = async (req, res, next) => {
  try {
    const document = await Document.scope({
      method: ["includeOutstandingIssues", { slug: req.params.version_slug }]
    }).findOne();
    res.send(document);
  } catch (err) {
    next(err);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const document = await Document.scope({
      method: [
        "includeOutstandingIssues",
        { documentId: req.params.documentId }
      ]
    }).findOne();
    res.send(document);
  } catch (err) {
    next(err);
  }
};

const getDraftBySlug = async (req, res, next) => {
  try {
    var version = await Version.scope({
      method: ["bySlugWithDocumentAndWizardSchemas", req.params.versionSlug]
    }).findOne();
    res.send({
      version: _.omit(version.toJSON(), ["document", "wizard_schema"]),
      document: version.document,
      wizardSchema: version.wizard_schema,
      project: version.document.project
    });
  } catch (err) {
    next(err);
  }
};

const getDocumentLatestQuestionBySlug = async (req, res, next) => {
  try {
    const versionBySlug = await Version.findOne({
      where: { version_slug: req.params.version_slug }
    });
    const document = await Document.scope({
      method: ["includeVersions", { documentId: versionBySlug.document_id }]
    }).findOne();
    const latestVersionId = _.maxBy(document.versions, "hierarchyLevel").id;
    var rawVersion = await Version.scope({
      method: ["byIdWithVersionQuestions", latestVersionId]
    }).findOne();
    var version_questions = rawVersion.version_questions.map(vq => {
      vq = addHistory(vq);
      vq.version_answers[0] = addHistory(vq.version_answers[0]);
      return vq;
    });
    var version = _.assignIn(rawVersion.toJSON(), { version_questions });
    res.send(version);
  } catch (err) {
    next(err);
  }
};

const getDocumentLatestQuestion = async (req, res, next) => {
  try {
    const document = await Document.scope({
      method: ["includeVersions", { documentId: req.params.documentId }]
    }).findOne();
    const latestVersionId = _.maxBy(document.versions, "hierarchyLevel").id;
    var rawVersion = await Version.scope({
      method: ["byIdWithVersionQuestions", latestVersionId]
    }).findOne();
    var version_questions = rawVersion.version_questions.map(vq => {
      vq = addHistory(vq);
      vq.version_answers[0] = addHistory(vq.version_answers[0]);
      return vq;
    });
    var version = _.assignIn(rawVersion.toJSON(), { version_questions });
    res.send(version);
  } catch (err) {
    next(err);
  }
};

const addHistory = versionQuestionOrAnswer => {
  versionQuestionOrAnswer = versionQuestionOrAnswer.toJSON
    ? versionQuestionOrAnswer.toJSON()
    : versionQuestionOrAnswer;
  versionQuestionOrAnswer.history = (versionQuestionOrAnswer.ancestors || [])
    .concat([_.omit(versionQuestionOrAnswer, ["ancestors"])])
    .concat(versionQuestionOrAnswer.descendents || []);
  delete versionQuestionOrAnswer["ancestors"];
  delete versionQuestionOrAnswer["descendents"];
  return versionQuestionOrAnswer;
};

const putDocumentContentHTMLBySlug = async (req, res, next) => {
  try {
    const documentToUpdate = await Document.findOne({
      where: { slug: req.params.slug }
    });
    documentToUpdate.description = req.body.description;
    documentToUpdate.content_html = req.body.contentHTML;
    documentToUpdate.reviewed = req.body.status;
    documentToUpdate.category = req.body.category
      ? req.body.category.value
      : null;
    documentToUpdate.header_img_url = req.body.headerImageUrl;
    const document = await documentToUpdate.save();
    res.send(document);
  } catch (err) {
    next(err);
  }
};

const postDocument = async (req, res, next) => {
  try {
    switch (req.body.documentFormat) {
      case "markdown":
        return createDocumentByMarkdown(req, res, next);
      case "wizard":
        return createDocumentWithSchemaId(req, res, next);
      case "html":
        return createDocumentFromHtml(req, res, next);
      default:
        res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

const createDocumentByMarkdown = async (req, res, next) => {
  const project = await Project.findOne({
    where: { symbol: req.body.selectedProjectSymbol },
    include: [
      {
        model: User,
        through: ProjectAdmin,
        as: "admins"
      },
      {
        model: User,
        through: ProjectEditor,
        as: "editors"
      }
    ]
  });
  const canCreate = permission("Create", { project }, req.user);
  if (!canCreate) {
    res.sendStatus(403);
    return;
  }
  const markdownParsor = new MarkdownParsor({
    markdown: req.body.markdown || ""
  });
  const document = await Document.create({
    title: markdownParsor.title,
    creator_id: req.user.id,
    project_id: project.id,
    latest_version: 1
  });
  const commentUntilInUnix = moment()
    .add(req.body.commentPeriodValue, req.body.commentPeriodUnit)
    .format("x");
  const versionObj = {
    document_id: document.id,
    creator_id: req.user.id,
    comment_until_unix: commentUntilInUnix,
    scorecard: req.body.scorecard,
    version_number: req.body.versionNumber
  };
  const versionSlug = await createSlug(
    document.title || req.body.title,
    versionObj
  );
  const versionWithSlug = Object.assign(
    { version_slug: versionSlug },
    versionObj
  );
  const version = await Version.create(versionWithSlug);

  const questionInstances = await Promise.map(
    markdownParsor.questions,
    async questionObject => {
      var answer = markdownParsor.findAnswerToQuestion(
        questionObject.order_in_version
      );
      var versionQuestion = await VersionQuestion.create({
        version_id: version.id,
        markdown: `### ${questionObject.question.trim()}`,
        order_in_version: questionObject.order_in_version,
        latest: true
      });
      await VersionAnswer.create({
        markdown: answer,
        version_question_id: versionQuestion.id,
        version_id: version.id,
        latest: true
      });
    }
  );
  const collaborators = req.body.collaboratorEmails
    ? req.body.collaboratorEmails
        .map(emailOption => emailOption.value)
        .map(
          async email =>
            await User.findOne({ where: { email } }).then(user =>
              DocumentCollaborator.create({
                user_id: user ? user.id : null,
                email,
                document_id: document.id
              }).then(collaborator => {
                return Notification.notifyCollaborators({
                  sender: req.user,
                  collaboratorId: user.id,
                  versionId: version.id,
                  projectSymbol: project.symbol,
                  parentVersionTitle: document.title,
                  action: "created"
                });
              })
            )
        )
    : null;
  res.send(Object.assign({ document }, version.toJSON()));
};

const createDocumentWithSchemaId = async (req, res, next) => {
  const canCreate = permission("Create", { project: null }, req.user);
  if (!canCreate) {
    res.sendStatus(403);
    return;
  }
  const document = await Document.create({
    title: "",
    creator_id: req.user.id,
    latest_version: 1,
    document_type: req.body.documentType
  });
  const commentUntilInUnix = moment()
    .add(req.body.commentPeriodValue, req.body.commentPeriodUnit)
    .format("x");
  const versionObj = {
    document_id: document.id,
    creator_id: req.user.id,
    comment_until_unix: commentUntilInUnix,
    version_number: "1"
  };
  const versionSlug = await createSlug("", versionObj);
  const versionWithSlug = Object.assign(
    {
      version_slug: versionSlug,
      wizard_schema_id: req.body.wizardSchemaId
    },
    versionObj
  );
  const [version, wizardSchema] = await Promise.all([
    Version.create(versionWithSlug),
    WizardSchema.findById(req.body.wizardSchemaId)
  ]);
  const collaborators = req.body.collaboratorEmails
    ? req.body.collaboratorEmails
        .map(emailOption => emailOption.value)
        .map(
          async email =>
            await User.findOne({ where: { email } }).then(user =>
              DocumentCollaborator.create({
                user_id: user ? user.id : null,
                email,
                document_id: document.id
              }).then(collaborator => {
                return Notification.notifyCollaborators({
                  sender: req.user,
                  collaboratorId: user.id,
                  versionId: version.id,
                  projectSymbol: project.symbol,
                  parentVersionTitle: document.title,
                  action: "created"
                });
              })
            )
        )
    : null;
  res.send({ version, document, wizardSchema });
};

const createDocumentFromHtml = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { symbol: req.body.selectedProjectSymbol },
      include: [
        {
          model: User,
          through: ProjectAdmin,
          as: "admins"
        },
        {
          model: User,
          through: ProjectEditor,
          as: "editors"
        }
      ]
    });
    const canCreate = permission("Create", { project }, req.user);
    if (!canCreate) {
      res.sendStatus(403);
      return;
    }
    const commentUntilInUnix = moment()
      .add(req.body.commentPeriodValue, req.body.commentPeriodUnit)
      .format("x");

    const slug = await createSlug(req.body.title.toLowerCase(), req.body.contentHtml);

    const document = await Document.create({
      title: req.body.title,
      header_img_url: req.body.headerImageUrl,
      creator_id: req.user.id,
      project_id: project ? project.id : null,
      comment_until_unix: commentUntilInUnix,
      content_html: req.body.contentHtml,
      submitted: true,
      description: req.body.description,
      category: req.body.category ? req.body.category.value : null,
      slug
    });

    const collaborators = req.body.collaboratorEmails
      ? req.body.collaboratorEmails
          .map(emailOption => emailOption.value)
          .map(
            async email =>
              await User.findOne({ where: { email } }).then(user =>
                DocumentCollaborator.create({
                  user_id: user ? user.id : null,
                  email,
                  document_id: document.id
                }).then(collaborator => {
                  return Notification.notifyCollaborators({
                    sender: req.user,
                    collaboratorId: user.id,
                    versionId: version.id,
                    projectSymbol: project.symbol,
                    parentVersionTitle: document.title,
                    action: "created"
                  });
                })
              )
          )
      : null;
    res.send(document);
  } catch (err) {
    next(err);
  }
};

const postUpvote = async (req, res, next) => {
  try {
    if (req.body.hasDownvoted)
      await req.user.removeDownvotedDocuments(req.params.documentId);
    if (!req.body.hasUpvoted) {
      await req.user.addUpvotedDocuments(req.params.documentId);
    } else {
      await req.user.removeUpvotedDocuments(req.params.documentId);
    }
    const [upvotesFrom, downvotesFrom] = await Document.findById(
      req.params.documentId
    ).then(ps => Promise.all([ps.getUpvotesFrom(), ps.getDownvotesFrom()]));
    res.send([upvotesFrom, downvotesFrom]);
  } catch (err) {
    next(err);
  }
};

const postDownvote = async (req, res, next) => {
  try {
    if (req.body.hasUpvoted)
      await req.user.removeUpvotedDocuments(req.params.documentId);
    if (!req.body.hasDownvoted) {
      await req.user.addDownvotedDocuments(req.params.documentId);
    } else {
      await req.user.removeDownvotedDocuments(req.params.documentId);
    }
    const [upvotesFrom, downvotesFrom] = await Document.findById(
      req.params.documentId
    ).then(ps => Promise.all([ps.getUpvotesFrom(), ps.getDownvotesFrom()]));
    res.send([upvotesFrom, downvotesFrom]);
  } catch (err) {
    next(err);
  }
};

const postNewVersion = async (req, res, next) => {
  try {
    var {
      markdown,
      resolvedIssueIds,
      newResolvedIssues,
      commentPeriodUnit,
      commentPeriodValue,
      versionNumber,
      scorecard
    } = req.body;
    var collaboratorEmails = req.body.collaboratorEmails.map(
      emailOption => emailOption.value
    );
    var parentVersion = await Version.scope({
      method: ["byIdWithMetadata", Number(req.params.parentVersionId)]
    }).findOne();
    var project = await Project.findOne({
      where: { symbol: parentVersion.document.project.symbol },
      include: [
        {
          model: User,
          through: ProjectAdmin,
          as: "admins"
        },
        {
          model: User,
          through: ProjectEditor,
          as: "editors"
        }
      ]
    });
    const canVersion = permission(
      "Version",
      { project, disclosure: parentVersion.document },
      req.user
    );
    if (!canVersion) {
      res.sendStatus(403);
      return;
    }
    var markdownParsor = new MarkdownParsor({ markdown: markdown });
    var commentUntilInUnix = moment()
      .add(commentPeriodValue, commentPeriodUnit)
      .format("x");
    var version = await Version.create({
      document_id: parentVersion.document.id,
      creator_id: req.user.id,
      comment_until_unix: commentUntilInUnix,
      version_number: versionNumber,
      scorecard
    });
    await parentVersion.addChild(version.id);
    var document = await Document.findById(parentVersion.document.id).then(s =>
      s.update({ latest_version: parentVersion.hierarchyLevel + 1 })
    );
    var questionInstances = await Promise.map(
      markdownParsor.questions,
      async questionObject => {
        var answer = markdownParsor.findAnswerToQuestion(
          questionObject.order_in_version
        );
        var versionQuestion = await VersionQuestion.create({
          version_id: version.id,
          markdown: `### ${questionObject.question.trim()}`,
          order_in_version: questionObject.order_in_version,
          latest: true
        });
        await VersionAnswer.create({
          markdown: answer,
          version_question_id: versionQuestion.id,
          version_id: version.id,
          latest: true
        });
        return versionQuestion;
      }
    );
    var prevCollaboratorEmails = parentVersion.document.collaborators.map(
      user => user.email
    );
    var removedCollaborators = _.difference(
      prevCollaboratorEmails,
      collaboratorEmails
    ).map(async email =>
      DocumentCollaborator.update(
        { revoked_access: true },
        {
          where: {
            email,
            document_id: parentVersion.document.id
          }
        }
      )
    );
    var collaborators = collaboratorEmails.map(
      async email =>
        await User.findOne({ where: { email } }).then(user =>
          DocumentCollaborator.findOrCreate({
            where: {
              user_id: user.id,
              document_id: parentVersion.document.id
            },
            defaults: {
              user_id: user ? user.id : null,
              email,
              document_id: parentVersion.document.id,
              version_version: version.hierarchyLevel
            }
          }).then(async (collaborator, created) => {
            var updated;
            if (collaborator.revoked_access) {
              collaborator = await DocumentCollaborator.update(
                {
                  revoked_access: false
                },
                { where: { id: collaborator.id } }
              );
              updated = true;
            }
            if (created || updated)
              return Notification.notifyCollaborators({
                sender: req.user,
                collaboratorId: user.id,
                versionId: version.id,
                projectSymbol: project.symbol,
                parentVersionTitle: parentVersion.document.title,
                action: "updated"
              });
          })
        )
    );
    var resolvedCurrentIssues = resolvedIssueIds.map(async issueId =>
      Issue.update(
        { open: false, resolving_version_id: version.id },
        { where: { id: Number(issueId) } }
      )
    );
    var resolvedAddedIssues = newResolvedIssues.map(async newIssue =>
      Comment.create({
        comment: newIssue,
        reviewed: "verified",
        version_id: req.params.parentVersionId,
        owner_id: req.user.id
      }).then(comment =>
        Issue.create({
          open: false,
          comment_id: comment.id,
          resolving_version_id: version.id
        })
      )
    );
    var engagedUsers = await getEngagedUsers({
      version: parentVersion,
      creator: req.user,
      collaboratorEmails
    });
    await Promise.all(
      collaborators
        .concat(removedCollaborators)
        .concat(resolvedCurrentIssues)
        .concat(resolvedAddedIssues)
        .concat(
          engagedUsers.map(engagedUser =>
            Notification.notifyEngagedUserOnUpdate({
              engagedUser,
              versionId: version.id,
              projectSymbol: project.symbol,
              parentVersionTitle: parentVersion.document.title
            })
          )
        )
    );
    version = version.toJSON();
    version.document = document;
    res.send(version);
  } catch (err) {
    next(err);
  }
};

const putDocument = async (req, res, next) => {
  try {
    const [document, project] = await Promise.all([
      Document.update(req.body, { where: { id: req.params.documentId } }),
      Project.findById(req.body.project_id)
    ]);
    res.send({ document, project });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getComments,
  getFeatureDocuments,
  getDocumentsWithFilters,
  getDocuments,
  getDrafts,
  getPublishedDocuments,
  getDocument,
  getDraftBySlug,
  getDocumentBySlug,
  getDocumentLatestQuestion,
  getDocumentLatestQuestionBySlug,
  postDocument,
  postUpvote,
  postDownvote,
  postNewVersion,
  putDocument,
  putDocumentContentHTMLBySlug
};
