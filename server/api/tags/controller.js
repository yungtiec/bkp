const { Tag } = require("../../db/models");
const _ = require("lodash");
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
    if (!req.query.term || (req.query.term && req.query.term.length < 3))
      res.send([]);
    else {
      const tags = await Tag.findAll({
        where: { name: { [Op.iLike]: `%${req.query.term}%` } }
      });
      res.send(
        tags.map(tag =>
          _.assignIn({ label: tag.name, value: tag.name }, tag.toJSON())
        )
      );
    }
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
