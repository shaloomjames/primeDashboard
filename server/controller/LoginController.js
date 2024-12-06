const mongoose = require("mongoose");
const employeeModel = require("../models/EmployeeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// @Request   POST
// @Route     http://localhost:5000/api/employee/login
// @Access    Private
const loginController = async (req, res) => {
  try {
    const { employeeEmail, employeePassword } = req.body;

    // Check if both email and password are provided
    if (!employeeEmail || !employeePassword)
      return res.status(400).json({ err: "Invalid Input's" });
    // Check if user exists
    // const checkUserExistance = await employeeModel.findOne({ employeeEmail });
    const checkUserExistance = await employeeModel
      .findOne({ employeeEmail })
      .populate("employeeRoles");

    // if email dosen'd exist throw error
    if (!checkUserExistance)
      return res.status(400).json({ err: "Email or password is incorrect.!" });

    // password comparison
    const passwordComparison = await bcrypt.compare(
      employeePassword,
      checkUserExistance.employeePassword
    );

    // if password  is incorrect return error
    if (!passwordComparison)
      return res.status(400).json({ err: "Credentials Wrong!" });

    // if password is valid generate a token
    // const token = await jwt.sign(
    //     { userid: checkUserExistance._id, useremail: checkUserExistance.employeeEmail, userrole: checkUserExistance.employeeRole },
    //     process.env.Jwt_secret_key,
    //     {
    //         expiresIn: "30d"
    //     });

    // if password is valid generate a token
    // Extract roleName
    // const roleName = checkUserExistance.employeeRoles.map((role,index)=>(role.roleName)) || [];
    const roleName =
      checkUserExistance.employeeRoles.length === 1
        ? checkUserExistance.employeeRoles[0].roleName
        : checkUserExistance.employeeRoles.map((role) => role.roleName) || [];

    const token = jwt.sign(
      {
        userid: checkUserExistance._id,
        useremail: checkUserExistance.employeeEmail,
        userrole: roleName, // Include roleName only
        username: checkUserExistance.employeeName,
      },
      process.env.Jwt_secret_key,
      { expiresIn: "30d" }
    );

    res.status(200).json({ msg: "Login Successfull", token: token });
  } catch (error) {
    console.log("Error Loging in ", error);
    return res
      .status(500)
      .json({ err: "Internal Server Error", error: error.message });
  }
};



module.exports = {loginController};