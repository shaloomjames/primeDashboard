const mongoose = require("mongoose");
const roleModel = require("./../models/RoleModel");
const employeeModel = require("../models/EmployeeModel")
const deletedEmployeeModel = require("../models/DeletedEmployees");

// @Request   GET
// @Route     http://localhost:5000/api/role/
// @Access    Private
const getRole = async (req, res) => {
    try {
        const roles = await roleModel.find();

        if (!roles.length) return res.status(404).json({ err: "No Roles data found" });

        return res.status(200).json(roles);
    } catch (error) {
        console.log("Error Reading Roles", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};

// @Request   GET
// @Route     http://localhost:5000/api/role/active/R
// @Access    Private
const getActiveRole = async (req, res) => {
    try {
        const activeRoles = await roleModel.find({ roleStatus: "active" });
        if (!activeRoles.length) return res.status(404).json({ err: "No active roles found" });
        return res.status(200).json(activeRoles);
    } catch (error) {
        console.error("Error fetching active roles:", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};

// @Request   GET
// @Route     http://localhost:5000/api/role/:id
// @Access    Private
const getSingleRole = async (req, res) => {
    try {
        const _id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid ID format" });

        const role = await roleModel.findById(_id);

        if (!role) return res.status(404).json({ err: "Role not found" });

        return res.status(200).json(role);
    } catch (error) {
        console.log("Error Reading Role", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};

// @Request   POST
// @Route     http://localhost:5000/api/role/
// @Access    Private
const createRole = async (req, res) => {
    try {
        const { roleName } = req.body;

        const roleNameRegex = /^[A-Za-z0-9\s]+$/;
        if (!roleName || !roleNameRegex.test(roleName)) {
            return res.status(400).json({ err: "Invalid name. Only letters, numbers, and spaces are allowed." });
        }

        const existingRole = await roleModel.findOne({ roleName });
        if (existingRole) return res.status(400).json({ err: "Role already exists" });

        const newRole = await roleModel.create({ roleName });

        return res.status(200).json({ msg: "Role created successfully", newRole });
    } catch (error) {
        console.log("Error creating Role", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};

// @Request   PUT
// @Route     http://localhost:5000/api/role/:id
// @Access    Private
const updateRole = async (req, res) => {
    try {
        const _id = req.params.id;
        const { roleName, roleStatus } = req.body;

        const roleNameRegex = /^[A-Za-z0-9\s]+$/;
        const roleStatusRegex = /^(active|inactive)$/; // Regex to validate roleStatus

        // Validate roleName
        if (!roleName || !roleNameRegex.test(roleName)) {
            return res.status(400).json({ err: "Invalid name. Only letters, numbers, and spaces are allowed." });
        }

        // Validate roleStatus
        if (!roleStatus || !roleStatusRegex.test(roleStatus)) {
            return res.status(400).json({ err: "Invalid role status. It should be either 'active' or 'inactive'." });
        }

        const role = await roleModel.findById(_id);
        if (!role) return res.status(404).json({ err: "Role not found" });

        const updatedRole = await roleModel.findByIdAndUpdate(_id, { roleName, roleStatus }, { new: true });

        return res.status(200).json({ msg: "Role updated successfully", updatedRole });
    } catch (error) {
        console.log("Error updating Role", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};
// Role Assinged to User
// @Request   DELETE
// @Route     http://localhost:5000/api/role/:id
// @Access    Private
// const deleteRole = async (req, res) => {
//     try {
//            const { id } = req.params; // Capture both roleid from URL
//         if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ err: "Invalid ID format" });

//        // Step 1: Delete employees assigned to this role
//        const deletedEmployees = await employeeModel.deleteMany({ employeeRole: id });

//        // If employees with this role exist, they will be deleted
//        if (deletedEmployees.deletedCount > 0) {
//          console.log(`${deletedEmployees.deletedCount} employee(s) with role ID ${id} were deleted.`);
//        } else {
//          console.log("No employees found with this role.");
//        }

//         const deletedRole = await roleModel.findByIdAndDelete(id);
//         if (!deletedRole) return res.status(404).json({ err: "Role not found" });

//         return res.status(200).json({ msg: "Role and associated employees deleted successfully", deletedRole });
//     } catch (error) {
//         console.log("Error deleting Role", error);
//         return res.status(500).json({ err: "Internal Server Error", error: error.message });
//     }
// };
// const deleteRole = async (req, res) => {
//     try {
//         const { id } = req.params; // Capture role ID from URL
//         if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ err: "Invalid ID format" });

//         // Step 1: Check if the role exists
//         const roleToDelete = await roleModel.findById(id);
//         if (!roleToDelete) return res.status(404).json({ err: "Role not found" });

//         // Step 2: Find all employees associated with the role
//         const employeesWithRole = await employeeModel.find({ employeeRoles: id });
//         if (employeesWithRole.length > 0) {
//             // Step 3: Perform the update for each employee
//             const employeeUpdates = employeesWithRole.map((employee) => {
//                 if (employee.employeeRoles.length > 1) {
//                     // Employee has more than one role: Remove only the deleted role
//                     return employeeModel.updateOne(
//                         { _id: employee._id },
//                         { $pull: { employeeRoles: id } }
//                     );
//                 } else {
//                     // Employee has only one role: Delete the employee entirely


//                     // Move the employee to the deletedEmployeeModel
//                     await deletedEmployeeModel.create({
//                         employeeId: employee.employeeId,
//                         employeeName: employee.employeeName,
//                         employeeEmail: employee.employeeEmail,
//                         employeeSalary: employee.employeeSalary,
//                         employeePassword: employee.employeePassword,
//                         employeeRoles: employee.employeeRoles,
//                     });

//                     return employeeModel.deleteOne({ _id: employee._id });
//                 }
//             });

//             // Wait for all employee updates to finish
//             await Promise.all(employeeUpdates);
//         } else {
//             console.log("No employees found with this role.");
//         }

//         // Step 4: Delete the role
//         const deletedRole = await roleModel.findByIdAndDelete(id);
//         if (!deletedRole) return res.status(404).json({ err: "Role not found" });

//         return res.status(200).json({ msg: "Role and associated employees deleted successfully", deletedRole });
//     } catch (error) {
//         console.log("Error deleting Role", error);
//         return res.status(500).json({ err: "Internal Server Error", error: error.message });
//     }
// };

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params; // Capture role ID from URL
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ err: "Invalid ID format" });

        // Step 1: Check if the role exists
        const roleToDelete = await roleModel.findById(id);
        if (!roleToDelete) return res.status(404).json({ err: "Role not found" });

        // Step 2: Find all employees associated with the role
        const employeesWithRole = await employeeModel.find({ employeeRoles: id });
        if (employeesWithRole.length > 0) {
            // Step 3: Perform the update for each employee
            const employeeUpdates = [];
            
            // Looping through each employee and making sure we handle async correctly
            for (const employee of employeesWithRole) {
                if (employee.employeeRoles.length > 1) {
                    // Employee has more than one role: Remove only the deleted role
                    employeeUpdates.push(
                        employeeModel.updateOne(
                            { _id: employee._id },
                            { $pull: { employeeRoles: id } }
                        )
                    );
                } else {
                    // Employee has only one role: Delete the employee entirely
                    // Move the employee to the deletedEmployeeModel
                    const deletedEmployeeData = {
                        employeeId: employee.employeeId,
                        employeeName: employee.employeeName,
                        employeeEmail: employee.employeeEmail,
                        employeeSalary: employee.employeeSalary,
                        employeePassword: employee.employeePassword,
                        employeeRoles: employee.employeeRoles,
                    };

                    // Push the creation of the deleted employee to the update array
                    employeeUpdates.push(deletedEmployeeModel.create(deletedEmployeeData));

                    // Then push the delete of the employee itself
                    employeeUpdates.push(employeeModel.deleteOne({ _id: employee._id }));
                }
            }

            // Wait for all employee updates to finish
            await Promise.all(employeeUpdates);
        } else {
            console.log("No employees found with this role.");
        }

        // Step 4: Delete the role
        const deletedRole = await roleModel.findByIdAndDelete(id);
        if (!deletedRole) return res.status(404).json({ err: "Role not found" });

        return res.status(200).json({ msg: "Role and associated employees deleted successfully", deletedRole });
    } catch (error) {
        console.log("Error deleting Role", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};



module.exports = { createRole, getRole, getActiveRole, getSingleRole, updateRole, deleteRole };