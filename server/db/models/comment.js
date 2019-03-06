"use strict";
const Sequelize = require("sequelize");
const { assignIn } = require("lodash");

module.exports = (db, DataTypes) => {
  const Comment = db.define("comment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uri: {
      type: DataTypes.STRING
    },
    quote: {
      type: DataTypes.TEXT
    },
    comment: {
      type: DataTypes.TEXT
    },
    annotator_schema_version: {
      type: DataTypes.STRING
    },
    ranges: {
      type: DataTypes.ARRAY(DataTypes.JSON)
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    reviewed: {
      type: DataTypes.ENUM("pending", "spam", "verified"),
      defaultValue: "pending"
    }
  });
  Comment.isHierarchy();
  Comment.associate = function(models) {
    Comment.belongsTo(models.user, {
      foreignKey: "owner_id",
      as: "owner"
    });
    Comment.belongsToMany(models.user, {
      as: "upvotesFrom",
      through: "comment_upvotes",
      foreignKey: "comment_id"
    });
    Comment.hasOne(models.issue, {
      foreignKey: "comment_id"
    });
    Comment.belongsTo(models.document, {
      foreignKey: "doc_id"
    });
    Comment.belongsTo(models.question, {
      foreignKey: "question_id"
    });
  };
  Comment.loadScopes = function(models) {
    Comment.addScope("withDocuments", function(moreIncludeOptions) {
      var options = {
        include: [
          {
            model: models.document,
            attributes: ["id", "title"],
            include: [
              {
                model: models.user,
                as: "collaborators",
                through: {
                  model: models.document_collaborator,
                  where: {
                    revoked_access: { [Sequelize.Op.not]: true }
                  }
                },
                required: false
              },
              {
                model: models.project,
                include: [
                  {
                    model: models.user,
                    through: "project_admins",
                    as: "admins"
                  },
                  {
                    model: models.user,
                    through: "project_editors",
                    as: "editors"
                  }
                ]
              }
            ]
          }
        ]
      };
      if (moreIncludeOptions)
        options.include = options.include.concat(moreIncludeOptions);
      return options;
    });
    Comment.addScope("upvotes", function(commentId) {
      return {
        where: { id: commentId },
        include: [
          {
            model: models.user,
            as: "upvotesFrom",
            attributes: ["first_name", "last_name", "name", "email", "id"]
          },
          {
            model: models.user,
            as: "owner",
            attributes: [
              "id",
              "first_name",
              "last_name",
              "name",
              "email",
              "id",
              "anonymity"
            ]
          },
          {
            model: models.document,
            include: [
              {
                model: models.project,
                attributes: ["symbol"]
              }
            ]
          },
          {
            model: models.comment,
            as: "ancestors",
            required: false,
            attributes: ["id", "owner_id"],
            include: [
              {
                model: models.user,
                as: "owner",
                required: false
              }
            ],
            order: [
              [
                {
                  model: Comment,
                  as: "ancestors"
                },
                "hierarchyLevel"
              ]
            ]
          }
        ]
      };
    });
    Comment.addScope(
      "flatThreadByRootId",
      generateScopeForAncestry(models, "descendents")
    );
    Comment.addScope("withParent", generateScopeForAncestry(models, "parent"));
  };
  Comment.getCommentsWitRoot = async function(options) {
    var comments = await Comment.scope({
      method: ["flatThreadByRootId", options]
    }).findAll();
    return Promise.map(comments, async comment => {
      if (comment.hierarchyLevel === 1) return comment;
      var rootComment = await comment.getAncestors({
        where: { hierarchyLevel: 1 }
      });
      return assignIn(comment.toJSON(), {
        root_comment_id: rootComment[0].id,
        root_comment: rootComment[0]
      });
    });
  };
  return Comment;
};

function generateScopeForAncestry(models, ancestry) {
  return function(options) {
    var query = {
      include: [
        {
          model: models.user,
          as: "upvotesFrom",
          attributes: ["first_name", "last_name", "name", "email", "id"]
        },
        {
          model: models.user,
          as: "owner",
          attributes: [
            "id",
            "first_name",
            "last_name",
            "name",
            "email",
            "anonymity",
            "user_handle"
          ],
          include: [
            {
              model: models.role
            }
          ]
        },
        {
          model: models.tag,
          attributes: ["name", "id"]
        },
        {
          model: models.document,
          include: [
            {
              model: models.project,
              attributes: ["symbol"]
            },
            {
              model: models.user,
              as: "creator",
              attributes: [
                "id",
                "first_name",
                "last_name",
                "name",
                "email",
                "anonymity",
                "user_handle"
              ]
            }
          ]
        },
        {
          model: models.issue,
          attributes: ["open", "id"],
          include: [
            {
              model: models.document,
              as: "resolvingDocument",
              include: [
                {
                  model: models.project,
                  attributes: ["symbol"]
                }
              ]
            }
          ]
        },
        {
          model: models.comment,
          required: false,
          include: [
            {
              model: models.user,
              as: "upvotesFrom",
              attributes: ["first_name", "last_name", "name", "email", "id"]
            },
            {
              model: models.user,
              as: "owner",
              attributes: [
                "id",
                "first_name",
                "last_name",
                "name",
                "email",
                "anonymity"
              ],
              include: [
                {
                  model: models.role
                }
              ]
            },
            {
              model: models.comment,
              as: "parent",
              required: false,
              include: [
                {
                  model: models.user,
                  as: "owner",
                  attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "name",
                    "email",
                    "anonymity"
                  ],
                  include: [
                    {
                      model: models.role
                    }
                  ]
                }
              ]
            }
          ],
          as: ancestry
        }
      ]
    };
    if (options) query = assignIn(options, query);
    return query;
  };
}
