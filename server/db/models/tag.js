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
  Tag.polymorphicAssociate = function(models) {
    const ModelsTobeAssociate = [models.user, models.document, models.comment];
    for (const Model of ModelsTobeAssociate) {
      Model.belongsToMany(Tag, {
        foreignKey: "foreign_key",
        constraints: false,
        through: {
          model: models.tag_link,
          unique: false,
          scope: {
            table: Model.name
          }
        }
      });
      Tag.belongsToMany(Model, {
        foreign_key: "tag_id",
        through: {
          model: models.tag_link,
          unique: false
        }
      });
    }
  };
  Tag.associate = function(models) {
    Tag.belongsToMany(models.comment, {
      through: "comment_tags",
      foreignKey: "tag_id"
    });
    Tag.polymorphicAssociate(models);
  };

  return Tag;
};
