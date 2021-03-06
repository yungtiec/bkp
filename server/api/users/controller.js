const Sequelize = require("sequelize");
const _ = require("lodash");
const db = require("../../db");
const {
  User,
  Role,
  Project,
  Document,
  Comment,
  Issue,
  Version
} = require("../../db/models");
const { assignIn } = require("lodash");
const documentQuery = user =>
  `( SELECT 'document' as type, documents.slug as slug, "documents"."id" as document_id, null as comment_id ,"documents"."createdAt" as "createdAt", "documents"."title", "documents"."description", users.user_handle as "documentPostedBy",null as "commentedBy", null as comment, null as quote, ( SELECT count(document_upvotes.user_id) FROM document_upvotes WHERE document_upvotes.document_id = documents.id ) as num_upvotes, ( SELECT count(document_downvotes.user_id) FROM document_downvotes WHERE document_downvotes.document_id = documents.id) as num_downvotes, 0 as root_comment_id, ( SELECT count(comments) FROM comments WHERE comments.doc_id = "documents"."id" ) as num_comments FROM documents INNER JOIN users on documents.creator_id = users.id WHERE documents.creator_id = ${
    user.id
  } )`;
const commentQuery = user =>
  `( SELECT 'comment' as type, documents.slug as slug, null as document_id, comments.id as comment_id,"comments"."createdAt" as "createdAt", documents.title as title, null as description, users.user_handle as "documentPostedBy",( SELECT users.user_handle FROM users WHERE users.id = comments.owner_id ) as "commentedBy", "comment", "quote", ( SELECT count(comment_upvotes.user_id) FROM comment_upvotes WHERE comment_upvotes.comment_id = comments.id ) as num_upvotes, null as num_downvotes, ( SELECT max("ancestorId") FROM commentsancestors WHERE commentsancestors."commentId" = comments.id ) as root_comment_id, ( SELECT count(commentsancestors) FROM commentsancestors WHERE commentsancestors."ancestorId" = comments.id ) as num_comments FROM comments INNER JOIN documents on documents.id = comments.doc_id INNER JOIN users on documents.creator_id = users.id WHERE comments.owner_id = ${
    user.id
  } )`;
const documentVoteQuery = user =>
  `( SELECT 'upvoteDocument' as type, documents.slug as slug, "documents"."id" as document_id, 0 as comment_id,"document_upvotes"."createdAt" as "createdAt", "documents"."title", "documents"."description", users.user_handle as "documentPostedBy",null as "commentedBy", null as comment, null as quote, ( SELECT count(document_upvotes.user_id) FROM document_upvotes WHERE document_upvotes.document_id = documents.id ) as num_upvotes, ( SELECT count(document_downvotes.user_id) FROM document_downvotes WHERE document_downvotes.document_id = documents.id) as num_downvotes, 0 as root_comment_id, ( SELECT count(comments) FROM comments WHERE comments.doc_id = documents.id ) as num_comments FROM documents INNER JOIN users on documents.creator_id = users.id INNER JOIN document_upvotes ON documents.id = document_upvotes.document_id AND document_upvotes.user_id = ${
    user.id
  } ) union all ( SELECT 'downvoteDocument' as type, documents.slug as slug, "documents"."id" as document_id, 0 as comment_id,"document_downvotes"."createdAt" as "createdAt", "documents"."title", "documents"."description", users.user_handle as "documentPostedBy",null as "commentedBy", null as comment, null as quote, ( SELECT count(document_upvotes.user_id) FROM document_upvotes WHERE document_upvotes.document_id = documents.id ) as num_upvotes, ( SELECT count(document_downvotes.user_id) FROM document_downvotes WHERE document_downvotes.document_id = documents.id) as num_downvotes, 0 as root_comment_id, ( SELECT count(comments) FROM comments WHERE comments.doc_id = documents.id ) as num_comments FROM documents INNER JOIN users on documents.creator_id = users.id INNER JOIN document_downvotes ON documents.id = document_downvotes.document_id AND document_downvotes.user_id = ${
    user.id
  } )`;
