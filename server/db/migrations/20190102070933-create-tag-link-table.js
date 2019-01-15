"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.createTable("tag_links", {
        table: {
          type: Sequelize.STRING,
          allowNull: false
        },
        foreign_key: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        tagId: {
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
    return [queryInterface.dropTable("tag_links")];
  }
};
