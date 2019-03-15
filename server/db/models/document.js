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
      type: DataTypes.TEXT
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
    scorecard: {
      type: DataTypes.JSON
    },
    category: {
      type: DataTypes.STRING
    },
    header_img_url: {
      type: DataTypes.TEXT
    }
  });
  Document.associate = function(models) {
    Document.hasMany(models.question, {
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
            as: "creator",
            attributes: [
              "id",
              "email",
              "name",
              "first_name",
              "last_name",
              "organization",
              "restricted_access",
              "short_profile_url",
              "self_introduction",
              "linkedin_url",
              "twitter_url",
              "stackoverflow_url",
              "website_url",
              "github_url",
              "user_handle",
              "avatar_url",
              "createdAt",
              "delegate"
            ]
          },
          {
            model: models["tag"]
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
    Document.addScope("includeAllEngagements", function(
      extendedWhereOptions = {},
      extendedIncludeOptions
    ) {
      var defaultWhereOptions = {
        submitted: true,
        reviewed: true
      };
      var where = _.assignIn(defaultWhereOptions, extendedWhereOptions);
      var attributes = [
        "id",
        "title",
        "document_type",
        "description",
        "project_id",
        "submitted",
        "reviewed",
        "comment_until_unix",
        "slug",
        "content_html",
        "scorecard",
        "category",
        "header_img_url",
        "creator_id",
        "createdAt",
        "updatedAt",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM comments WHERE comments.doc_id = document.id)"
          ),
          "num_comments"
        ],
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM document_upvotes WHERE document_upvotes.document_id = document.id)"
          ),
          "num_upvotes"
        ],
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM document_downvotes WHERE document_downvotes.document_id = document.id)"
          ),
          "num_downvotes"
        ]
      ];
      var include = [
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
          attributes: [
            "id",
            "email",
            "name",
            "first_name",
            "last_name",
            "organization",
            "restricted_access",
            "short_profile_url",
            "self_introduction",
            "linkedin_url",
            "twitter_url",
            "stackoverflow_url",
            "website_url",
            "github_url",
            "user_handle",
            "avatar_url",
            "createdAt",
            "delegate"
          ],
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
          model: models["tag"]
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
      ];
      if (extendedIncludeOptions)
        include = include.concat(extendedIncludeOptions);
      return {
        where,
        attributes,
        include
      };
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

  Document.getDocumentsWithStats = async function({
    offset,
    limit,
    order,
    where
  }) {
    var documentQueryResult = await Document.scope({
      method: ["includeAllEngagements", where]
    }).findAndCountAll({
      limit,
      offset,
      order
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
