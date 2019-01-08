"use strict";
module.exports = (db, DataTypes) => {
  const TagLink = db.define("tag_link", {
    table: {
      type: DataTypes.STRING,
      allowNull: false
    },
    foreign_key: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  TagLink.associate = function(models) {
    TagLink.belongsTo(models.tag);
  };
  return TagLink;
};
