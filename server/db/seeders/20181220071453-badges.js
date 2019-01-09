"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "badges",
      [
        {
          name: "Top Telegram Contributor",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW")
        },
        {
          name: "Authenticated User",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW")
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
