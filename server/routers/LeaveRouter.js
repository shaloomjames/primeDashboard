const express = require("express");
const {
  createLeaveRequest,
  getLeaveHistory,
  updateLeaveStatus,
  getSingleLeave,
  deleteLeave,
} = require("../controller/LeaveController");
const router = express.Router();

router.route("/").post(createLeaveRequest).get(getLeaveHistory);
router.route("/:id").get(getSingleLeave ).put(updateLeaveStatus).delete(deleteLeave);

module.exports = router;
