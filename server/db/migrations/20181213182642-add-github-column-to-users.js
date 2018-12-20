"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("users", "githubId", {
        type: Sequelize.STRING
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.removeColumn("users", "githubId")];
  }
};

// merge
