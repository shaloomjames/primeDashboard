const express = require("express");
const {
  createSalary,
  getsalary,
  getsingleUserSalary,
} = require("../controller/SalaryController");
const router = express.Router();

router.route("/").post(createSalary).get(getsalary);
router.route("/:id").get(getsingleUserSalary);

module.exports = router;