const commentVoteQuery = user =>
  `( SELECT 'upvoteComment' as type, documents.slug as slug, "documents"."id" as document_id, "comments"."id" as comment_id, "comment_upvotes"."createdAt" as "createdAt", "documents"."title", "documents"."description", users.user_handle as "documentPostedBy", ( SELECT users.user_handle FROM users WHERE users.id = comments.owner_id ) as "commentedBy", comment, quote, ( SELECT count(document_upvotes.user_id) FROM document_upvotes WHERE document_upvotes.document_id = documents.id ) as num_upvotes, ( SELECT count(document_downvotes.user_id) FROM document_downvotes WHERE document_downvotes.document_id = documents.id) as num_downvotes, ( SELECT max("ancestorId") FROM commentsancestors WHERE commentsancestors."commentId" = comments.id ) as root_comment_id, ( SELECT count(commentsancestors) FROM commentsancestors WHERE commentsancestors."ancestorId" = comments.id ) as num_comments FROM comments INNER JOIN documents on documents.id = comments.doc_id INNER JOIN users on documents.creator_id = users.id  INNER JOIN comment_upvotes ON comments.id = comment_upvotes.comment_id AND comment_upvotes.user_id = ${
    user.id
  } )`;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.getUserListWithContributions({ limit: 20 });
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getDelegatedUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: { delegate: true },
      attributes: ["id", "name", "user_handle"]
    });
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    var requestedUser;
    if (req.user) requestedUser = await User.findById(req.user.id);
    const profile = await User.getContributions({
      userHandle: req.params.userHandle,
      includePrivateInfo:
        req.params.userHandle &&
        requestedUser &&
        req.params.userHandle === requestedUser.user_handle
    });
    res.send(profile);
  } catch (err) {
    next(err);
  }
};

const getUserContributions = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { user_handle: req.params.userHandle }
    });
    if (!user) return res.sendStatus(404);
    const contributions = await db.sequelize.query(`${documentQuery(user)}
      union all ${commentQuery(user)}
      union all ${documentVoteQuery(user)}
      union all ${commentVoteQuery(user)}
      ORDER BY "createdAt" DESC OFFSET ${req.query.offset} LIMIT ${
      req.query.limit
    };`);
    res.send(contributions);
  } catch (err) {
    next(err);
  }
};

const getUserProjects = async (req, res, next) => {
  try {
    var includeQuery = {
      include: [
        {
          model: User,
          through: "project_admins",
          as: "admins"
        },
        {
          model: User,
          through: "project_editors",
          as: "editors"
        }
      ]
    };
    var projects;
    var managedProjects, editedProjects;
    var admins = (admins = await Role.findOne({
      where: { name: "admin" }
    }).then(role => role.getUsers()));
    switch (req.user.roles[0].name) {
      case "admin":
        projects = await Project.getProjects();
        break;
      case "project_admin":
        managedProjects = await req.user.getManagedProjects(includeQuery);
        editedProjects = await req.user.getEditedProjects(includeQuery);
        projects = editedProjects.concat(managedProjects);
        break;
      case "project_editor":
        projects = await req.user.getEditedProjects(includeQuery);
        break;
    }
    projects = projects.map(p => {
      const collaboratorOptions = admins
        .concat(p.admins || [])
        .concat(p.editors || [])
        .filter(c => c.id !== req.user.id);
      return _.assignIn(p.toJSON ? p.toJSON() : p, { collaboratorOptions });
    });
    res.send(projects);
  } catch (err) {
    next(err);
  }
};

const getUserDocuments = async (req, res, next) => {
  try {
    var user = await User.findOne({
      where: { user_handle: req.params.userHandle }
    });
    if (!user) return res.sendStatus(404);
    var ownDocuments = await db.sequelize.query(
      `${documentQuery(user)} ORDER BY "createdAt" DESC OFFSET ${
        req.query.offset
      } LIMIT ${req.query.limit};`
    );
    res.send(ownDocuments);
  } catch (err) {
    next(err);
  }
};

