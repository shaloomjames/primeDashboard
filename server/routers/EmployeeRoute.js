const express = require("express");
const { createEmployee, getEmployee, getSingleEmployee, deleteEmployee, updateEmployee, getDeletedEmployee, deleteEmployeePermanently, restoreEmployee , forgotPasswordController, resetPasswordController} = require("../controller/EmployeeController");
const router = express.Router();

router.route("/").post(createEmployee).get(getEmployee)
router.route("/:id").get(getSingleEmployee).put(updateEmployee).delete(deleteEmployee)
router.route("/deletedemployee/restoreemployee/:id").post(restoreEmployee);
router.route("/deletedemployee/delete/:id").delete(deleteEmployeePermanently)
router.route("/deletedemployee/d").get(getDeletedEmployee)
router.route("/forgotpassword").post(forgotPasswordController)
router.route("/resetpassword").post(resetPasswordController)



module.exports = router