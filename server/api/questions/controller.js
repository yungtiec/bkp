const { Question } = require("../../db/models");
const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.scope({
      method: ["default", {}]
    }).findAll();
    res.send(questions);
  } catch (err) {
    next(err);
  }
};

const postQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.send(question);
  } catch (err) {
    next(err);
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.scope([
      {
        method: ["default", {}]
      },
      {
        method: ["withComments", {}]
      }
    ]).findOne({
      where: { id: req.params.questionId }
    });
    res.send(question);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuestions,
  postQuestion,
  getQuestionById
};
