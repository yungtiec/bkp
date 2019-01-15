"use strict";
const crypto = require("crypto");
const Sequelize = require("sequelize");
const { assignIn, cloneDeep, omit } = require("lodash");

module.exports = (db, DataTypes) => {
  const User = db.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        // Making `.password` act like a func hides it when serializing to JSON.
        // This is a hack to get around Sequelize's lack of a "private" option.
        get() {
          return () => this.getDataValue("password");
        }
      },
      salt: {
        type: DataTypes.STRING,
        // Making `.salt` act like a function hides it when serializing to JSON.
        // This is a hack to get around Sequelize's lack of a "private" option.
        get() {
          return () => this.getDataValue("salt");
        }
      },
      githubId: {
        type: DataTypes.STRING
      },
      googleId: {
        type: DataTypes.STRING
      },
      uportAddress: {
        type: DataTypes.STRING
      },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING
      },
      username: {
        type: DataTypes.STRING
      },
      organization: {
        type: DataTypes.STRING
      },
      restricted_access: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      anonymity: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      onboard: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      reset_password_token: {
        type: DataTypes.STRING
      },
      reset_password_expiration: {
        type: DataTypes.INTEGER
      }
    },
    {
      getterMethods: {
        displayName() {
          return this.anonymity ? "Anonymous" : this.name;
        }
      }
    }
  );
  User.associate = function(models) {
    User.belongsToMany(models.role, {
      through: "user_roles",
      foreignKey: "user_id"
    });
    User;
    User.hasMany(models.notification, {
      foreignKey: "recipient_id",
      as: "notifications",
      constraints: false
    });
    User.hasMany(models.notification, {
      foreignKey: "sender_id",
      as: "activities",
      constraints: false
    });
    User.belongsToMany(models.project, {
      through: "project_admins",
      as: "managedProjects",
      foreignKey: "user_id"
    });
    User.belongsToMany(models.project, {
      through: "project_editors",
      as: "editedProjects",
      foreignKey: "user_id"
    });
    User.belongsToMany(models.comment, {
      as: "upvotedComments",
      through: "comment_upvotes",
      foreignKey: "user_id"
    });
    User.hasMany(models.comment, {
      foreignKey: "owner_id",
      as: "comments"
    });
    User.hasMany(models.document, {
      foreignKey: "creator_id",
      as: "documents"
    });
    User.hasMany(models.version, {
      foreignKey: "creator_id",
      as: "createdVersions"
    });
    User.belongsToMany(models.document, {
      as: "upvotedDocuments",
      through: "document_upvotes",
      foreignKey: "user_id"
    });
    User.belongsToMany(models.document, {
      as: "downvotedDocuments",
      through: "document_downvotes",
      foreignKey: "user_id"
    });
    User.belongsToMany(models.document, {
      through: "document_collaborator",
      foreignKey: "user_id",
      as: "collaboratedDocuments"
    });
  };

  User.loadScopes = function(models) {
    User.addScope("comments", function({
      userId,
      limit,
      offset,
      reviewStatus,
      issueStatus,
      projects
    }) {
      var commentQueryObj = getCommentQueryObj({
        queryObj: {
          userId,
          limit,
          offset,
          reviewStatus,
          projects,
          issueStatus
        },
        order: true
      });
      return {
        where: { id: userId },
        attributes: [
          "id",
          "email",
          "name",
          "first_name",
          "last_name",
          "organization",
          "anonymity",
          "onboard"
        ],
        include: [commentQueryObj]
      };
    });
    User.addScope("commentCount", function({
      userId,
      limit,
      offset,
      reviewStatus,
      projects,
      issueStatus
    }) {
      var commentQueryObj = getCommentQueryObj({
        queryObj: {
          userId,
          limit,
          offset,
          reviewStatus,
          projects,
          issueStatus
        },
        order: false,
        pageCount: true
      });
      return {
        where: { id: userId },
        attributes: ["id"],
        include: [commentQueryObj]
      };
    });
    User.addScope("roles", function(userId) {
      return {
        where: { id: userId },
        include: [
          {
            model: models.role
          }
        ]
      };
    });
    User.addScope("basicInfo", function({ userId, googleId, uportAddress }) {
      var query;
      if (userId) query = { id: userId };
      if (googleId) query = { googleId };
      if (uportAddress) query = { uportAddress };
      return {
        where: query,
        attributes: [
          "id",
          "email",
          "name",
          "first_name",
          "last_name",
          "organization",
          "restricted_access",
          "anonymity",
          "onboard",
          "createdAt"
        ],
        include: [
          {
            model: models.role,
            attributes: ["name"]
          },
          { model: models.project, as: "managedProjects" },
          { model: models.project, as: "editedProjects" }
        ]
      };
    });
    User.addScope("notifications", function(userId) {
      return {
        where: { id: userId },
        attributes: ["id"],
        include: [
          {
            model: models.notification,
            required: false,
            as: "notifications",
            where: {
              status: {
                [Sequelize.Op.or]: [
                  { [Sequelize.Op.eq]: "unread" },
                  { [Sequelize.Op.eq]: "seen" }
                ]
              }
            },
            include: [
              {
                model: models.user,
                as: "sender",
                attributes: [
                  "id",
                  "email",
                  "name",
                  "first_name",
                  "last_name",
                  "organization"
                ]
              }
            ]
          }
        ]
      };
    });
  };

  /**
   * instanceMethods
   */
  User.prototype.correctPassword = function(candidatePwd) {
    return User.encryptPassword(candidatePwd, this.salt()) === this.password();
  };

  /**
   * classMethods
   */
  User.generateSalt = function() {
    return crypto.randomBytes(16).toString("base64");
  };

  User.encryptPassword = function(plainText, salt) {
    return crypto
      .createHash("RSA-SHA256")
      .update(plainText)
      .update(salt)
      .digest("hex");
  };

  User.getContributions = async function({
    userId,
    googleId,
    uportAddress,
    githubId,
    forListing
  }) {
    var query;
    if (googleId) query = { googleId };
    if (uportAddress) query = { uportAddress };
    if (userId) query = { userId: Number(userId) };
    if (githubId) query = { githubId };
    const user = await User.scope({
      method: ["basicInfo", query]
    }).findOne();
    const [comments, notifications] = await Promise.all([
      user.getComments({
        attributes: ["id", "reviewed"],
        include: [
          {
            model: db.model("issue"),
            required: false
          },
          {
            model: db.model("user"),
            as: "upvotesFrom",
            attributes: ["name", "first_name", "last_name", "email"],
            required: false
          }
        ]
      }),
      user.getNotifications({
        where: {
          status: {
            [Sequelize.Op.or]: [
              { [Sequelize.Op.eq]: "unread" },
              { [Sequelize.Op.eq]: "seen" }
            ]
          }
        }
      })
    ]);
    const numCommentIssues = comments.filter(item => item.issue).length;
    const numCommentUpvotes = comments.reduce(
      (count, item) =>
        item.upvotesFrom ? item.upvotesFrom.length + count : count,
      0
    );

    const numCommentSpam = comments.filter(item => item.reviewed === "spam")
      .length;

    return assignIn(
      {
        num_comments: comments.length,
        num_issues: numCommentIssues,
        num_upvotes: numCommentUpvotes,
        num_spam: numCommentSpam,
        num_notifications: notifications.length
      },
      forListing ? omit(user.toJSON(), ["roles"]) : user.toJSON()
    );
  };

  User.getUserListWithContributions = async function(query) {
    const users = await Promise.map(User.findAll(query), user =>
      User.getContributions({ userId: user.id, forListing: true })
    );
    return users;
  };

  User.getCommentsAndCount = async function(queryObj) {
    const user = await User.scope({
      method: ["comments", cloneDeep(queryObj)]
    }).findOne();
    var { comments } = await User.scope({
      method: ["commentCount", cloneDeep(queryObj)]
    }).findOne();
    var pagedComments = user.comments
      .filter(comment => comment.version)
      .map(comment => {
        comment = comment.toJSON();
        if (!comment.parentId) return assignIn({ ancestors: [] }, comment);
        if (comment.parent.ancestors.length) {
          comment.ancestors = comment.parent.ancestors.concat(comment.parent);
        } else {
          comment.ancestors = [comment.parent];
        }
        return comment;
      });
    return { pagedComments, commentCount: comments.length };
  };

  /**
   * hooks
   */
  const setSaltAndPassword = user => {
    if (user.changed("password")) {
      user.salt = User.generateSalt();
      user.password = User.encryptPassword(user.password(), user.salt());
    }
  };

  const setName = user => {
    user.name = !user.name ? user.first_name + " " + user.last_name : user.name;
  };

  const hookChain = user => {
    setSaltAndPassword(user);
    setName(user);
  };

  /**
   * helpers
   */

  function getCommentQueryObj({
    queryObj: { userId, limit, offset, reviewStatus, issueStatus, projects },
    order,
    pageCount
  }) {
    var projectSurveyQuery = projects
      ? {
          model: db.model("version"),
          duplicating: false,
          // required: true,
          // leads to error missing FROM-clause entry for table "comments->version->document->project"
          // filter projects by filtering the comments null version
          include: [
            {
              model: db.model("document"),
              attributes: ["id", "title", "project_id"],
              where: { project_id: projects },
              include: [
                {
                  model: db.model("project"),
                  attributes: ["id", "symbol", "name"]
                }
              ]
            }
          ]
        }
      : {
          model: db.model("version"),
          required: true,
          include: [
            {
              model: db.model("document"),
              attributes: ["id", "title"],
              include: [
                {
                  model: db.model("project"),
                  attributes: ["id", "symbol", "name"]
                }
              ]
            }
          ]
        };
    var issueQuery = issueStatus
      ? {
          model: db.model("issue"),
          where: { open: issueStatus }
        }
      : {
          model: db.model("issue"),
          required: false
        };
    var commentQueryObj = {
      model: db.model("comment"),
      where: { reviewed: reviewStatus },
      as: "comments",
      subQuery: false,
      required: false,
      include: [
        {
          model: db.model("tag"),
          required: false
        },
        {
          model: db.model("comment"),
          as: "parent", // for unknown reason, include ancestors here doesn't work
          required: false,
          include: [
            {
              model: db.model("tag"),
              required: false
            },
            {
              model: db.model("user"),
              as: "owner"
            },
            {
              model: db.model("issue"),
              required: false
            },
            {
              model: db.model("comment"),
              as: "ancestors",
              required: false
            }
          ]
        },
        issueQuery,
        projectSurveyQuery
      ]
    };
    if (order) {
      commentQueryObj.order = [
        [
          {
            model: db.model("version")
          },
          "id",
          "ASC"
        ],
        ["createdAt", "DESC"],
        ["updatedAt", "DESC"]
      ];
    }
    if (!pageCount) {
      commentQueryObj.limit = limit;
      commentQueryObj.offset = offset;
    }
    return commentQueryObj;
  }

  User.beforeCreate(hookChain);
  User.beforeUpdate(hookChain);

  return User;
};
