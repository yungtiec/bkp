require("../secrets");
Promise = require("bluebird");
const db = require("../server/db/db");
const {
  Document,
  Version,
  VersionQuestion,
  VersionAnswer,
  Comment,
  Project
} = require("../server/db/models");
const rp = require("request-promise");
const _ = require("lodash");
const cheerio = require("cheerio");
const showdown = require("showdown");
const converter = new showdown.Converter({ tables: true });
const { createSlug } = require("../server/api/utils");
const fs = require("fs");
const csv_parse = require("csv-parse");
const parse = Promise.promisify(csv_parse);

const migrate = async () => {
  try {
    await db.sync();
    await mapDocumentData();
    await migrateAnnotationRanges();
    await migrateDocumentHeaderImages();
    db.close();
  } catch (error) {
    console.log(error);
    db.close();
  }
};

async function migrateAnnotationRanges() {
  const annotationCsv = fs.readFileSync("./data/migrate-annotation-ranges.csv");
  var rows = await parse(annotationCsv, {
    columns: true,
    cast: false
  });
  return Promise.map(rows, row =>
    Comment.findById(Number(row.comment)).then(comment => {
      return comment
        ? comment.update({
            ranges: JSON.parse(
              `[${unescape(row.ranges.replace(/\\/g, ``)).slice(2, -2)}]`
            )
          })
        : null;
    })
  );
}

async function migrateDocumentHeaderImages() {
  const documentHeaderImagesCsv = fs.readFileSync(
    "./data/migrate-document-header-images.csv"
  );
  var rows = await parse(documentHeaderImagesCsv, {
    columns: true,
    cast: false
  });
  return Promise.map(rows, row =>
    Document.findById(row.id).then(document => {
      return document
        ? document.update({
            header_img_url: row.header_img_url
          })
        : null;
    })
  );
}

const mapDocumentData = async () => {
  var documents = await Document.findAll({
    include: [
      {
        model: Version,
        include: [
          { model: Comment },
          {
            model: VersionQuestion,
            where: { latest: true },
            include: { model: VersionAnswer, where: { latest: true } }
          }
        ]
      },
      {
        model: Project
      }
    ]
  });
  return Promise.map(documents, mapData);
};

const newCategoryNames = {
  general: "thought-leadership",
  scorecard: "transparency-scorecard",
  regulatory: "regulatory-notices",
  "regulatory-for-comment": "regulatory-requests-for-comment",
  "proposed-laws-regulations": "proposed-laws-and-regulations"
};

const mapData = async document => {
  // we've adhered to the rule of one version per document
  var version = document.versions[0];
  if (version) {
    var comments = version.comments;
    var versionQuestions = _.orderBy(
      version.version_questions,
      ["order_in_version"],
      ["asc"]
    );
    var contentHtml = createHtmlFromQnaMarkdown(versionQuestions);
    var documentSlug = createSlug(document.title, contentHtml);
    var dataMovingFromVersionToDocument = _.pick(version, [
      "submitted",
      "reviewed",
      "comment_until_unix",
      "version_slug"
    ]);
    var project = document.project;
    var category = _.clone(document.document_type);
    document = await document.update(
      _.assignIn(dataMovingFromVersionToDocument, {
        slug: dataMovingFromVersionToDocument.version_slug
          ? dataMovingFromVersionToDocument.version_slug
          : documentSlug,
        content_html: contentHtml,
        category:
          _.values(newCategoryNames).indexOf(document.category) !== -1
            ? document.category
            : category
            ? newCategoryNames[category]
            : "thought-leadership",
        document_type: !_.isEmpty(version.scorecard)
          ? "legacy_scorecard"
          : "html",
        scorecard: _.isEmpty(version.scorecard) ? null : version.scorecard
      })
    );
    return await updateCommentForeignKey(comments, document.id);
  } else {
    document = await document.update({
      category:
        _.values(newCategoryNames).indexOf(document.category) !== -1
          ? document.category
          : category
          ? newCategoryNames[category]
          : "thought-leadership",
      document_type: "html"
    });
  }
};

const createHtmlFromQnaMarkdown = versionQuestions => {
  if (!versionQuestions) return;
  return versionQuestions.reduce((htmlString, vq) => {
    var vqHtml = converter.makeHtml(vq.markdown);
    var vaHtml = vq.version_answers
      ? vq.version_answers[0] &&
        converter.makeHtml(vq.version_answers[0].markdown)
      : "";
    return htmlString + vqHtml + vaHtml;
  }, "");
};

const updateCommentForeignKey = (comments, documentId) => {
  if (!comments) return;
  return Promise.map(comments, comment =>
    comment.update({ doc_id: documentId })
  );
};

const test = async () => {
  try {
    var document = await Document.findOne({
      where: { id: 1 },
      include: [
        {
          model: Version,
          include: [
            { model: Comment },
            { model: VersionQuestion, include: { model: VersionAnswer } }
          ]
        },
        {
          model: Project
        }
      ]
    });
    await mapData(document);
  } catch (err) {
    console.log(err);
  }
};

migrate();
