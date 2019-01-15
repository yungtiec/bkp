const router = require("express").Router();
const { ensureAuthentication } = require("../utils");
const tagController = require("./controller")
module.exports = router;

/**
 * Getting all tags
 *
 * @name Get tags
 * @route {GET} /api/tags
 * @todo pagination/loading on scroll
 *
 */
router.get("/", tagController.getTags);

/**
 * Getting tags for annotatorjs's autocomplete
 *
 * @name Get tags by search term
 * @route {GET} /api/tags/autocomplete
 * @queryparam {String} term is the search keyword enter by user
 *
 */
router.get("/autocomplete", tagController.getAutocompleteTags);
