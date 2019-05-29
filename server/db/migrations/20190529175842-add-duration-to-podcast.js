'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("podcasts", "duration", {
        type: Sequelize.BOOLEAN
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("podcasts", "duration")]);
  }
};
