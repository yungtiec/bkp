"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("questions", "feature_order", {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn("questions", "feature", {
        type: Sequelize.BOOLEAN
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("questions", "feature_order"),
      queryInterface.removeColumn("questions", "feature")
    ]);
  }
};
