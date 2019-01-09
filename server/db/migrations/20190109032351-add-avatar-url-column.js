"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("users", "avatar_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "profile_pic_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "email_verified", {
        type: Sequelize.BOOLEAN
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("users", "avatar_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "profile_pic_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "email_verified", {
        type: Sequelize.BOOLEAN
      })
    ];
  }
};
