module.exports = (db, DataTypes) => {
  const Podcast = db.define("podcast", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.STRING
    },
    author: {
      type: DataTypes.STRING
    },
    categories: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    duration: {
      type: DataTypes.STRING
    },
  });

  return Podcast;
};
