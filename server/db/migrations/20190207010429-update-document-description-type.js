"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("documents", "description")
      .then(() => {
        return queryInterface.addColumn("documents", "description", {
          type: Sequelize.TEXT
        })
      })
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("documents", "description")]);
  }
};
