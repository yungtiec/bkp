"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.createTable("user_tags", {
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "users",
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
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.dropTable("user_tags")];
  }
};
