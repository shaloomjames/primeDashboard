const mongoose = require("mongoose");
const LeaveTypeModel = require("../models/LeaveTypeModel");
const EmployeeModel = require("../models/EmployeeModel");
const LeaveModel = require("../models/LeaveModel");

// @Request   POST
// @Route     http://localhost:5000/api/leave
// @Access    Private
// const createLeaveType = async (req, res) => {
//   try {
//     const { leaveTypeName, allowedLeaves, leaveTypeStatus } = req.body;

//     // Adjusted regex for letters and spaces
//     const nameRegex = /^[A-Za-z\s]+$/;
//     // Regex to match positive integers (1 or greater)
//     const allowedLeavesRegex = /^[1-9]\d*$/;
//     const statusTypeRegex = /^(active|inactive)$/;

//     if (!nameRegex.test(leaveTypeName)) {
//       return res.status(400).json({
//         err: "Invalid Leave Type Name. Only letters and spaces are allowed.",
//       });
//     }

//     // Convert allowedLeaves to string for regex testing
//     if (!allowedLeavesRegex.test(String(allowedLeaves))) {
//       return res.status(400).json({
//         err: "Invalid Allowed Leaves. Only positive numbers are allowed.",
//       });
//     }

//     if (!statusTypeRegex.test(leaveTypeStatus)) {
//       return res.status(400).json({
//         err: "Invalid Leave Type Status. Allowed values: active, inactive.",
//       });
//     }

//     const leaveExistence = await LeaveTypeModel.findOne({ leaveTypeName });
//     if (leaveExistence)
//       return res.status(400).json({ err: "Leave Type Already Exists" });

//     // Assuming LeaveTypeModel is imported
//     const leaveType = await LeaveTypeModel.create({
//       leaveTypeName,
//       allowedLeaves,
//       leaveTypeStatus,
//     });

//     const employees = await EmployeeModel.find();

//     for (const employee of employees) {
//       // Check if the employee's leaveBalances already has the leaveType
//       if (!employee.leaveBalances.has(leaveType._id.toString())) {
//         // Add the new leave type to leaveBalances
//         employee.leaveBalances.set(leaveType._id.toString(), {
//           allowedLeaves: allowedLeaves,
//           currentBalance: allowedLeaves, // Initially set the current balance equal to allowed leaves
//         });

//         // Save the updated employee data
//         await employee.save();
//       }
//     }

//     return res
//       .status(201)
//       .json({ leaveType, err: "Leave type created and employees updated Sucessfully" });
//   } catch (error) {
//     console.error("Error creating leave type:", error);
//     return res
//       .status(500)
//       .json({ err: "Internal server error", error: error.message });
//   }
// };

// const createLeaveType = async (req, res) => {
//   try {
//     const { leaveTypeName, allowedLeaves, leaveTypeStatus } = req.body;

//     // Adjusted regex for letters and spaces
//     const nameRegex = /^[A-Za-z\s]+$/;
//     // Regex to match positive integers (1 or greater)
//     const allowedLeavesRegex = /^[1-9]\d*$/;
//     const statusTypeRegex = /^(active|inactive)$/;

//     if (!nameRegex.test(leaveTypeName)) {
//       return res.status(400).json({
//         err: "Invalid Leave Type Name. Only letters and spaces are allowed.",
//       });
//     }

//     // Convert allowedLeaves to string for regex testing
//     if (!allowedLeavesRegex.test(String(allowedLeaves))) {
//       return res.status(400).json({
//         err: "Invalid Allowed Leaves. Only positive numbers are allowed.",
//       });
//     }

//     if (!statusTypeRegex.test(leaveTypeStatus)) {
//       return res.status(400).json({
//         err: "Invalid Leave Type Status. Allowed values: active, inactive.",
//       });
//     }

//     const leaveExistence = await LeaveTypeModel.findOne({ leaveTypeName });
//     if (leaveExistence)
//       return res.status(400).json({ err: "Leave Type Already Exists" });

//     // Create the new leave type
//     const leaveType = await LeaveTypeModel.create({
//       leaveTypeName,
//       allowedLeaves,
//       leaveTypeStatus,
//     });

//     const employees = await EmployeeModel.find();

//     for (const employee of employees) {
//       // Check if the employee's leaveBalances array already has an entry for this leave type
//       const leaveBalanceExists = employee.leaveBalances.some(lb => 
//         lb.leaveTypeId && lb.leaveTypeId.toString() === leaveType._id.toString()
//       );

//       if (!leaveBalanceExists) {
//         // Add the new leave type to leaveBalances array
//         employee.leaveBalances.push({
//           leaveTypeId: leaveType._id,
//           allowedLeaves: allowedLeaves,
//           currentBalance: allowedLeaves, // Initially set the current balance equal to allowed leaves
//         });

