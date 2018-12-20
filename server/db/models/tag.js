"use strict";
module.exports = (db, DataTypes) => {
  const Tag = db.define("tag", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    display_name: {
      type: Sequelize.TEXT
    },
    type: {
      type: Sequelize.TEXT
    },
    pic: {
      type: Sequelize.TEXT
    },
    city: {
      type: Sequelize.TEXT
    },
    country: {
      type: Sequelize.TEXT
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
