"use strict";
const Sequelize = require("sequelize");
const _ = require("lodash");

module.exports = (db, DataTypes) => {
  const Document = db.define("document", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    document_type: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    forked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    original_document_id: {
      type: DataTypes.INTEGER
    },
    original_version_number: {
      type: DataTypes.INTEGER
    },
    project_id: {
      type: DataTypes.INTEGER
    },
    latest_version: {
      type: DataTypes.INTEGER
    },
    submitted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reviewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    comment_until_unix: {
      type: DataTypes.BIGINT
    },
    slug: {
      type: DataTypes.STRING
    },
    content_html: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.STRING
    }
  });
  Document.associate = function(models) {
    Document.hasMany(models.version, {
      foreignKey: "document_id"
    });
    Document.belongsTo(models.project, {
      foreignKey: "project_id"
    });
    Document.belongsTo(models.user, {
      foreignKey: "creator_id",
      as: "creator"
    });
    Document.belongsToMany(models.user, {
      as: "upvotesFrom",
      through: "document_upvotes",
      foreignKey: "document_id"
    });
    Document.belongsToMany(models.user, {
      as: "downvotesFrom",
      through: "document_downvotes",
      foreignKey: "document_id"
    });
    Document.hasMany(models.document, {
      foreignKey: "original_document_id"
    });
    Document.belongsTo(models.document, {
      foreignKey: "original_document_id",
      as: "forkFrom"
    });
    Document.belongsToMany(models.user, {
      through: "document_collaborator",
      foreignKey: "document_id",
      as: "collaborators"
    });
    Document.hasMany(models.issue, {
      foreignKey: "resolving_doc_id",
      as: "resolvedIssues"
    });
    Document.hasMany(models.comment, {
      foreignKey: "doc_id"
    });
  };
  Document.loadScopes = function(models) {
    Document.addScope("includeOutstandingIssues", function({
      slug,
      versionWhereClause
    }) {
      return {
        where: { slug },
        include: [
          {
            model: models["project"],
            include: [
              {
                model: models["user"],
                through: models["project_admin"],
                as: "admins"
              },
              {
                model: models["user"],
                through: models["project_editor"],
                as: "editors"
              }
            ]
          },
          {
            model: models["issue"],
            as: "resolvedIssues", // use in SurveyProgress
            required: false,
            where: {
              comment_id: {
                [Sequelize.Op.not]: null
              }
            },
            include: [
              {
                model: models["comment"]
              }
            ]
          },
          {
            model: models["comment"], // use in SurveyIssues
            required: false,
            include: [
              {
                model: models["issue"],
                required: false,
                where: { open: true }
              }
            ]
          },
          {
            model: models["user"],
            as: "collaborators",
            through: {
              model: models["document_collaborator"],
              where: { revoked_access: false }
            },
            required: false
          },
          {
            model: models["user"],
            as: "creator"
          },
          {
            model: models["user"],
            as: "upvotesFrom",
            attributes: ["name", "first_name", "last_name", "email", "id"]
          },
          {
            model: models["user"],
            as: "downvotesFrom",
            attributes: ["name", "first_name", "last_name", "email", "id"]
          }
        ]
      };
    });
    Document.addScope("includeAllEngagements", {
      where: { [Sequelize.Op.and]: { submitted: true, reviewed: true } },
      include: [
        {
          model: models["user"],
          as: "upvotesFrom",
          attributes: ["name", "first_name", "last_name", "email", "id"]
        },
        {
          model: models["user"],
          as: "downvotesFrom",
          attributes: ["name", "first_name", "last_name", "email", "id"]
        },
        {
          model: models["user"],
          as: "creator",
          include: [
            {
              model: models.role
            }
          ]
        },
        {
          model: models["project"]
        },
        {
          model: models["comment"],
          required: false,
          attributes: ["id", "reviewed", "hierarchyLevel"],
          where: {
            reviewed: {
              [Sequelize.Op.or]: [
                { [Sequelize.Op.eq]: "pending" },
                { [Sequelize.Op.eq]: "verified" }
              ]
            },
            hierarchyLevel: 1
          },
          include: [
            {
              model: models["issue"],
              required: false
            },
            {
              model: models["user"],
              as: "upvotesFrom",
              attributes: ["id"],
              required: false
            },
            { model: models["comment"], as: "descendents" }
          ],
          order: [
            [{ model: models["comment"], as: "descendents" }, "hierarchyLevel"]
          ]
        }
      ]
    });
    Document.addScope("includeVersionsWithAllEngagements", {
      where: { [Sequelize.Op.and]: { submitted: true, reviewed: true } },
      include: [
        {
          model: models["user"],
          as: "upvotesFrom",
          attributes: ["name", "first_name", "last_name", "email", "id"]
        },
        {
          model: models["user"],
          as: "downvotesFrom",
          attributes: ["name", "first_name", "last_name", "email", "id"]
        },
        {
          model: models["version"],
          where: { [Sequelize.Op.and]: { submitted: true, reviewed: true } },
          include: [
            {
              model: models["comment"],
              required: false,
              attributes: ["id", "reviewed", "hierarchyLevel"],
              where: {
                reviewed: {
                  [Sequelize.Op.or]: [
                    { [Sequelize.Op.eq]: "pending" },
                    { [Sequelize.Op.eq]: "verified" }
                  ]
                },
                hierarchyLevel: 1
              },
              include: [
                {
                  model: models["issue"],
                  required: false
                },
                {
                  model: models["user"],
                  as: "upvotesFrom",
                  attributes: ["id"],
                  required: false
                },
                { model: models["comment"], as: "descendents" }
              ],
              order: [
                [
                  { model: models["comment"], as: "descendents" },
                  "hierarchyLevel"
                ]
              ]
            }
          ]
        },
        {
          model: models["user"],
          as: "creator",
          include: [
            {
              model: models.role
            }
          ]
        },
        {
          model: models["user"],
          as: "collaborators",
          through: {
            model: models["document_collaborator"],
            where: { revoked_access: false }
          },
          required: false
        },
        {
          model: models["project"]
        }
      ],
      order: [
        ["createdAt", "DESC"],
        [{ model: models["version"] }, "hierarchyLevel", "DESC"]
      ]
    });
    Document.addScope("includeVersions", function({
      documentId,
      versionWhereClause
    }) {
      var versionIncludeClause = {
        model: models["version"]
      };
      if (versionWhereClause) versionIncludeClause.where = versionWhereClause;
      var options = {
        include: [
          versionIncludeClause,
          {
            model: models["project"]
          },
          {
            model: models["user"],
            as: "creator"
          },
          {
            model: models["user"],
            as: "collaborators",
            through: {
              model: models["document_collaborator"],
              where: { revoked_access: false }
            },
            required: false
          }
        ],
        order: [
          ["createdAt", "DESC"],
          [{ model: models["version"] }, "hierarchyLevel", "DESC"]
        ]
      };

      if (documentId) options.where = { id: documentId };
      return options;
    });
  };

  Document.getDocumentsWithStats = async function({ offset, limit }) {
    var documentQueryResult = await Document.scope(
      "includeAllEngagements"
    ).findAndCountAll({
      limit,
      offset
    });
    var count = documentQueryResult.count;
    var documents = documentQueryResult.rows.map(computeDocumentStats);
    return { count, documents: { rows: documents } };
  };
  return Document;
};

function computeDocumentStats(document) {
  const issues = document.comments.filter(c => !!c.issue);
  const comments = document.comments;
  const replies = comments.reduce(
    (replyArr, comment) =>
      comment.descendents && comment.descendents.length
        ? comment.descendents
            .filter(d => d.reviewed !== "spam")
            .concat(replyArr)
        : replyArr,
    []
  );
  return _.assignIn(
    {
      num_outstanding_issues: issues.filter(c => !c.issue.open).length,
      num_resolved_issues: issues.filter(c => c.issue.open).length,
      num_issues: issues.length,
      num_pending_comments: comments.filter(c => c.reviewed === "pending")
        .length,
      num_total_comments:
        comments.filter(c => c.reviewed !== "spam").length + replies.length,
      num_upvotes: document.upvotesFrom.length,
      num_downvotes: document.downvotesFrom.length
    },
    document.toJSON()
  );
}
