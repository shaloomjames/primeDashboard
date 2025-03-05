const express = require("express");
const {
  createAttendance,
  getAttendance,
  getSingleAttendance,
  updateAttendance,
  getAttendanceByEmployeeId,
  getAttendanceReport,
} = require("../controller/AttendanceController");
const router = express.Router();

router.route("/").post(createAttendance).get(getAttendance);
router.route("/:id").get(getAttendanceByEmployeeId).put(updateAttendance);
router.route("/:id/:date").get(getSingleAttendance);
// Route to generate an attendance report
router.get("/report/:employeeId/:month", getAttendanceReport);

module.exports = router;
