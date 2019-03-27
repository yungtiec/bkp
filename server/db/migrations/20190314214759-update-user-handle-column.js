'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([ queryInterface.changeColumn("users", "user_handle", {
      type: Sequelize.TEXT,
      unique: true
    })
   ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([ queryInterface.changeColumn("users", "user_handle", {
      type: Sequelize.TEXT
    })
    ]);
  }
};
