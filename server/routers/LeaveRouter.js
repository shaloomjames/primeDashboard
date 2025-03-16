const express = require("express");
const {
  createLeaveRequest,
  getLeaveHistory,
  updateLeaveStatus,
  getLeaveHistoryByEmployee,
  deleteLeave,
} = require("../controller/LeaveController");
const router = express.Router();

router.route("/").post(createLeaveRequest).get(getLeaveHistory);
router.route("/:id").get(getLeaveHistoryByEmployee).put(updateLeaveStatus).delete(deleteLeave);

module.exports = router;