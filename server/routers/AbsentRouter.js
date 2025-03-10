const express = require("express");
const { markAbsencesForDate, markAbsencesForMonth } = require("../controller/MarkAbsentController");
const router = express.Router();

router.route("/").post(markAbsencesForDate);
router.route("/:id/:month").post(markAbsencesForMonth);
module.exports = router;