const getUserAuthorizedDocuments = async (req, res, next) => {
  try {
    var documents;
    var ownDocuments, collaboratorDocuments;

    switch (req.user.roles[0].name) {
      case "admin":
        documents = await Document.scope({
          method: [
            "includeVersions",
            {
              versionWhereClause: { submitted: true }
            }
          ]
        }).findAll();
        break;
      case "editor":
        ownDocuments = await Document.findAll({
          include: [
            { model: Version },
            {
              model: Project,
              required: true,
              include: [
                {
                  model: User,
                  through: "project_editors",
                  as: "editors",
                  where: { id: req.user.id },
                  required: true
                }
              ]
            }
          ]
        });
        collaboratorDocuments = await req.user.getCollaboratedDocuments({
          include: [
            { model: Version },
            {
              model: Project
            }
          ],
          order: [
            ["createdAt", "DESC"],
            [{ model: Version }, "hierarchyLevel", "DESC"]
          ]
        });
        documents = ownDocuments.concat(collaboratorDocuments);
        break;
      case "project_admin":
        ownDocuments = await Document.findAll({
          include: [
            { model: Version },
            {
              model: Project,
              required: true,
              include: [
                {
                  model: User,
                  through: "project_admins",
                  as: "admins",
                  where: { id: req.user.id },
                  required: true
                }
              ]
            }
          ]
        });
        collaboratorDocuments = await req.user.getCollaboratedDocuments({
          include: [
            { model: Version },
            {
              model: Project
            }
          ],
          order: [
            ["createdAt", "DESC"],
            [{ model: Version }, "hierarchyLevel", "DESC"]
          ]
        });
        documents = ownDocuments.concat(collaboratorDocuments);
        break;
      default:
        documents = [];
        break;
    }
    res.send(documents);
  } catch (err) {
    next(err);
  }
};

const getUserComments = async (req, res, next) => {
  try {
    var user = await User.findOne({
      where: { user_handle: req.params.userHandle }
    });
    if (!user) return res.sendStatus(404);
    var comments = await db.sequelize.query(
      `${commentQuery(user)} ORDER BY "createdAt" DESC OFFSET ${
        req.query.offset
      } LIMIT ${req.query.limit};`
    );
    res.send(comments);
  } catch (err) {
    next(err);
  }
};

const getUserCommentsWithFilter = async (req, res, next) => {
  var queryObj = {
    userHandle: req.params.userHandle,
    limit: Number(req.query.limit),
    offset: Number(req.query.limit) * Number(req.query.offset),
    reviewStatus: {
      [Sequelize.Op.or]: [
        { [Sequelize.Op.eq]: "pending" },
        { [Sequelize.Op.eq]: "verified" },
        { [Sequelize.Op.eq]: "spam" }
      ]
    }
  };
  if (req.query.reviewStatus && req.query.reviewStatus.length) {
    queryObj.reviewStatus = {
      [Sequelize.Op.or]: req.query.reviewStatus.map(status => ({
        [Sequelize.Op.eq]: status
      }))
    };
  }
  if (req.query.projects && req.query.projects.length) {
    queryObj.projects = {
      [Sequelize.Op.or]: req.query.projects.map(jsonString => ({
        [Sequelize.Op.eq]: JSON.parse(jsonString).value
      }))
    };
  }
  if (req.query.issueStatus && req.query.issueStatus.length) {
    queryObj.issueStatus = {
      [Sequelize.Op.or]: req.query.issueStatus.map(status => ({
        [Sequelize.Op.eq]: status === "open"
      }))
    };
  }
  try {
    const comments = await User.getCommentsAndCount(queryObj);
    res.send(comments);
  } catch (err) {
    next(err);
  }
};

const getUserVotes = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { user_handle: req.params.userHandle }
    });
    if (!user) return res.sendStatus(404);
    const votes = await db.sequelize.query(`${documentVoteQuery(
      user
    )} union all ${commentVoteQuery(user)}
      ORDER BY "createdAt" DESC OFFSET ${req.query.offset} LIMIT ${
      req.query.limit
    };`);
    res.send(votes);
  } catch (err) {
    next(err);
  }
};

const checkUserHandle = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { user_handle: req.query.q }
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getDelegatedUsers,
  getUser,
  getUserContributions,
  getUserProjects,
  getUserAuthorizedDocuments,
  getUserDocuments,
  getUserComments,
  getUserCommentsWithFilter,
  getUserVotes,
  checkUserHandle
};
