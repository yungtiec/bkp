"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("questions", "slug", {
        type: Sequelize.STRING
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.removeColumn("questions", "slug")];
  }
};

