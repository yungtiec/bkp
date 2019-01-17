"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkInsert(
        "documents",
        [
          {
            id: 4,
            title: "Consumer Token Framework",
            project_id: 1,
            creator_id: 1,
            latest_version: 1,
            createdAt: "2018-09-07 12:15:16.517-04",
            updatedAt: "2018-09-07 12:15:16.517-04"
          }
        ],
        {},
        {}
      )
      .then(() => {
        return queryInterface.sequelize.query(
          'UPDATE versions SET document_id = 4, "hierarchyLevel" = 1, "parentId" = NULL WHERE id = 2'
        );
      })
      .then(() => {
        return queryInterface.sequelize.query(
          'UPDATE documents SET title = "Consumer Token Framework v0.4" WHERE id = 4'
        );
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "UPDATE versions SET document_id = 1 WHERE id = 2"
    );
  }
};
