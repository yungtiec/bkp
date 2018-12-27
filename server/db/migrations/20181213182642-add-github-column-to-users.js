"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "githubId", {
        type: Sequelize.STRING
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("users", "githubId")]);
  }
};

