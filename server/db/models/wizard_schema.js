"use strict";
module.exports = (sequelize, DataTypes) => {
  const WizardSchema = sequelize.define("wizard_schema", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    step_array_json: {
      type: DataTypes.JSON
    },
    step_schemas_json: {
      type: DataTypes.JSON
    }
  });

  WizardSchema.isHierarchy();
  WizardSchema.associate = function(models) {};
  return WizardSchema;
};
