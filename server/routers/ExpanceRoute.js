const express = require("express");
const {  getExpance, getSingleExpance,  createExpance, updateExpance, deleteExpance, getTb1Expance, getTb2Expance } = require("../controller/ExpanceController");
const router = express.Router();
const {upload} = require("../config/multer")


router.route("/").post(upload.single("expanceImage"),createExpance).get(getExpance)
router.route("/:id").get(getSingleExpance).put(upload.single("expanceImage"),updateExpance).delete(deleteExpance)
router.route("/tb1/t").get(getTb1Expance)
router.route("/tb2/t").get(getTb2Expance) 


module.exports = router