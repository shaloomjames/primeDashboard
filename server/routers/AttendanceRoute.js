const express = require("express");
const { createAttendance, getAttendance, getSingleAttendance, updateAttendance, deleteAttendance } = require("../controller/AttendanceController");
const router = express.Router();

router.route("/").post(createAttendance).get(getAttendance)
router.route("/:id").get(getSingleAttendance).put(updateAttendance).delete(deleteAttendance)

module.exports = router