"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("versions", "pdf_link", {
        type: Sequelize.TEXT
      })
      .then(() => {
        queryInterface.sequelize.query(
          "UPDATE versions SET pdf_link = 'https://static1.squarespace.com/static/5a329be3d7bdce9ea2f3a738/t/5b9a09b50ebbe8e9409e291a/1536821696423/The+Brooklyn+Project%E2%80%94Framework+Document+1+09_06_18.pdf' WHERE document_id = 1;"
        );
      });
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.removeColumn("versions", "pdf_link")];
  }
};
