const express = require("express");
const { getFinalRanklist } = require("../controllers/score_controller");
const router = express.Router();

router.get("/final-ranklist", getFinalRanklist);

module.exports = router;
