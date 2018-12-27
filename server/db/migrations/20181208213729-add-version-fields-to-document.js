"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("documents", "slug", {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn("documents", "submitted", {
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn("documents", "reviewed", {
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn("documents", "comment_until_unix", {
        type: Sequelize.BIGINT
      }),
      queryInterface.addColumn("documents", "content_html", {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn("documents", "category", {
        type: Sequelize.ENUM('GENERAL', 'SCORECARD', 'REGULATORY')
      })
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("documents", "slug"),
      queryInterface.removeColumn("documents", "submitted"),
      queryInterface.removeColumn("documents", "reviewed"),
      queryInterface.removeColumn("documents", "comment_until_unix"),
      queryInterface.removeColumn("documents", "content_html"),
      queryInterface.removeColumn("documents", "category")
    ]);
  }
};
