const router = require("express").Router();
const { Project, ProjectSurvey, Survey, User } = require("../db/models");
const db = require("../db");
const { ensureAuthentication } = require("./utils");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    res.send(projects);
  } catch (err) {
    next(err);
  }
});

router.get("/:symbol", async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { symbol: req.params.symbol },
      include: [
        {
          model: ProjectSurvey,
          where: { submitted: true, reviewed: true },
          required: false,
          include: [
            {
              model: Survey,
              include: [{ model: User, as: "creator" }]
            }
          ]
        }
      ]
    });
    res.send(project);
  } catch (err) {
    next(err);
  }
});