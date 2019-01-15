"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("tags", "display_name", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("tags", "type", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("tags", "pic", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("tags", "city", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("tags", "country", {
        type: Sequelize.TEXT
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("tags", "display_name", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("tags", "type", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("tags", "pic", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("tags", "city", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("tags", "country", {
        type: Sequelize.TEXT
      })
    ];
  }
};
