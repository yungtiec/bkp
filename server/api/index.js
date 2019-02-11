// api design for nested resources
// https://stackoverflow.com/questions/20951419/what-are-best-practices-for-rest-nested-resources

const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/projects", require("./projects"));
router.use("/documents", require("./documents"));
router.use("/comments", require("./comments"));
router.use("/versions", require("./versions"));
router.use("/issues", require("./issues"));
router.use("/tags", require("./tags"));
router.use("/notifications", require("./notifications"));
router.use("/feedback", require("./feedback"));
router.use("/wizard-schemas", require("./wizard-schemas"));
router.use("/unsplash", require("./unsplash"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
