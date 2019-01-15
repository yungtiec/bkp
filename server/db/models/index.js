"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require("sequelize-hierarchy")(Sequelize);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};
const exportedDb = {};
const _ = require("lodash");

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
    // _.assignIn(config, { logging: console.log })
  );
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf("spec") === -1
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
    exportedDb[
      model.name
        .split("_")
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join("")
    ] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

Object.keys(db).forEach(function(modelName) {
  if ("loadScopes" in db[modelName]) {
    db[modelName].loadScopes(db);
  }
});

exportedDb.sequelize = sequelize;
exportedDb.Sequelize = Sequelize;

module.exports = exportedDb;