//         // Save the updated employee data
//         await employee.save();
//       }
//     }

//     return res.status(201).json({ 
//       leaveType, 
//       err: "Leave type created and employees updated successfully" 
//     });
//   } catch (error) {
//     console.error("Error creating leave type:", error);
//     return res.status(500).json({ err: "Internal server error", error: error.message });
//   }
// };

const createLeaveType = async (req, res) => {
  try {
    const { leaveTypeName, allowedLeaves, leaveTypeStatus } = req.body;

    // Adjusted regex for letters and spaces
    const nameRegex = /^[A-Za-z\s]+$/;
    // Regex to match positive integers (1 or greater)
    const allowedLeavesRegex = /^[1-9]\d*$/;
    // const statusTypeRegex = /^(active|inactive)$/;

    if (!nameRegex.test(leaveTypeName)) {
      return res.status(400).json({
        err: "Invalid Leave Type Name. Only letters and spaces are allowed.",
      });
    }

    // Convert allowedLeaves to string for regex testing
    if (!allowedLeavesRegex.test(String(allowedLeaves))) {
      return res.status(400).json({
        err: "Invalid Allowed Leaves. Only positive numbers are allowed.",
      });
    }

    // if (!statusTypeRegex.test(leaveTypeStatus)) {
    //   return res.status(400).json({
    //     err: "Invalid Leave Type Status. Allowed values: active, inactive.",
    //   });
    // }

    // Check if leave type already exists
    const leaveExistence = await LeaveTypeModel.findOne({ leaveTypeName });
    if (leaveExistence) {
      return res.status(400).json({ err: "Leave Type Already Exists" });
    }

    // Create the new leave type
    const leaveType = await LeaveTypeModel.create({
      leaveTypeName,
      allowedLeaves,
      leaveTypeStatus,
    });

    // Fetch all employees
    const employees = await EmployeeModel.find();

    // Use Promise.all() to update employee leaveBalances concurrently
    await Promise.all(
      employees.map(async (employee) => {
        // Check if the employee's leaveBalances already has an entry for this leave type
        const leaveBalanceExists = employee.leaveBalances.some((lb) => 
          lb.leaveTypeId && lb.leaveTypeId.toString() === leaveType._id.toString()
        );

        if (!leaveBalanceExists) {
          // Add the new leave type to the employee's leaveBalances array
          employee.leaveBalances.push({
            leaveTypeId: leaveType._id,
            allowedLeaves: allowedLeaves,
            currentBalance: allowedLeaves, // Initially set currentBalance equal to allowedLeaves
          });

          // Save the updated employee record
          await employee.save();
        }
      })
    );

    return res.status(201).json({ 
      leaveType, 
      msg: "Leave type created and employees updated successfully" 
    });
  } catch (error) {
    console.error("Error creating leave type:", error);
    return res.status(500).json({ err: "Internal server error", error: error.message });
  }
};


const getLeaveType = async (req, res) => {
  try {
    // const { startingDate, endingDate } = req.query;

    // let filter = {};

    // if (startingDate && endingDate) {
    //   filter.expanceDate = {
    //     $gte: new Date(startingDate),
    //     $lte: new Date(endingDate),
    //   };
    // } else if (startingDate) {
    //   filter.expanceDate = { $gte: new Date(startingDate) };
    // } else if (endingDate) {
    //   filter.expanceDate = { $lte: new Date(endingDate) };
    // }

    // const expenses = await LeaveTypeModel.find(filter)
    const leaveType = await LeaveTypeModel.find();

    if (!leaveType.length)
      return res.status(404).json({ err: "No data found" });

    return res.status(200).json(leaveType);
  } catch (error) {
    console.log("Error Reading leave Types:", error);
    return res.status(500).json({ err: "Internal Server Error" });
  }
};

const getSingleLeaveType = async (req, res) => {
  try {
    // const { startingDate, endingDate } = req.query;

    // let filter = {};

    // if (startingDate && endingDate) {
    //   filter.expanceDate = {
    //     $gte: new Date(startingDate),
    //     $lte: new Date(endingDate),
    //   };
    // } else if (startingDate) {
    //   filter.expanceDate = { $gte: new Date(startingDate) };
    // } else if (endingDate) {
    //   filter.expanceDate = { $lte: new Date(endingDate) };
    // }

    const _id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(400).json({ err: "Invalid Id Format" });

    const leaveType = await LeaveTypeModel.findById({ _id });

    if (!leaveType)
      return res.status(404).json({ err: "No data found" });

    return res.status(200).json(leaveType);
  } catch (error) {
    console.log("Error Reading leave Types:", error);
    return res.status(500).json({ err: "Internal Server Error" });
  }
};

