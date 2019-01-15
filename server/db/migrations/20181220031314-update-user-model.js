"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("users", "short_profile_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "self_introduction", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "user_handle", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "profile_pic_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "linkedin_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "twitter_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "github_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "stackoverflow_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "website_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn("users", "profile_update_prompted", {
        type: Sequelize.BOOLEAN
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("users", "short_profile_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "self_introduction", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "user_handle", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "profile_pic_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "linkedin_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "twitter_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "github_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "stackoverflow_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "website_url", {
        type: Sequelize.TEXT
      }),
      queryInterface.removeColumn("users", "profile_update_prompted", {
        type: Sequelize.BOOLEAN
      })
    ];
  }
};
