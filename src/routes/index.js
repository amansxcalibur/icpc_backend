const express = require("express");
const scoreRoutes = require("./score_routes");

const router = express.Router();

router.use("/scores", scoreRoutes);

module.exports = router;
