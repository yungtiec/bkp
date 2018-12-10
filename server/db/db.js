const Sequelize = require("sequelize");
require("sequelize-hierarchy")(Sequelize);
const pkg = require("../../package.json");

const databaseName = "bkp" + (process.env.NODE_ENV === "test" ? "-test" : "");

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  {
    logging: false
  }
);
module.exports = db;
