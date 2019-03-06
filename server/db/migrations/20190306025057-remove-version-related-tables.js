"use strict";
Promise = require("bluebird");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("comments", "version_id"),
      queryInterface.removeColumn("comments", "version_question_id"),
      queryInterface.removeColumn("comments", "version_answer_id"),
      queryInterface.removeColumn("issues", "resolving_version_id")
    ]).then(() =>
      Promise.each(
        [
          "survey_questions",
          "surveys",
          "version_answersancestors",
          "version_answers",
          "version_questionsancestors",
          "version_questions",
          "versionsancestors",
          "versions"
        ],
        function(table) {
          return queryInterface.dropTable(table);
        }
      )
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
