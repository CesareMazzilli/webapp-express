const express = require("express");
const router = express.Router();
const movieController = require("../controllers/MoviesController");
const upload = require("../middlewares/fileUpload");

router.get("/", movieController.index);

router.get("/:slug", movieController.show);

router.post("/:id/reviews", movieController.storeReview);

router.post("/", upload.single("image"), movieController.store);

module.exports = router;