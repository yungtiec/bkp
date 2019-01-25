const axios = require('axios');
const router = require("express").Router();
module.exports = router;

/**
 * Getting a wizard schema by id
 *
 * @name Get wizard schema by id
 * @route {GET} /api/wizard-schema
 * @todo pagination
 *
 */
router.get("/", async (req, res, next) => {
  const query = req.query.query || 'blockchain';
  try {
    const unsplashRes = await axios
      .get(
        `https://api.unsplash.com/search/photos/?page=1&per_page=16&query=${query}&client_id=${process.env.UNSPLASH_CLIENT_ID}`
      );
    res.send(unsplashRes.data);
  } catch (err) {
    next(err);
  }
});
