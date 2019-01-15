"use strict";
module.exports = (db, DataTypes) => {
  const Tag = db.define("tag", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Tag.associate = function(models) {
    Tag.belongsToMany(models.comment, {
      through: "comment_tags",
      foreignKey: "tag_id"
    });
  };
  return Tag;
};
