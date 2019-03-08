const { Question } = require("../../db/models");
const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  getEngagedUsers,
  createSlug,
  getAddedAndRemovedTags
} = require("../utils");

const getQuestions = async (req, res, next) => {
  try {
    var where, include, includeTag, formattedSearchTerms;
    // parse query
    if (req.query.order) req.query.order = JSON.parse(req.query.order);
    if (!req.query.search) formattedSearchTerms = null;
    else {
      var queryArray = req.query.search.trim().split(" ");
      formattedSearchTerms = queryArray
        .map(function(phrase) {
          return "%" + phrase + "%";
        })
        .join("");
    }
    // construct where clause
    if (formattedSearchTerms)
      where = where
        ? _.assign(where, { title: { $iLike: formattedSearchTerms } })
        : { title: { $iLike: formattedSearchTerms } };
    // construct include clause
    if (req.query.tags && req.query.tags.length) {
      includeTag = {
        model: Tag,
        require: true,
        where: {
          name: {
            [Sequelize.Op.or]: req.query.tags.map(c => ({
              [Sequelize.Op.eq]: c.value.toLowerCase()
            }))
          }
        }
      };
    }
    // construct limit, offset and order options
    var limit = Number(req.query.limit);
    var offset = Number(req.query.offset);
    var order = req.query.order;
    if (order && order.value === "date") {
      order = [["createdAt", "DESC"]];
    } else if (order && order.value === "most-upvoted") {
      order = [[Sequelize.literal("num_upvotes"), "DESC"]];
    } else if (order && order.value === "most-discussed") {
      order = [[Sequelize.literal("num_comments"), "DESC"]];
    }
    var options = {
      offset,
      order
    };
    if (req.query.limit) options.limit = limit;
    // query
    const questions = await Question.scope({
      method: ["main", { extendedInclude: includeTag, extendedWhere: where }]
    }).findAll(options);
    res.send(questions);
  } catch (err) {
    next(err);
  }
};

const postQuestion = async (req, res, next) => {
  try {
    const slug = await createSlug(
      "",
      req.body.title + req.body.description || ""
    );
    var question = await Question.create(
      _.assignIn({ slug, owner_id: req.body.owner.value }, req.body)
    );
    const selectedTagPromises = await Promise.map(
      req.body.selectedTags,
      async selectedTag => {
        const [tag, created] = await Tag.findOrCreate({
          where: { name: selectedTag.value, display_name: selectedTag.label },
          default: { name: selectedTag.value, display_name: selectedTag.label }
        });
        return question.addTag(tag.id);
      }
    );
    question = await Question.scope([
      {
        method: ["main", {}]
      },
      {
        method: ["withComments", {}]
      }
    ]).findOne({ where: { id: question.id } });
    res.send(question);
  } catch (err) {
    next(err);
  }
};

const getQuestionBySlug = async (req, res, next) => {
  try {
    const question = await Question.scope([
      {
        method: ["main", {}]
      },
      {
        method: ["withComments", {}]
      }
    ]).findOne({
      where: { slug: req.params.slug }
    });
    res.send(question);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuestions,
  postQuestion,
  getQuestionBySlug
};
