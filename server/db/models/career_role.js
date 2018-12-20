"use strict";
module.exports = (db, DataTypes) => {
  const CareerRole = db.define("career_role", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT
    }
  });
  CareerRole.associate = function(models) {
    CareerRole.belongsToMany(models.user, {
      through: "user_career_roles",
      foreignKey: "career_role_id"
    });
  };
  return CareerRole;
};
