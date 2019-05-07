'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("documents", "has_annotator", {
        type: Sequelize.BOOLEAN
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("documents", "has_annotator")]);
  }
};
