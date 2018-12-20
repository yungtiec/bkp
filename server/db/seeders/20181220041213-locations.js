"use strict";
const rp = require("request-promise");
const Promise = require("bluebird");
const parse = require("csv-parse");
const parsePromise = Promise.promisify(parse);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const cities = await rp.get(
      "https://pkgstore.datahub.io/core/world-cities/world-cities_csv/data/6cc66692f0e82b18216a48443b6b95da/world-cities_csv.csv"
    );
    const citiesArray = await parsePromise(cities, { columns: true });
    return queryInterface.bulkInsert(
      "locations",
      citiesArray.map(data => ({ city: data.name, country: data.country })),
      {},
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkDelete("locations", {}, {})
      .then(() =>
        queryInterface.sequelize.query(
          `ALTER SEQUENCE "locations_id_seq" RESTART WITH ${1};`
        )
      );
  }
};
