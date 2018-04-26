const Sequelize = require("sequelize");
const db = require("../db");

const Project = db.define("project", {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  symbol: {
    type: Sequelize.STRING,
    unique: true
  },
  description: {
    type: Sequelize.TEXT
  }
});

module.exports = Project;
