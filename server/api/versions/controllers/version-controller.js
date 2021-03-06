const db = require("../../../db");
const {
  Project,
  Version,
  VersionAnswer,
  Document
} = require("../../../db/models");
const Sequelize = require("sequelize");

const getMetadata = async (req, res, next) => {
  try {
    const version = await Version.scope({
      method: ["basic", req.params.versionId]
    }).findOne();
    res.send(version);
  } catch (err) {
    next(err);
  }
};

const getMetadataBySlug = async (req, res, next) => {
  try {
    const version = await Version.scope({
      method: ["basic", req.params.version_slug]
    }).findOne();
    res.send(version);
  } catch (err) {
    next(err);
  }
};

const putScorecard = async (req, res, next) => {
  try {
    const version = await Version.findById(req.params.versionId).then(v =>
      v.update({ scorecard: req.body.scorecard })
    );
    res.send(version.scorecard);
  } catch (err) {
    next(err);
  }
};

const putContentJson = async (req, res, next) => {
  try {
    const version = await Version.findById(req.params.versionId).then(v =>
      v.update({ content_json: req.body.content_json })
    );
    res.send(version.content_json);
  } catch (err) {
    next(err);
  }
};



module.exports = {
  getMetadata,
  getMetadataBySlug,
  putScorecard,
  putContentJson
};
