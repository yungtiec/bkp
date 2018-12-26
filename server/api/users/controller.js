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
      .query(`( SELECT "documents"."id","documents"."createdAt", "documents"."title", "documents"."description", null as comment, null as quote, count("document_upvotes"."user_id") as num_upvotes, count("document_downvotes"."user_id") as num_downvotes, count("versions.comments") as num_comments FROM documents LEFT OUTER JOIN document_upvotes ON documents.id = document_upvotes.document_id AND documents.creator_id = ${
      user.id
    } LEFT OUTER JOIN document_downvotes ON documents.id = document_downvotes.document_id INNER JOIN versions AS versions ON versions.document_id = documents.id AND versions.submitted = true LEFT OUTER JOIN comments AS "versions.comments" ON versions.id = "versions.comments"."version_id"
    GROUP BY documents.id )
      union
    ( SELECT id,"comments"."createdAt", null as title, null as description, "comment", "quote", count(comment_upvotes.user_id) as num_upvotes, null as num_downvotes, count(commentsancestors) as num_comments FROM comments LEFT OUTER JOIN comment_upvotes ON comments.id = comment_upvotes.comment_id AND comments.owner_id = ${
      user.id
    } LEFT OUTER JOIN commentsancestors ON commentsancestors."ancestorId" = comments.id GROUP BY comments.id )
    ORDER BY "createdAt" DESC OFFSET 0 LIMIT 10;`);
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
    userId: Number(req.params.userId),
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
    const { pagedComments, commentCount } = await User.getCommentsAndCount(
      queryObj
    );
    res.send({ comments: pagedComments, commentCount: commentCount });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserContributions,
  getUserProjects,
  getUserDocuments,
  getUserComments
};
