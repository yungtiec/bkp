'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("documents", "feature_order", {
          type: Sequelize.INTEGER
        })
      ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("documents", "feature_order")]);
  }
};
