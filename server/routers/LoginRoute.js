const express = require("express");
const {loginController} = require("../controller/LoginController");
const router = express.Router();

router.route("/").post(loginController)
module.exports=router;