const router = require("express").Router();
const { ensureAuthentication } = require("../utils");
const questionController = require("./controller");
module.exports = router;

/**
 * Getting all questions
 *
 * @name Get questions
 * @route {GET} /api/questions
 * @todo pagination/loading on scroll
 *
 */
router.get("/", questionController.getQuestions);

/**
 * Posting question
 *
 * @name Post question
 * @route {POST} /api/questions
 * @body {Object} question object
 *
 */
router.post("/", questionController.postQuestion);

/**
 * Getting question by id
 *
 * @name Get question by tag
 * @route {GET} /api/questions/:questionId
 * @routeparam {String} questionId
 *
 */
router.get("/:questionId", questionController.getQuestionById);
