"use strict";

module.exports = (db, DataTypes) => {
  const Question = db.define("question", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_in_document: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  });
  Question.isHierarchy();
  Question.associate = function(models) {
    Question.belongsTo(models.document, {
      foreignKey: "document_id"
    });
    Question.belongsTo(models.user, {
      foreignKey: "owner_id"
    });
    Question.hasMany(models.comment, {
      foreignKey: "question_id"
    });
  };
  Question.loadScopes = function(models) {};
  return Question;
};
