"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.createTable("badges", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.TEXT
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.dropTable("badges")];
  }
};