// const updateLeaveType = async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const { leaveTypeName, allowedLeaves, leaveTypeStatus } = req.body;

//     // Adjusted regex for letters and spaces
//     const nameRegex = /^[A-Za-z\s]+$/;
//     // Regex to match positive integers (1 or greater)
//     const allowedLeavesRegex = /^[1-9]\d*$/;
//     const statusTypeRegex = /^(active|inactive)$/;

//     if (!nameRegex.test(leaveTypeName)) {
//       return res.status(400).json({
//         err: "Invalid Leave Type Name. Only letters and spaces are allowed.",
//       });
//     }

//     // Convert allowedLeaves to string for regex testing
//     if (!allowedLeavesRegex.test(String(allowedLeaves))) {
//       return res.status(400).json({
//         err: "Invalid Allowed Leaves. Only positive numbers are allowed.",
//       });
//     }

//     if (!statusTypeRegex.test(leaveTypeStatus)) {
//       return res.status(400).json({
//         err: "Invalid Leave Type Status. Allowed values: active, inactive.",
//       });
//     }

//     const leaveExistence = await LeaveTypeModel.findOne({ leaveTypeName });
//     if (!leaveExistence)
//       return res.status(400).json({ err: "Leave Type Not Found" });

//     // Check if there is any other leave type with the same leaveTypeName (to avoid duplicates)
//     const leaveTypeWithSameName = await LeaveTypeModel.findOne({
//       leaveTypeName,
//     });
//     if (leaveTypeWithSameName && leaveTypeWithSameName._id.toString() !== _id) {
//       return res
//         .status(400)
//         .json({ err: "Leave Type with the same name already exists" });
//     }

//     const updatedLeaveType = await LeaveTypeModel.findByIdAndUpdate(
//       { _id },
//       { leaveTypeName, allowedLeaves, leaveTypeStatus },
//       { new: true }
//     );

//     // Now we need to update the employee's leave balances
//     const employees = await EmployeeModel.find();

//     for (let employee of employees) {
//       const leaveTypeId = updatedLeaveType._id.toString();

//       // Check if the employee's leaveBalances has this leaveTypeId
//       if (employee.leaveBalances.has(leaveTypeId)) {
//         const employeeLeaveBalance = employee.leaveBalances.get(leaveTypeId);

//         // If currentBalance > 0, we do not update allowedLeaves and currentBalance
//         if (employeeLeaveBalance.currentBalance > 0) {
//           // Do not update the allowedLeaves or currentBalance
//           continue; // Skip this employee since the balance is already set
//         } else {
//           // If currentBalance is not set, update allowedLeaves and currentBalance
//           employeeLeaveBalance.allowedLeaves = allowedLeaves;
//           employeeLeaveBalance.currentBalance = allowedLeaves; // Set currentBalance to allowedLeaves
//         }

//         // Save the updated employee record
//         await employee.save();
//       }
//     }

//     return res.status(200).json({ msg: "Leave Type Updated Successfully" });
//   } catch (error) {
//     console.log("Error Updating Leave Type:", error);
//     return res.status(500).json({ err: "Internal Server Error" });
//   }
// };

