"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.createTable("tag_link", {
        table: {
          type: Sequelize.STRING,
          allowNull: false
        },
        foreign_key: {
          type: Sequelize.INTEGER,
          allowNull: false
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
    return [queryInterface.dropTable("tag_link")];
  }
};
