const express = require("express");
const { getExpanceCategory, getSingleExpanceCategory, getActiveExpanceCategory, createExpanceCategory, updateExpanceCategory, deleteExpanceCategory } = require("../controller/ExpanceCategoryController");
const router = express.Router();

router.route("/").post(createExpanceCategory).get(getExpanceCategory);
router.route("/:id").get(getSingleExpanceCategory).put(updateExpanceCategory).delete(deleteExpanceCategory);
router.route("/active/E").get(getActiveExpanceCategory);


module.exports = router