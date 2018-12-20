"use strict";
module.exports = (db, DataTypes) => {
  const Location = db.define("location", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    city: {
      type: DataTypes.TEXT
    },
    country: {
      type: DataTypes.TEXT
    }
  });
  Location.associate = function(models) {
    Location.belongsToMany(models.user, {
      through: "user_locations",
      foreignKey: "location_id"
    });
  };
  return Location;
};
