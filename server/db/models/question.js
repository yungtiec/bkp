"use strict";
const Sequelize = require("sequelize");
const _ = require("lodash");

module.exports = (db, DataTypes) => {
  const Question = db.define("question", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_in_document: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    slug: {
      type: DataTypes.STRING
    },
    feature: {
      type: DataTypes.BOOLEAN
    },
    feature_order: {
      type: DataTypes.INTEGER
    }
  });
  Question.isHierarchy();
  Question.associate = function(models) {
    Question.belongsTo(models.document, {
      foreignKey: "document_id"
    });
    Question.belongsTo(models.user, {
      foreignKey: "owner_id",
      as: "owner"
    });
    Question.hasMany(models.comment, {
      foreignKey: "question_id"
    });
    Question.belongsToMany(models.user, {
      as: "upvotesFrom",
      through: "question_upvotes",
      foreignKey: "question_id"
    });
    Question.belongsToMany(models.user, {
      as: "downvotesFrom",
      through: "question_downvotes",
      foreignKey: "question_id"
    });
  };
  Question.loadScopes = function(models) {
    Question.addScope("main", function({
      extendedWhere,
      extendedInclude,
      extendedAttributes
    }) {
      var attributes = [
        "id",
        "title",
        "description",
        "document_id",
        "order_in_document",
        "owner_id",
        "slug",
        "feature",
        "feature_order",
        "createdAt",
        "updatedAt",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM comments WHERE comments.question_id = question.id)"
          ),
          "num_comments"
        ],
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM question_upvotes WHERE question_upvotes.question_id = question.id)"
          ),
          "num_upvotes"
        ],
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM question_downvotes WHERE question_downvotes.question_id = question.id)"
          ),
          "num_downvotes"
        ]
      ];
      var include = [
        {
          model: models["user"],
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

          as: "owner"
        },
        {
          model: models.user,
          as: "upvotesFrom",
          attributes: ["first_name", "last_name", "name", "email", "id"]
        },
        {
          model: models.user,
          as: "downvotesFrom",
          attributes: ["first_name", "last_name", "name", "email", "id"]
        },
        {
          model: models["tag"]
        }
      ];
      var query = { include, attributes };
      if (extendedWhere) query.where = extendedWhere;
      if (extendedInclude) query.include = include.concat(extendedInclude);
      if (extendedAttributes)
        query.attributes = attributes.concat(extendedAttributes);
      return query;
    });
    Question.addScope("withComments", function() {
      return {
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
      };
    });
  };
  return Question;
};
