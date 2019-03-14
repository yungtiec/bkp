"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("questions", "document_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
          key: "id"
        }
      }),
      queryInterface.addColumn("questions", "owner_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      }),
      queryInterface.addColumn("questions", "parentId", {
        type: Sequelize.INTEGER,
        references: {
          model: "questions",
          key: "id"
        }
      }),
      queryInterface.addColumn("comments", "question_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "questions",
          key: "id"
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("questions", "document_id"),
      queryInterface.removeColumn("questions", "owner_id"),
      queryInterface.removeColumn("questions", "parentId"),
      queryInterface.removeColumn("comments", "question_id")
    ];
  }
};
