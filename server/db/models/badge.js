"use strict";
module.exports = (db, DataTypes) => {
  const Badge = db.define("badge", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT
    }
  });
  Badge.associate = function(models) {
    Badge.belongsToMany(models.user, {
      through: "user_badges",
      foreignKey: "badge_id"
    });
  };
  return Badge;
};
