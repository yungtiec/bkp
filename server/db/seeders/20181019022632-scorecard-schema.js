"use strict";
var generateStepArrays = require("../../../json-schema/generateStepArrays");
var generateStepSchemasJson = require("../../../json-schema/generateStepSchemasJsonV2");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "wizard_schemas",
      [
        {
          id: 1,
          step_array_json: generateStepArrays(),
          step_schemas_json: generateStepSchemasJson(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {},
      {
        // queryInterface is not a sequelize instacne, it's a lower level API so need to define datatype here
        id: 2,
        step_array_json: { type: new Sequelize.JSON() },
        step_schemas_json: { type: new Sequelize.JSON() }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkDelete("wizard_schemas", {}, {})
      .then(() =>
        queryInterface.sequelize.query(
          `ALTER SEQUENCE "wizard_schemas_id_seq" RESTART WITH ${1};`
        )
      );
  }
};
