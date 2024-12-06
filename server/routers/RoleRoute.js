const express = require("express");
const { createRole, getRole, updateRole, deleteRole, getSingleRole, getActiveRole } = require("../controller/RoleController");
const router = express.Router();

router.route("/").post(createRole).get(getRole)
router.route("/:id").get(getSingleRole).put(updateRole).delete(deleteRole)
router.route("/active/R").get(getActiveRole) 

module.exports = router