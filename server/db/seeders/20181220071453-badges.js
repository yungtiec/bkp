"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "badges",
      [
        {
          name: "Top Telegram Contributor"
        },
        {
          name: "Authenticated User"
        }
      ],
      {},
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkDelete("badges", {}, {})
      .then(() =>
        queryInterface.sequelize.query(
          `ALTER SEQUENCE "badges_id_seq" RESTART WITH ${1};`
        )
      );
  }
};