const updateLeaveType = async (req, res) => {
  try {
    const _id = req.params.id;
    const { leaveTypeName, allowedLeaves, leaveTypeStatus } = req.body;

    // Adjusted regex for letters and spaces
    const nameRegex = /^[A-Za-z\s]+$/;
    // Regex to match positive integers (1 or greater)
    const allowedLeavesRegex = /^[1-9]\d*$/;
    const statusTypeRegex = /^(active|inactive)$/;

    if (!nameRegex.test(leaveTypeName)) {
      return res.status(400).json({
        err: "Invalid Leave Type Name. Only letters and spaces are allowed.",
      });
    }

    // Convert allowedLeaves to string for regex testing
    if (!allowedLeavesRegex.test(String(allowedLeaves))) {
      return res.status(400).json({
        err: "Invalid Allowed Leaves. Only positive numbers are allowed.",
      });
    }

    if (!statusTypeRegex.test(leaveTypeStatus)) {
      return res.status(400).json({
        err: "Invalid Leave Type Status. Allowed values: active, inactive.",
      });
    }

    // Verify that the leave type exists
    const leaveExistence = await LeaveTypeModel.findOne({ leaveTypeName });
    if (!leaveExistence)
      return res.status(400).json({ err: "Leave Type Not Found" });

    // Check if there's any other leave type with the same name (to avoid duplicates)
    const leaveTypeWithSameName = await LeaveTypeModel.findOne({ leaveTypeName });
    if (leaveTypeWithSameName && leaveTypeWithSameName._id.toString() !== _id) {
      return res
        .status(400)
        .json({ err: "Leave Type with the same name already exists" });
    }

    // Update the leave type document and return the updated record
    const updatedLeaveType = await LeaveTypeModel.findByIdAndUpdate(
      { _id },
      { leaveTypeName, allowedLeaves, leaveTypeStatus },
      { new: true }
    );

    // Now update each employee's leaveBalances concurrently using Promise.all()
    const employees = await EmployeeModel.find();

    const updatePromises = employees.map(async (employee) => {
      const leaveTypeId = updatedLeaveType._id.toString();

      const employeeLeaveBalance = employee.leaveBalances.find(lb => lb.leaveTypeId.toString() === leaveTypeId);
if (employeeLeaveBalance) {
   if (employeeLeaveBalance.currentBalance >= 0 && employeeLeaveBalance.currentBalance <= employeeLeaveBalance.allowedLeaves) {
      employeeLeaveBalance.allowedLeaves = allowedLeaves
      await employee.save();
   } else {
      employeeLeaveBalance.allowedLeaves = allowedLeaves;
      employeeLeaveBalance.currentBalance = allowedLeaves;
      await employee.save();
   }
}


      // // Check if the employee's leaveBalances has this leave type ID
      // if (employee.leaveBalances.has(leaveTypeId)) {
      //   const employeeLeaveBalance = employee.leaveBalances.get(leaveTypeId);

      //   // If currentBalance is greater than 0, do not update allowedLeaves or currentBalance
      //   if (employeeLeaveBalance.currentBalance > 0) {
      //     return;
      //   } else {
      //     // Otherwise, update both allowedLeaves and currentBalance
      //     employeeLeaveBalance.allowedLeaves = allowedLeaves;
      //     employeeLeaveBalance.currentBalance = allowedLeaves;
      //     await employee.save();
      //   }
      // }
    });

    await Promise.all(updatePromises);

    return res.status(200).json({ msg: "Leave Type Updated Successfully" });
  } catch (error) {
    console.log("Error Updating Leave Type:", error);
    return res.status(500).json({ err: "Internal Server Error" });
  }
};

// const deleteLeaveType = async (req, res) => {
//   try {
//     const _id = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(_id))
//       return res.status(400).json({ err: "Invalid Object Id" });

//     // const deletedLeaveType = await findByIdAndDelete({ _id });

//     // return res.status(200).json({ err: "Leave Type Deleted Successfully" });
//      // Check if leave type is being used in any leave record
//      const leaveTypeInUse = await LeaveModel.findOne({ leaveType: _id });
    
//      if (leaveTypeInUse) {
//        // If leave type is in use, we cannot delete it, we must inactivate it
//        const updatedLeaveType = await LeaveTypeModel.findByIdAndUpdate(
//          _id, 
//          { leaveTypeStatus: 'inactive' }, 
//          { new: true }
//        );
 
//        return res.status(200).json({
//          msg: "Leave Type is in use, it has been inactivated successfully.",
//          data: updatedLeaveType,
//        });
//      } else {
//        // If not in use, proceed to delete
//        const deletedLeaveType = await LeaveTypeModel.findByIdAndDelete(_id);
 
//        if (!deletedLeaveType)
//          return res.status(404).json({ err: "Leave Type not found" });
 
//        return res.status(200).json({ msg: "Leave Type Deleted Successfully" });
//      }
 
//   } catch (error) {
//     console.log("Error Deleting Leave Type");
//     return res.status(500).json({ err: "Internal Server Error", error });
//   }
// };

const deleteLeaveType = async (req, res) => {
  try {
    const _id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(400).json({ err: "Invalid Object Id" });

    // Check if the leave type is being used in any leave record
    const leaveTypeInUse = await LeaveModel.findOne({ leaveType: _id });
    
    if (leaveTypeInUse) {
      // If the leave type is in use, we cannot delete it; instead, inactivate it.
      const [updatedLeaveType] = await Promise.all([
        LeaveTypeModel.findByIdAndUpdate(
          _id, 
          { leaveTypeStatus: 'inactive' }, 
          { new: true }
        )
      ]);

      return res.status(200).json({
        msg: "Leave Type is in use, it has been inactivated successfully.",
        data: updatedLeaveType,
      });
    } else {
      // If not in use, proceed to delete it
      const [deletedLeaveType] = await Promise.all([
        LeaveTypeModel.findByIdAndDelete(_id)
      ]);
      
      if (!deletedLeaveType)
        return res.status(404).json({ err: "Leave Type not found" });
      
      return res.status(200).json({ msg: "Leave Type Deleted Successfully" });
    }
  } catch (error) {
    console.log("Error Deleting Leave Type", error);
    return res.status(500).json({ err: "Internal Server Error", error: error.message });
  }
};


module.exports = {
  createLeaveType,
  getLeaveType,
  getSingleLeaveType,
  updateLeaveType,
  deleteLeaveType,
};
