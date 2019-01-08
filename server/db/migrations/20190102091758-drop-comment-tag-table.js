"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("comment_tags");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.createTable("comment_tags", {
      comment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "comments",
          key: "id"
        }
      },
      tag_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "tags",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  }
};
