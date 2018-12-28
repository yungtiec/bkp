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

const getUsers = async (req, res, next) => {
  try {
    const users = await User.getUserListWithContributions({ limit: 20 });
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const profile = await User.getContributions({
      userHandle: req.params.userHandle && req.params.userHandle.slice(1)
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
    const contributions = await db.sequelize
      .query(`( SELECT 'document' as type, "documents"."id" as document_id, null as comment_id ,"documents"."createdAt" as "createdAt", "documents"."title", "documents"."description", users.user_handle as "documentPostedBy", null as comment, null as quote, ( SELECT count(document_upvotes.user_id) FROM document_upvotes WHERE document_upvotes.user_id = ${user.id} ) as num_upvotes, ( SELECT count(document_downvotes.user_id) FROM document_downvotes WHERE document_downvotes.user_id = ${user.id}) as num_downvotes, ( SELECT count(comments) FROM comments WHERE comments.version_id = ( SELECT versions.id FROM versions WHERE versions.document_id = documents.id ) ) as num_comments
        FROM documents INNER JOIN users on documents.creator_id = users.id WHERE documents.creator_id = ${
      user.id
    } )
    union all
      ( SELECT 'comment' as type, null as document_id, comments.id as comment_id,"comments"."createdAt" as "createdAt", documents.title as title, null as description, users.user_handle as "documentPostedBy", "comment", "quote", ( SELECT count(comment_upvotes.user_id) FROM comment_upvotes WHERE comment_upvotes.user_id = ${user.id} ) as num_upvotes, null as num_downvotes, ( SELECT count(commentsancestors) FROM commentsancestors WHERE commentsancestors."ancestorId" = comments.id ) as num_comments
      FROM comments INNER JOIN versions on versions.id = comments.version_id INNER JOIN documents on documents.id = versions.document_id INNER JOIN users on documents.creator_id = users.id WHERE comments.owner_id = ${
        user.id
      } )
    union all ( SELECT 'upvote' as type, "documents"."id" as document_id, null as comment_id,"document_upvotes"."createdAt" as "createdAt", "documents"."title", "documents"."description", users.user_handle as "documentPostedBy", null as comment, null as quote, null as num_upvotes, null as num_downvotes, null as num_comments FROM documents INNER JOIN users on documents.creator_id = users.id INNER JOIN document_upvotes ON documents.id = document_upvotes.document_id AND document_upvotes.user_id = ${
      user.id
    } )
    union all ( SELECT 'downvote' as type, "documents"."id" as document_id, null as comment_id,"document_downvotes"."createdAt" as "createdAt", "documents"."title", "documents"."description", users.user_handle as "documentPostedBy", null as comment, null as quote, null as num_downvotes, null as num_downvotes, null as num_comments FROM documents INNER JOIN users on documents.creator_id = users.id INNER JOIN document_downvotes ON documents.id = document_downvotes.document_id AND document_downvotes.user_id = ${
      user.id
    } )
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
    console.log(req.params);
    var ownDocuments = await Document.findAll({
      where: { creator_id: user.id },
      limit: req.query.limit,
      offset: req.query.offset
    });
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
    const votes = await db.sequelize
      .query(`( SELECT 'upvoteDocument' as type, "documents"."id","document_upvotes"."createdAt" as "createdAt", "documents"."title", "documents"."description", null as comment, null as quote, null as num_upvotes, null as num_downvotes, null as num_comments FROM documents INNER JOIN document_upvotes ON documents.id = document_upvotes.document_id AND document_upvotes.user_id = ${
      user.id
    } )
    union all ( SELECT 'downvoteDocument' as type, "documents"."id","document_downvotes"."createdAt" as "createdAt", "documents"."title", "documents"."description", null as comment, null as quote, null as num_downvotes, null as num_downvotes, null as num_comments FROM documents INNER JOIN document_downvotes ON documents.id = document_downvotes.document_id AND document_downvotes.user_id = ${
      user.id
    } )
    union all ( SELECT 'upvoteComment' as type, "comments"."id","comment_upvotes"."createdAt" as "createdAt", null as title, null as description, comment,  quote, null as num_upvotes, null as num_downvotes, null as num_comments FROM comments INNER JOIN comment_upvotes ON comments.id = comment_upvotes.comment_id AND comment_upvotes.user_id = ${
      user.id
    } )
    ORDER BY "createdAt" DESC OFFSET ${req.query.offset} LIMIT ${
      req.query.limit
    };`);
    res.send(votes);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserContributions,
  getUserProjects,
  getUserAuthorizedDocuments,
  getUserDocuments,
  getUserComments,
  getUserVotes
};
