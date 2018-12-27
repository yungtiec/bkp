'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("comments", "doc_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
          key: "id"
        }
      }),
      queryInterface.addColumn("issues", "resolving_doc_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
          key: "id"
        }
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("comments", "doc_id"),
      queryInterface.removeColumn("issues", "resolving_doc_id")
    ]);
  }
};
