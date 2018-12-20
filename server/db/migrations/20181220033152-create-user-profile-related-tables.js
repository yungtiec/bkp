"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.createTable("career_roles", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.TEXT
        }
      }),
      queryInterface.createTable("locations", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        city: {
          type: Sequelize.TEXT
        },
        country: {
          type: Sequelize.TEXT
        }
      }),
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
    return [
      queryInterface.dropTable("career_roles"),
      queryInterface.dropTable("location"),
      queryInterface.dropTable("badges")
    ];
  }
};
