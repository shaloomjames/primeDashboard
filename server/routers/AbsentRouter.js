const express = require("express");
const { markAbsencesForDate } = require("../controller/MarkAbsentController");
const router = express.Router();

router.route("/").post(markAbsencesForDate);
module.exports = router;
