"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "UPDATE users SET user_handle = replace(lower(first_name || last_name), ' ', '') WHERE name IS NOT NULL; UPDATE users SET user_handle = 'user' || id WHERE (user_handle = '') IS NOT FALSE;"
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "user_handle").then(() =>
      queryInterface.addColumn("users", "user_handle", {
        type: Sequelize.TEXT
      })
    );
  }
};
