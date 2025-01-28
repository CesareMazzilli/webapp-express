const express = require("express");
const router = express.Router();
const movieController = require("../controllers/MoviesController");

router.get("/", movieController.index);

router.get("/:slug", movieController.show);

router.post("/:id/reviews", movieController.storeReview);

module.exports = router;