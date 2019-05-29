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
router.get("/", tagController.getXML);
