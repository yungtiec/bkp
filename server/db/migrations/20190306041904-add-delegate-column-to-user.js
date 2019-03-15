"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "delegate", {
        type: Sequelize.BOOLEAN
      })
    ]).then(() => {
      return queryInterface.sequelize.query(
        "UPDATE users SET delegate = true, last_name = '', name = first_name WHERE lower(last_name) = lower('(REPOSTED BY BKP ADMIN)')"
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("users", "delegate")]);
  }
};
