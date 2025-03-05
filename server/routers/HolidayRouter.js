const express = require("express");
const {
  createHoliday,
  getHolidays,
  deleteHoliday,
  updateHoliday,
  getSingleHoliday,
} = require("../controller/HolidayController");

const router = express.Router();

router.route("/").post(createHoliday).get(getHolidays);
router
  .route("/:id")
  .get(getSingleHoliday)
  .put(updateHoliday)
  .delete(deleteHoliday);

module.exports = router;
