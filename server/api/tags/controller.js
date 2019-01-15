const { Tag } = require("../../db/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    res.send(tags);
  } catch (err) {
    next(err);
  }
};

const getAutocompleteTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll({
      where: { name: { [Op.iLike]: `%${req.query.term}%` } }
    });
    res.send(
      tags.map(tag => ({ id: tag.id, label: tag.name, value: tag.name }))
    );
  } catch (err) {
    next(err);
  }
};

const searchTags = async (req, res, next) => {
  try {
    var formattedQuery = !req.query.q
      ? null
      : req.query.q
          .trim()
          .split(" ")
          .map(function(phrase) {
            return "%" + phrase + "%";
          })
          .join("");
    var queryObj = {
      where: {
        name: { $iLike: formattedQuery }
      }
    };
    if (req.query.type) queryObj.where.type = req.query.type;
    var tags = await Tag.findAll(queryObj);
    res.send(tags);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTags,
  getAutocompleteTags,
  searchTags
};
