const mongoose = require("mongoose");
const employeeModel = require("../models/EmployeeModel");
const RoleModel = require("../models/RoleModel");
const bcrypt = require("bcrypt");
const { SendMail } = require("../helpers/SendMail");
const crypto = require("crypto");
const deletedEmployeeModel = require("../models/DeletedEmployees");

// @Request   GET
// @Route     http://localhost:5000/api/employee/
// @Access    Private
const getEmployee = async (req, res) => {
    try {
        const employees = await employeeModel.find().populate("employeeRoles");
        if (!employees.length) return res.status(404).json({ err: "No data found" });
        return res.status(200).json(employees);
    } catch (error) {
        console.log("Error Reading Employees:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// @Request   GET
// @Route     http://localhost:5000/api/employee/
// @Access    Private
const getDeletedEmployee = async (req, res) => {
    try {
        const employees = await deletedEmployeeModel.find().populate("employeeRoles");
        if (!employees.length) return res.status(404).json({ err: "No data found" });
        return res.status(200).json(employees);
    } catch (error) {
        console.log("Error Reading Deleted Employees:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// @Request   GET
// @Route     http://localhost:5000/api/employee/:id
// @Access    Private
const getSingleEmployee = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid ID format" });

        const employee = await employeeModel.findById(_id).populate("employeeRoles");
        if (!employee) return res.status(404).json({ err: "Employee not found" });

        return res.status(200).json(employee);
    } catch (error) {
        console.log("Error Reading Employee:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// @Request   POST
// @Route     http://localhost:5000/api/employee/
// @Access    Private
const createEmployee = async (req, res) => {
    try {
        const { employeeName, employeeEmail, employeePassword, employeeSalary, employeeRoles } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const nameRegex = /^[A-Za-z\s]+$/;
        const nameRegex = /^[A-Za-z\s]{3,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const numberRegex = /^\d+$/;

        if (!employeeName || !nameRegex.test(employeeName))
            return res.status(400).json({ err: "Invalid Employee Name.Employee name must be at least 3 characters long and contain only letters and spaces." });
        if (!employeeEmail || !emailRegex.test(employeeEmail))
            return res.status(400).json({ err: "Invalid Employee Email." });
        if (!employeePassword || !passwordRegex.test(employeePassword))
            return res.status(400).json({ err: "Invalid Employee Password." });
        if (!employeeSalary || !numberRegex.test(employeeSalary))
            return res.status(400).json({ err: "Invalid Employee Salary." });

        if (!employeeRoles || !Array.isArray(employeeRoles) || !employeeRoles.length)
            return res.status(400).json({ err: "At least one role is required." });

        // // Validate if each role exists in the Role collection
        // for (const role of employeeRoles) {
        //     if (!mongoose.Types.ObjectId.isValid(role)) {
        //         return res.status(400).json({ err: `Invalid Role ID: ${role}` });
        //     }
        //     const roleExists = await RoleModel.findById(role);
        //     if (!roleExists) {
        //         return res.status(400).json({ err: `Role with ID ${role} does not exist.` });
        //     }
        // }

        // const existingEmployee = await employeeModel.findOne({ employeeEmail });
        // if (existingEmployee) {
        //     return res.status(400).json({ err: "Employee with this email already exists." });
        // }

        // // find the email in deleted users collection
        // const existingEmployeeInDelete = await deletedEmployeeModel.findOne({ employeeEmail });
        // if (existingEmployeeInDelete) {
        //     return res.status(400).json({ err: "Employee with this email already exists In our DB." });
        // }

        // Check if email already exists in the deletedEmployeeModel
        const existingEmployeeInDelete = await deletedEmployeeModel.findOne({ employeeEmail });
        if (existingEmployeeInDelete) {
            return res.status(400).json({ err: "Employee with this email already exists in our deleted employees database." });
        }

        // Validate if each role exists in the Role collection
        const roles = await RoleModel.find({ _id: { $in: employeeRoles } });
        if (roles.length !== employeeRoles.length) {
            return res.status(400).json({ err: "One or more roles do not exist." });
        }

        // Check if the email already exists in the active employees collection
        const existingEmployee = await employeeModel.findOne({ employeeEmail });
        if (existingEmployee) {
            return res.status(400).json({ err: "Employee with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(employeePassword, salt);

        const newEmployee = await employeeModel.create({
            employeeName,
            employeeEmail,
            employeePassword: hashedPassword,
            employeeSalary,
            employeeRoles,
        });

        // Extract role names for the email
        const roleNames = roles.map(role => role.roleName).join(", ");


        try {
            const emailHTML = `
<table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
        <td style="padding: 0;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                    <td style="background-color: #003366; padding: 20px 0; text-align: center;">
                        <!-- Company Logo -->
                        <img src="https://primevertexsoftwares.com/wp-content/uploads/2020/06/Primevertex-Logo-01.png" alt="Company Logo" style="height: auto; max-width: 150px;"> 
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <h1 style="color: #003366; font-size: 28px; margin-bottom: 20px; border-bottom: 2px solid #003366; padding-bottom: 10px;">Welcome to Our Family!</h1>
                        <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">Dear ${employeeName},</p>
                        <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
                            It is with great pleasure that we welcome you to PrimeVertex! We are excited to have you join us and are confident that your skills and expertise will play a significant role in our ongoing success. Your contributions will strengthen our team and help us achieve our shared goals.
                        </p>
                        <h2 style="color: #003366; font-size: 20px; margin-top: 30px; margin-bottom: 15px;">Your Journey Starts Here</h2>
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Department:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${roleNames}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Salary:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"> ${employeeSalary}</td>
                            </tr>
                        </table>
                        <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
                            Our HR Team is here to assist you during your onboarding process. Should you have any questions or require support, feel free to reach out to us at 
                            <a href="mailto:theprimevertexsoftwares@gmail.com" style="color: #003366; text-decoration: none;">theprimevertexsoftwares@gmail.com</a>.
                        </p>
                        <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
                            We eagerly look forward to witnessing your impact as you embark on this exciting new chapter with us.
                        </p>
                        <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
                            Warm regards,<br>
                            <!-- [Your Name]<br> -->
                            <span style="color: #666666; font-style: italic;">HR Department</span>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #f0f4f8; padding: 30px; text-align: center;">
                        <!-- <p style="color: #666666; font-size: 14px; margin-bottom: 10px;">Stay Connected with Us:</p> -->
                        <!-- <a href="#" style="display: inline-block; margin: 0 10px;"><img src="https://via.placeholder.com/40x40?text=LI" alt="LinkedIn" style="width: 40px; height: 40px;"/></a>
                        <a href="#" style="display: inline-block; margin: 0 10px;"><img src="https://via.placeholder.com/40x40?text=TW" alt="Twitter" style="width: 40px; height: 40px;"/></a>
                        <a href="#" style="display: inline-block; margin: 0 10px;"><img src="https://via.placeholder.com/40x40?text=IG" alt="Instagram" style="width: 40px; height: 40px;"/></a> -->
                        <p style="color: #666666; font-size: 12px; margin-top: 20px;">© 2024 PrimeVertex. All rights reserved.</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
            `;

            await SendMail(
                employeeEmail,
                "Welcome to the PrimeVertex!",
                `Hi ${employeeName}, welcome to our PrimeVertex Family!`,
                emailHTML
            );
        } catch (err) {
            console.error("Failed to send welcome email:", err);
        }

        return res.status(201).json({
            msg: "Employee created successfully",
            employee: newEmployee,
        });
    } catch (err) {
        console.error("Error Creating Employee:", err);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const _id = req.params.id;
        const { employeeName, employeeEmail, employeeSalary, employeeRoles } = req.body;

        // Regex for validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[A-Za-z\s]+$/;
        const numberRegex = /^\d+$/;

        // Validate the provided fields
        if (employeeName && !nameRegex.test(employeeName))
            return res.status(400).json({ err: "Invalid Employee Name. Only letters and spaces are allowed." });
        if (employeeEmail && !emailRegex.test(employeeEmail))
            return res.status(400).json({ err: "Invalid Email Address." });
        if (employeeSalary && !numberRegex.test(employeeSalary))
            return res.status(400).json({ err: "Invalid Salary. Only numbers are allowed." });

        // If roles are provided, validate them
        if (employeeRoles) {
            if (!Array.isArray(employeeRoles) || !employeeRoles.length)
                return res.status(400).json({ err: "At least one role is required." });

            for (const role of employeeRoles) {
                if (!mongoose.Types.ObjectId.isValid(role)) {
                    return res.status(400).json({ err: `Invalid Role ID: ${role}` });
                }
                const roleExists = await RoleModel.findById(role);
                if (!roleExists) {
                    return res.status(400).json({ err: `Role with ID ${role} does not exist.` });
                }
            }
        }

        // Find the employee
        const existingEmployee = await employeeModel.findById(_id);
        if (!existingEmployee) return res.status(404).json({ err: "Employee not found" });

        // Prepare updated data dynamically
        const updatedData = {};
        if (employeeName) updatedData.employeeName = employeeName;
        if (employeeEmail) updatedData.employeeEmail = employeeEmail;
        if (employeeSalary) updatedData.employeeSalary = employeeSalary;
        if (employeeRoles) updatedData.employeeRoles = employeeRoles;

        // Update employee in the database
        const updatedEmployee = await employeeModel.findByIdAndUpdate(_id, updatedData, {
            new: true, // Return the updated document
            omitUndefined: true, // Ignore undefined values
        });

        return res.status(200).json({
            msg: "Employee updated successfully",
            employee: updatedEmployee,
        });
    } catch (error) {
        console.error("Error Updating Employee:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// @Request   DELETE
// @Route     http://localhost:5000/api/employee/:id
// @Access    Private
const deleteEmployee = async (req, res) => {
    try {
        const _id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ err: "Invalid ID format" });
        }

        // Find the employee to be deleted
        const employee = await employeeModel.findById(_id);
        if (!employee) {
            return res.status(404).json({ err: "Employee not found" });
        }

        // Move the employee to the deletedEmployeeModel
        await deletedEmployeeModel.create({
            employeeId: employee.employeeId,
            employeeName: employee.employeeName,
            employeeEmail: employee.employeeEmail,
            employeeSalary: employee.employeeSalary,
            employeePassword: employee.employeePassword,
            employeeRoles: employee.employeeRoles,
        });

        // Delete the employee from the employeeModel
        await employeeModel.findByIdAndDelete(_id);

        return res.status(200).json({ msg: "Employee deleted and archived successfully" });
    } catch (error) {
        console.log("Error Deleting Employee:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// @Request   DELETE
// @Route      http://localhost:5000/api/employee
// @Access    Private
const deleteEmployeePermanently = async (req, res) => {
    try {
        const _id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid Object Id" });

        const deletedEmployee = await deletedEmployeeModel.findByIdAndDelete({ _id });

        if (!deletedEmployee) return res.status(404).json({ err: "Employee Not Found" });

        return res.status(201).json({ msg: "Employee Permanently Deleted ", deletedEmployee })
    } catch (error) {
        console.log("Error Deleting Employee ", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message })
    }
}

// @Request   POST
// @Route     http://localhost:5000/api/employee
// @Access    Private
const restoreEmployee = async (req, res) => {
    try {
        const _id = req.params.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ err: "Invalid Object Id" });
        }

        // Find the deleted employee
        const deletedEmployee = await deletedEmployeeModel.findById(_id);
        if (!deletedEmployee) {
            return res.status(404).json({ err: "Employee Not Found in Deleted Records" });
        }

        // Check if an employee with the same employeeId already exists in the active employees
        const existingEmployee = await employeeModel.findOne({ employeeId: deletedEmployee.employeeId });
        if (existingEmployee) {
            return res.status(409).json({ err: "Employee already exists in active records" });
        }

        // Recreate the employee document in the active employees collection
        const restoredEmployee = new employeeModel({
            employeeId: deletedEmployee.employeeId,
            employeeName: deletedEmployee.employeeName,
            employeeEmail: deletedEmployee.employeeEmail,
            employeeSalary: deletedEmployee.employeeSalary,
            employeeRoles: deletedEmployee.employeeRoles,
            employeePassword: deletedEmployee.employeePassword,
        });

        await restoredEmployee.save();

        // Delete the employee from the deleted employees collection
        await deletedEmployeeModel.findByIdAndDelete(_id);

        return res.status(200).json({ msg: "Employee Restored Successfully", restoredEmployee });
    } catch (error) {
        console.error("Error Restoring Employee:", error.message);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};


// @Request   POST
// @Route     http://localhost:5000/api/employee/login
// @Access    Private
const forgotPasswordController = async (req, res) => {
    const { employeeEmail } = req.body;
    try {
        const user = await employeeModel.findOne({employeeEmail});
        if (!user) return res.status(400).json({ err: "Email not found" })

        // Generate a unique reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // set the token and expiration
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;  // 1 hour from now
        await user.save();


        // Generate reset URL
        const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

        try {
            const emailHTML = `
<table role="presentation" style="width: 100%; border-collapse: collapse;">
<tr>
<td style="padding: 0;">
   <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
       <tr>
           <td style="background-color: #003366; padding: 20px 0; text-align: center;">
               <!-- Company Logo -->
               <img src="https://primevertexsoftwares.com/wp-content/uploads/2020/06/Primevertex-Logo-01.png" alt="Company Logo" style="height: auto; max-width: 150px;"> 
           </td>
       </tr>
       <tr>
           <td style="padding: 40px 30px;">
               <h1 style="color: #003366; font-size: 28px; margin-bottom: 20px; border-bottom: 2px solid #003366; padding-bottom: 10px;">Click the link below to reset your password.</h1>
               <p><a href="${resetUrl}">${resetUrl}</a></p>
       <tr>
       
           <td style="background-color: #f0f4f8; padding: 30px; text-align: center;">
             <p style="color: #666666; font-size: 12px; margin-top: 20px;">© 2024 PrimeVertex. All rights reserved.</p>
           </td>
       </tr>
   </table>
</td>
</tr>
</table>
   `;

            await SendMail(
                user.employeeEmail,
                "Password Reset Request",
                "Click the link below to reset your password.",
                emailHTML
            );
        } catch (err) {
            console.error("Failed to send welcome email:", err);
        }

        res.status(201).json({ msg: "Password reset email sent successfully. Link will expire in one hour" })

    } catch (error) {
        console.error("Error processing the request of Password reset email: ", error.message);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
}


// @Request   POST
// @Route     http://localhost:5000/api/employee/login
// @Access    Private
const resetPasswordController = async (req, res) => {
    
 const {resetToken , newPassword } = req.body;
try {
    const user = await employeeModel.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() }, // Ensure token is valid
    });

    if (!user) {
        return res.status(400).json({ error: "Invalid or expired token." });
    }

    // Hash the new password
    user.employeePassword = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(201).json({ msg: "Password reset successful." });
    } catch (error) {
        console.error("Error resetting the password: ", error.message);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
}



module.exports = { createEmployee, getEmployee, getSingleEmployee, updateEmployee, deleteEmployee, getDeletedEmployee, deleteEmployeePermanently, restoreEmployee, forgotPasswordController, resetPasswordController };