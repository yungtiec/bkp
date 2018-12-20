"use strict";
module.exports = (db, DataTypes) => {
  const Tag = db.define("tag", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    display_name: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.TEXT
    },
    pic: {
      type: DataTypes.TEXT
    },
    city: {
      type: DataTypes.TEXT
    },
    country: {
      type: DataTypes.TEXT
    }
  });
  Tag.associate = function(models) {
    Tag.belongsToMany(models.comment, {
      through: "comment_tags",
      foreignKey: "tag_id"
    });
    Tag.belongsToMany(models.user, {
      through: "user_tags",
      foreignKey: "tag_id"
    });
  };
  return Tag;
};
