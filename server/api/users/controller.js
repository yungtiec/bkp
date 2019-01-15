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
      userId: Number(req.params.userId)
    });
    res.send(profile);
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
  getUserProjects,
  getUserDocuments,
  getUserComments
};
