// Initialize express router
const LeaveModel = require("../models/LeaveModel");
const EmployeeModel = require("../models/EmployeeModel");
const AttendanceModel = require("../models/AttendanceModel");
const mongoose = require("mongoose");
const moment = require("moment");
const LeaveTypeModel = require("../models/LeaveTypeModel");
const HolidayModel = require("../models/HolidayModel");

// Get Leave History
const getLeaveHistory = async (req, res) => {
  try {
    const { employee } = req.query;
    const filter = employee ? { employee } : {};

    const leaves = await LeaveModel.find(filter)
      .populate("employee")
      .populate("approvedBy")
      .populate("leaveType")
      .populate("holidays")
      .populate("affectedAttendance")
      .sort("-createdAt");

    if (!leaves.length)
      return res.status(404).json({ err: "No Leave Requests Found" });

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error Fetching Leave history:", error);
    res
      .status(500)
      .json({ err: "Internal Server Error", error: error.message });
  }
};

// const getSingleLeaveByEmployee = async (req, res) => {
//   try {
//     const _id = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(_id))
//       return res.status(400).json({ err: "Invalid Id Format" });

//     const leave = await LeaveModel.findOne({employee:_id})
//       .populate("employee")
//       .populate("leaveType")
//       .populate("approvedBy")
//       .sort("-createdAt");
//     if (!leave) return res.status(404).json({ err: "No Leave Request Found" });

//     return res.status(200).json(leave);
//   } catch (error) {
//     console.log("Error Fetching Leave history", error);
//     return res
//       .status(500)
//       .json({ err: "Internal Server Error", error: error.message });
//   }
// };

// Get all leave records for an employee by their ID
const getLeaveHistoryByEmployee = async (req, res) => {
  // Get the employee ID from the URL
  const employeeId = req.params.id;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ err: "Invalid Employee ID" });
  }

  try {
    // Find all leave records for this employee
    const leaves = await LeaveModel.find({ employee: employeeId })
      .populate("employee") // Get employee details
      .populate("leaveType") // Get leave type details
      .populate("approvedBy") // Get approver details
      .populate("holidays")
      .sort({ createdAt: -1 }); // Sort by newest first

    // If no leaves are found, send a message
    if (!leaves.length) {
      return res.status(404).json({ err: "No leave records found for this employee" });
    }

    // Send the leave records back
    return res.status(200).json(leaves);
  } catch (error) {
    console.log("Error fetching leave history:", error);
    return res.status(500).json({ err: "Something went wrong on the server" });
  }
};

// const createLeaveRequest = async (req, res) => {
//   try {
//     // Destructure request body to extract required fields
//     const { employee, leaveType, startDate, endDate, reason } = req.body;

//     // Regex to validate reason (letters and spaces only)
//     const nameRegex = /^[A-Za-z\s]+$/;

//     // Validate employee ID format using Mongoose's ObjectId validation
//     if (!mongoose.Types.ObjectId.isValid(employee)) {
//       return res.status(400).json({ err: "Invalid Employee ID format" });
//     }

//     // Validate leave type - Ensure it's provided and is a valid ObjectId
//     if (!leaveType || !mongoose.Types.ObjectId.isValid(leaveType)) {
//       return res.status(400).json({ err: "Invalid or missing Leave Type ID" });
//     }

//     // Validate leave type by checking if it exists in the database
//     const leaveTypeExist = await LeaveTypeModel.findById(leaveType);
//     if (!leaveTypeExist) {
//       return res.status(400).json({ err: "Invalid Leave Type" });
//     }

//     // Validate reason field: must exist and match the regex
//     if (!reason || !nameRegex.test(reason)) {
//       return res
//         .status(400)
//         .json({ err: "Reason must contain only letters and spaces" });
//     }

//     // Parse start and end dates into Date objects
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     start.setHours(0, 0, 0, 0);
//     end.setHours(0, 0, 0, 0);

//     // Validate date formats and ensure start date is before or equal to end date
//     if (!start.getTime() || !end.getTime()) {
//       return res.status(400).json({ err: "Invalid Date format" });
//     }

//     //     // Ensure leave is created only for today or future dates
//     // const today = new Date();
//     // today.setHours(0, 0, 0, 0); // Remove time from today

//     // if ( { $gte: startDate, $lte: endDate } < today) {
//     //   return res
//     //     .status(400)
//     //     .json({ err: "Leave date must be today or a future date" });
//     // }
//     // Ensure leave is created only for today or future dates
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize today's date

//     // Loop through each day from start to end and check if any date is in the past
//     let current = new Date(start);
//     while (current <= end) {
//       if (current.getTime() < today.getTime()) {
//         return res
//           .status(400)
//           .json({ err: "Leave date must be today or a future date" });
//       }
//       // Move to the next day
//       current.setDate(current.getDate() + 1);
//     }

//     if (start > end) {
//       return res
//         .status(400)
//         .json({ err: "Start date must be before or equal to the end date" });
//     }

//     // Check if the employee exists in the database
//     const employeeExists = await EmployeeModel.findById(employee);
//     if (!employeeExists) {
//       return res.status(404).json({ err: "Employee not found" });
//     }

//     // Calculate total number of days between start and end dates (inclusive)
//     const totalDays = Math.ceil((end - start) / 86400000) + 1;

//     // Initialize variables to track weekends, holidays, and overlapping days
//     let weekendsCount = 0; // Count of weekends (Sundays and alternate Saturdays)
//     let weekends = []; // Store weekend days
//     let holidays = []; // Store non-weekend holidays
//     let overlappingLeaves = []; // Store overlapping approved leaves
//     let skippedDates = []; // To track skipped dates (due to overlap)

//     // // Track off Saturdays (alternating weekends)
//     // const offSaturdays = [];
//     // let saturdayFlag = true;

//     // Iterate through each day in the date range to count weekends (sundays and alternate saturdays)
//     const currentDate = new Date(start);
//     while (currentDate <= end) {
//       const day = currentDate.getDay(); // Get day of the week (0 = Sunday, 6 = Saturday)
//       const dateStr = currentDate.toISOString().split("T")[0]; // Convert date to ISO string

//       // Check if the day is Sunday (always a weekend)
//       if (day === 0) {
//         weekendsCount++;
//         weekends.push(dateStr);
//       }
//       // Check if the day is Saturday (alternate weekends)
//       else if (day === 6) {
//         // if (saturdayFlag) {
//         //   weekendsCount++;
//         //   weekends.push(dateStr); // Add to weekends array
//         //   offSaturdays.push(dateStr); // Track off Saturdays
//         // }
//         // saturdayFlag = !saturdayFlag; // Toggle the flag for alternating Saturdays
//         const saturdayNumber = Math.ceil(currentDate.getDate() / 7); // Get the Saturday number of the month (1st, 2nd, etc.)

//         // If it's an even Saturday, treat it as a weekend
//         if (saturdayNumber % 2 === 0) {
//           weekendsCount++;
//           weekends.push(dateStr); // Add to weekends array
//         }
//       }

//       // Move to the next day
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     // Retrieve holidays within the leave period, excluding weekends
//     const holidayRecords = await HolidayModel.find({
//       date: { $gte: start, $lte: end },
//     });

//     // Extract holidays falling on weekends
//     holidays = holidayRecords
//       .filter((holiday) => {
//         const hDate = new Date(holiday.date);
//         const hDay = hDate.getDay();
//         const hDateStr = hDate.toISOString().split("T")[0];

//         // Exclude holidays on weekends (Sundays or off Saturdays)
//         return hDay !== 0 && !(hDay === 6 && offSaturdays.includes(hDateStr));
//       })
//       .map((holiday) => holiday._id); // Only store the holiday ID

//     // Calculate base working days by subtracting weekends and holidays
//     let workingDays = totalDays - weekendsCount - holidays.length;

//     // Check for overlapping approved leaves for the same employee
//     const overlappingLeavesRecords = await LeaveModel.find({
//       employee,
//       status: "Approved",
//       $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
//     });

//     // Iterate through the leave period and check each date for overlap
//     const checkDate = new Date(start); // Start checking from the leave start date
//     while (checkDate <= end) {
//       const dateStr = checkDate.toISOString().split("T")[0]; // Convert date to ISO string

//       // Check if the day is a weekend (Sunday or off Saturday)
//       const isWeekend =
//         checkDate.getDay() === 0 ||
//         (checkDate.getDay() === 6 && offSaturdays.includes(dateStr));

//       // Check if the day is a holiday
//       const isHoliday = holidays.some(
//         (holidayId) => holidayId.toString() === dateStr
//       );

//       // Skip weekends and holidays
//       if (isWeekend || isHoliday) {
//         checkDate.setDate(checkDate.getDate() + 1);
//         continue;
//       }

//       // If the day is a working day, check if the day overlaps with any approved leave
//       const isOverlapping = overlappingLeavesRecords.some((leave) => {
//         const leaveStart = new Date(leave.startDate);
//         const leaveEnd = new Date(leave.endDate);
//         return checkDate >= leaveStart && checkDate <= leaveEnd;
//       });

//       // If the day overlaps with an approved leave, skip this day
//       if (isOverlapping) {
//         skippedDates.push(dateStr);
//         workingDays--; // Decrease working days since this day is already taken
//       }

//       // Move to the next day
//       checkDate.setDate(checkDate.getDate() + 1);
//     }

//     // Final leave days calculation after deductions
//     const calculatedDays = workingDays;

//     // If no eligible leave days remain, return an error
//     if (calculatedDays <= 0) {
//       return res.status(400).json({
//         err: "No eligible leave days remaining after accounting for weekends, holidays, and overlapping leaves.",
//       });
//     }

//     // Check the employee's leave balance for the requested leave type
//     const employeeData = await EmployeeModel.findById(employee).populate(
//       "leaveBalances"
//     );
//     const balanceEntry = employeeData.leaveBalances.find((b) =>
//       b.leaveTypeId.equals(leaveType)
//     );

//     // If insufficient leave balance, return an error
//     if (!balanceEntry || balanceEntry.currentBalance < calculatedDays) {
//       return res.status(400).json({
//         err: `Insufficient leave balance for ${leaveTypeExist.leaveTypeName}. You have ${balanceEntry.currentBalance} days Left, but you requested ${calculatedDays} days.`,
//       });
//     }

//     // Create the leave request in the database
//     const leave = await LeaveModel.create({
//       employee,
//       leaveType,
//       startDate: start,
//       endDate: end,
//       reason,
//       weekends, // Store weekends (Sundays & off Saturdays)
//       holidays, // Store holidays
//       skippedDates, // Store skipped dates due to overlap
//       calculatedDays, // Final calculated leave days
//       status: "Pending", // Default status for new leave requests
//     });

//     // Return success response with the created leave request
//     res.status(201).json({
//       msg: "Leave request created successfully",
//       data: leave,
//     });
//   } catch (error) {
//     // Handle any unexpected errors
//     console.error("Leave creation error:", error);
//     res.status(500).json({
//       err: "Internal Server Error",
//       message: error.message,
//     });
//   }
// };

const createLeaveRequest = async (req, res) => {
  try {
    // Destructure request body to extract required fields
    const { employee, leaveType, startDate, endDate, reason } = req.body;

    // Regex to validate reason (letters and spaces only)
    const nameRegex = /^[A-Za-z\s]+$/;

    // Validate employee ID format using Mongoose's ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(employee)) {
      return res.status(400).json({ err: "Invalid Employee ID format" });
    }

    // Validate leave type - Ensure it's provided and is a valid ObjectId
    if (!leaveType || !mongoose.Types.ObjectId.isValid(leaveType)) {
      return res.status(400).json({ err: "Invalid or missing Leave Type ID" });
    }

    // Validate leave type by checking if it exists in the database
    const leaveTypeExist = await LeaveTypeModel.findById(leaveType);
    if (!leaveTypeExist) {
      return res.status(400).json({ err: "Invalid Leave Type" });
    }

    // Validate reason field: must exist and match the regex
    if (!reason || !nameRegex.test(reason)) {
      return res
        .status(400)
        .json({ err: "Reason must contain only letters and spaces" });
    }

    // Parse start and end dates into Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Validate date formats and ensure start date is before or equal to end date
    if (!start.getTime() || !end.getTime()) {
      return res.status(400).json({ err: "Invalid Date format" });
    }

    // Ensure leave is created only for today or future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    // Loop through each day from start to end and check if any date is in the past
    let current = new Date(start);
    while (current <= end) {
      if (current.getTime() < today.getTime()) {
        return res
          .status(400)
          .json({ err: "Leave date must be today or a future date" });
      }
      // Move to the next day
      current.setDate(current.getDate() + 1);
    }

    if (start > end) {
      return res
        .status(400)
        .json({ err: "Start date must be before or equal to the end date" });
    }

    // Check if the employee exists in the database
    const employeeExists = await EmployeeModel.findById(employee);
    if (!employeeExists) {
      return res.status(404).json({ err: "Employee not found" });
    }

    // Calculate total number of days between start and end dates (inclusive)
    const totalDays = Math.ceil((end - start) / 86400000) + 1;

    // Initialize variables to track weekends, holidays, and overlapping days
    let weekendsCount = 0; // Count of weekends (Sundays and even Saturdays)
    let weekends = []; // Store weekend days
    let holidays = []; // Store non-weekend holidays
    let overlappingLeaves = []; // Store overlapping approved leaves
    let skippedDates = []; // To track skipped dates (due to overlap)

    // Iterate through each day in the date range to count weekends (Sundays and even Saturdays)
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const day = currentDate.getDay(); // Get day of the week (0 = Sunday, 6 = Saturday)
      const dateStr = currentDate.toISOString().split("T")[0]; // Convert date to ISO string

      // Check if the day is Sunday (always a weekend)
      if (day === 0) {
        weekendsCount++;
        weekends.push(dateStr);
      }
      // Check if the day is Saturday (even Saturdays as weekends)
      else if (day === 6) {
        const saturdayNumber = Math.ceil(currentDate.getDate() / 7); // Get the Saturday number of the month (1st, 2nd, etc.)

        // If it's an even Saturday, treat it as a weekend
        if (saturdayNumber % 2 === 0) {
          weekendsCount++;
          weekends.push(dateStr); // Add to weekends array
        }
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Retrieve holidays within the leave period, excluding weekends
    const holidayRecords = await HolidayModel.find({
      date: { $gte: start, $lte: end },
    });

    // Extract holidays falling on weekends
    holidays = holidayRecords
      .filter((holiday) => {
        const hDate = new Date(holiday.date);
        const hDay = hDate.getDay();
        const hDateStr = hDate.toISOString().split("T")[0];

        // Exclude holidays on weekends (Sundays or even Saturdays)
        return hDay !== 0 && !(hDay === 6 && weekends.includes(hDateStr));
      }).map((holiday) => holiday._id); // Only store the holiday ID

    // Calculate base working days by subtracting weekends and holidays
    let workingDays = totalDays - weekendsCount - holidays.length;

    // Check for overlapping approved leaves for the same employee
    const overlappingLeavesRecords = await LeaveModel.find({
      employee,
      status: "Approved",
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    // Iterate through the leave period and check each date for overlap
    const checkDate = new Date(start); // Start checking from the leave start date
    while (checkDate <= end) {
      const dateStr = checkDate.toISOString().split("T")[0]; // Convert date to ISO string

      // Check if the day is a weekend (Sunday or even Saturday)
      const isWeekend =
        checkDate.getDay() === 0 ||
        (checkDate.getDay() === 6 && weekends.includes(dateStr));

      // Check if the day is a holiday
      const isHoliday = holidays.some(
        (holidayId) => holidayId.toString() === dateStr
      );

      // Skip weekends and holidays
      if (isWeekend || isHoliday) {
        checkDate.setDate(checkDate.getDate() + 1);
        continue;
      }

      // If the day is a working day, check if the day overlaps with any approved leave
      const isOverlapping = overlappingLeavesRecords.some((leave) => {
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = new Date(leave.endDate);
        return checkDate >= leaveStart && checkDate <= leaveEnd;
      });

      // If the day overlaps with an approved leave, skip this day
      if (isOverlapping) {
        skippedDates.push(dateStr);
        workingDays--; // Decrease working days since this day is already taken
      }

      // Move to the next day
      checkDate.setDate(checkDate.getDate() + 1);
    }

    // Final leave days calculation after deductions
    const calculatedDays = workingDays;

    // If no eligible leave days remain, return an error
    if (calculatedDays <= 0) {
      return res.status(400).json({
        err: "No eligible leave days remaining after accounting for weekends, holidays, and overlapping leaves.",
      });
    }

    // Check the employee's leave balance for the requested leave type
    const employeeData = await EmployeeModel.findById(employee).populate(
      "leaveBalances"
    );
    const balanceEntry = employeeData.leaveBalances.find((b) =>
      b.leaveTypeId.equals(leaveType)
    );

    // If insufficient leave balance, return an error
    if (!balanceEntry || balanceEntry.currentBalance < calculatedDays) {
      return res.status(400).json({
        err: `Insufficient leave balance for ${leaveTypeExist.leaveTypeName}. You have ${balanceEntry.currentBalance} days Left, but you requested ${calculatedDays} days.`,
      });
    }

    // Create the leave request in the database
    const leave = await LeaveModel.create({
      employee,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      weekends, // Store weekends (Sundays & even Saturdays)
      holidays, // Store holidays
      skippedDates, // Store skipped dates due to overlap
      calculatedDays, // Final calculated leave days
      status: "Pending", // Default status for new leave requests
    });

    // Return success response with the created leave request
    res.status(201).json({
      msg: "Leave request created  successfully ",
      data: leave,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Leave creation error:", error);
    res.status(500).json({
      err: "Internal Server Error",
      message: error.message,
    });
  }
};


// It uses Moment.js to iterate over the leave period, identifies Sundays (always weekends) and alternating Saturdays as weekends, fetches holiday
// records, and then excludes these dates when marking the actual leave days in attendance. Any attendance already marked as a holiday is preserved.
//  The _id of each created/updated attendance record is stored in the leave request’s affectedAttendance field.
// Approve/Reject Leave
// const updateLeaveStatus = async (req, res) => {
//   try {
//     const leave = await LeaveModel.findById(req.params.id)
//       .populate("employee")
//       .populate("approvedBy");

//     if (!leave) {
//       return res.status(404).json({ err: "Leave request not found" });
//     }

//     // Update status and approver
//     leave.status = req.body.status;
//     leave.approvedBy = req.user.id;

//     // If approved, update attendance records
//     if (req.body.status === "Approved") {
//       const attendanceRecords = [];
//       const currentDate = moment(leave.startDate);

//       while (currentDate.isSameOrBefore(leave.endDate)) {
//         const newAttendance = await AttendanceModel.create({
//           employee: leave.employee._id,
//           attendanceDate: currentDate.toDate(),
//           status: "On Leave",
//           totalHours: 0,
//         });
//         attendanceRecords.push(newAttendance._id);
//         currentDate.add(1, "days");
//       }

//       leave.affectedAttendance = attendanceRecords;
//     }

//     await leave.save();
//     if (req.body.status === "Rejected") {
//       const attendanceRecords = [];
//       const currentDate = moment(leave.startDate);

//       while (currentDate.isSameOrBefore(leave.endDate)) {
//         const newAttendance = await AttendanceModel.create({
//           employee: leave.employee._id,
//           attendanceDate: currentDate.toDate(),
//           status: "On Leave",
//           totalHours: 0,
//         });
//         attendanceRecords.push(newAttendance._id);
//         currentDate.add(1, "days");
//       }

//       leave.affectedAttendance = attendanceRecords;
//     }
//     res.status(200).json({
//       msg: "Leave status updated successfully",
//       data: leave,
//     });
//   } catch (error) {
//     console.error("Leave update error:", error);
//     res
//       .status(500)
//       .json({ err: "Internal Server Error", error: error.message });
//   }
// };


// this is al correct in stead of over writing
// const updateLeaveStatus = async (req, res) => {
//   try {
//     // Retrieve the leave request and populate employee and approver info
//     const leave = await LeaveModel.findById(req.params.id)
//       .populate("employee")
//       .populate("approvedBy");

//     if (!leave) {
//       return res.status(404).json({ err: "Leave request not found" });
//     }

//     // Update status and record the approver (from req.user.id)
//     leave.status = req.body.status;
//     leave.approvedBy = req.body.approvedBy;

//     if (req.body.status === "Approved") {
//       // STEP 1: Calculate all dates in the leave period (inclusive)
//       const start = moment(leave.startDate);
//       const end = moment(leave.endDate);
//       let totalDates = [];
//       let current = start.clone();
//       while (current.isSameOrBefore(end)) {
//         totalDates.push(current.format("YYYY-MM-DD"));
//         current.add(1, "days");
//       }
//       leave.totalDaysOfLeavePeriod = totalDates.length;

//       // STEP 2: Identify weekend dates (weekends will be saved for leave calculation)
//       let weekends = [];
//       let saturdayFlag = true;
//       totalDates.forEach((dateStr) => {
//         const day = moment(dateStr, "YYYY-MM-DD").day();
//         if (day === 0) { // Sunday
//           weekends.push(dateStr);
//         } else if (day === 6) { // Saturday
//           if (saturdayFlag) {
//             weekends.push(dateStr);
//           }
//           saturdayFlag = !saturdayFlag;
//         }
//       });
//       leave.weekends = weekends;

//       // STEP 3: Retrieve holiday records within the leave period
//       const holidayRecords = await HolidayModel.find({
//         date: { $gte: leave.startDate, $lte: leave.endDate }
//       });
//       leave.holidays = holidayRecords;

//       // Convert holiday dates to string format for comparison
//       const holidayDates = holidayRecords.map(holiday =>
//         moment(holiday.date).format("YYYY-MM-DD")
//       );

//       // STEP 4: Determine actual leave dates by excluding weekends and holiday dates
//       const actualLeaveDates = totalDates.filter(dateStr => {
//         return !weekends.includes(dateStr) && !holidayDates.includes(dateStr);
//       });

//       let leaveCount = 0;
//       // STEP 5: Mark attendance for each actual leave date
//       let affectedAttendanceIds = [];
//       for (const dateStr of actualLeaveDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();

//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate
//         });

//         if (attendance) {
//           // Skip if the status is "On Leave" or "Holiday"
//           if (attendance.status === "On Leave" || attendance.status === "Holiday") {
//             continue;
//           }

//           // If attendance exists with any other status, move it to previousAttendance and update status
//           if (!attendance.previousAttendance) {
//             attendance.previousAttendance = [];
//           }

//           affectedAttendanceIds.push(attendance._id);

//           attendance.previousAttendance.push({
//             timeIn: attendance.timeIn,
//             timeOut: attendance.timeOut,
//             status: attendance.status,
//             lateBy: attendance.lateBy,
//             totalHours: attendance.totalHours,
//             updatedAt: Date.now(),
//           });

//           // Update the attendance status to "On Leave" and clear other fields
//           attendance.status = "On Leave";
//           attendance.timeIn = null;
//           attendance.timeOut = null;
//           attendance.lateBy = 0;
//           attendance.totalHours = 0;
//           await attendance.save();
//         } else {
//           // If no attendance record exists, create a new attendance record with status "On Leave"
//           let newAttendance = await AttendanceModel.create({
//             employee: leave.employee._id,
//             attendanceDate: attendanceDate,
//             status: "On Leave",
//             totalHours: 0
//           });
//           affectedAttendanceIds.push(newAttendance._id);
//         }
//       }

//       leave.affectedAttendance = affectedAttendanceIds;
//       leave.calculatedDays = affectedAttendanceIds.length;
//       leave.leaveConvertedToHolidayCount = leaveCount;
//     }

//     if (req.body.status === "Rejected") {
//       // Handle "Rejected" status (same as before)
//       const totalDates = [];
//       const start = moment(leave.startDate);
//       const end = moment(leave.endDate);
//       let current = start.clone();
//       while (current.isSameOrBefore(end)) {
//         totalDates.push(current.format("YYYY-MM-DD"));
//         current.add(1, "days");
//       }

//       // STEP 2: Delete attendance records for "On Leave" status within the leave period
//       await AttendanceModel.deleteMany({
//         employee: leave.employee._id,
//         status: "On Leave",
//         attendanceDate: { $in: totalDates.map(date => moment(date, "YYYY-MM-DD").toDate()) }
//       });

//       // STEP 3: Restore previous attendance statuses
//       const bulkOps = [];
//       for (const dateStr of totalDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();
//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate,
//         });

//         if (attendance && attendance.previousAttendance && attendance.previousAttendance.length > 0) {
//           const previousAttendance = attendance.previousAttendance.pop();

//           bulkOps.push({
//             updateOne: {
//               filter: { _id: attendance._id },
//               update: {
//                 $set: {
//                   timeIn: previousAttendance.timeIn,
//                   timeOut: previousAttendance.timeOut,
//                   status: previousAttendance.status,
//                   lateBy: previousAttendance.lateBy,
//                   totalHours: previousAttendance.totalHours,
//                   updatedAt: previousAttendance.updatedAt,
//                 },
//                 $set: { previousAttendance: [] }, // Clear the previousAttendance field
//               },
//             },
//           });
//         }
//       }

//       if (bulkOps.length > 0) {
//         await AttendanceModel.bulkWrite(bulkOps);
//       }

//       // STEP 4: Update leave status to "Rejected" and save
//       leave.status = "Rejected";
//       await leave.save();

//       return res.status(200).json({
//         msg: "Leave status updated successfully and attendance restored",
//         data: leave,
//       });
//     }

//     // Save the updated leave request
//     await leave.save();
//     return res.status(200).json({
//       msg: "Leave status updated successfully",
//       data: leave,
//     });
//   } catch (error) {
//     console.error("Leave update error:", error);
//     return res
//       .status(500)
//       .json({ err: "Internal Server Error", error: error.message });
//   }
// };


// const updateLeaveStatus = async (req, res) => {
//   try {
//     // Retrieve the leave request and populate employee and approver info
//     const leave = await LeaveModel.findById(req.params.id)
//       .populate("employee")
//       .populate("approvedBy");

//     if (!leave) {
//       return res.status(404).json({ err: "Leave request not found" });
//     }

//     // Update status and record the approver (from req.user.id)
//     leave.status = req.body.status;
//     leave.approvedBy = req.body.approvedBy;

//     if (req.body.status === "Approved") {
//       // STEP 1: Calculate all dates in the leave period (inclusive)
//       const totalDates = calculateDateRange(leave.startDate, leave.endDate);
//       leave.totalDaysOfLeavePeriod = totalDates.length;

//       // STEP 2: Identify weekend dates (weekends will be saved for leave calculation)
//       let weekends = [];
//       let saturdayFlag = true;
//       totalDates.forEach((dateStr) => {
//         const day = moment(dateStr, "YYYY-MM-DD").day();
//         if (day === 0) {
//           // Sunday
//           weekends.push(dateStr);
//         } else if (day === 6) {
//           const weekNumber = Math.ceil(newDate.getDate() / 7);
//           if (!weekNumber % 2 === 0) {
//           // Saturday
//           if (saturdayFlag) {
//             weekends.push(dateStr);
//           }
//           saturdayFlag = !saturdayFlag;
//         }}
//         // if (dayOfWeek === 6) {
//         //   const weekNumber = Math.ceil(newDate.getDate() / 7);
//         //   if (weekNumber % 2 === 0) {
//         //     return res.status(400).json({ err: "Holiday cannot be created on alternate Saturdays. They are weekends" });
//         //   }
//         // }
    
//       });
//       leave.weekends = weekends;

//       // STEP 3: Retrieve holiday records within the leave period
//       const holidayRecords = await HolidayModel.find({
//         date: { $gte: leave.startDate, $lte: leave.endDate },
//       });
//       leave.holidays = holidayRecords;

//       // Convert holiday dates to string format for comparison
//       const holidayDates = holidayRecords.map((holiday) =>
//         moment(holiday.date).format("YYYY-MM-DD")
//       );

//       // STEP 4: Determine actual leave dates by excluding weekends and holiday dates
//       const actualLeaveDates = totalDates.filter((dateStr) => {
//         return !weekends.includes(dateStr) && !holidayDates.includes(dateStr);
//       });

//       let affectedAttendanceIds = [];
//       for (const dateStr of actualLeaveDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();

//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate,
//         });

//         // Skip attendance updates if the status is already "On Leave" or "Holiday"
//         if (
//           attendance &&
//           (attendance.status === "On Leave" || attendance.status === "Holiday")
//         ) {
//           continue; // Skip if already "On Leave" or "Holiday"
//         }

//         if (attendance) {
//           // Move current attendance data to previousAttendance and mark as "On Leave"
//           if (!attendance.previousAttendance) {
//             attendance.previousAttendance = [];
//           }

//           affectedAttendanceIds.push(attendance._id);

//           attendance.previousAttendance.push({
//             timeIn: attendance.timeIn,
//             timeOut: attendance.timeOut,
//             status: attendance.status,
//             lateBy: attendance.lateBy,
//             totalHours: attendance.totalHours,
//             updatedAt: Date.now(),
//           });

//           // Mark attendance as "On Leave"
//           attendance.status = "On Leave";
//           attendance.timeIn = null;
//           attendance.timeOut = null;
//           attendance.lateBy = 0;
//           attendance.totalHours = 0;
//           await attendance.save();
//         } else {
//           // Create new attendance record with status "On Leave"
//           let newAttendance = await AttendanceModel.create({
//             employee: leave.employee._id,
//             attendanceDate: attendanceDate,
//             status: "On Leave",
//             totalHours: 0,
//           });
//           affectedAttendanceIds.push(newAttendance._id);
//         }
//       }

//       leave.affectedAttendance = affectedAttendanceIds;
//       leave.calculatedDays = affectedAttendanceIds.length;
//     }

//     if (req.body.status === "Rejected") {
//       // STEP 1: Delete attendance records for "On Leave" status within the leave period
//       const totalDates = calculateDateRange(leave.startDate, leave.endDate);

//       await AttendanceModel.deleteMany({
//         employee: leave.employee._id,
//         status: "On Leave",
//         attendanceDate: {
//           $in: totalDates.map((date) => moment(date, "YYYY-MM-DD").toDate()),
//         },
//       });

//       // STEP 2: Restore previous attendance statuses using bulkWrite
//       const bulkOps = [];
//       for (const dateStr of totalDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();
//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate,
//         });

//         if (
//           attendance &&
//           attendance.previousAttendance &&
//           attendance.previousAttendance.length > 0
//         ) {
//           const previousAttendance = attendance.previousAttendance.pop();

//           bulkOps.push({
//             updateOne: {
//               filter: { _id: attendance._id },
//               update: {
//                 $set: {
//                   timeIn: previousAttendance.timeIn,
//                   timeOut: previousAttendance.timeOut,
//                   status: previousAttendance.status,
//                   lateBy: previousAttendance.lateBy,
//                   totalHours: previousAttendance.totalHours,
//                   updatedAt: previousAttendance.updatedAt,
//                 },
//                 $set: { previousAttendance: [] }, // Clear the previousAttendance field
//               },
//             },
//           });
//         }
//       }

//       if (bulkOps.length > 0) {
//         await AttendanceModel.bulkWrite(bulkOps);
//       }

//       // STEP 3: Update leave status to "Rejected" and save
//       leave.status = "Rejected";
//       await leave.save();

//       return res.status(200).json({
//         msg: "Leave status updated successfully and attendance restored",
//         data: leave,
//       });
//     }

//     // Save the updated leave request
//     await leave.save();
//     return res.status(200).json({
//       msg: "Leave status and Attendance updated successfully",
//       data: leave,
//     });
//   } catch (error) {
//     console.error("Leave update error:", error);
//     return res
//       .status(500)
//       .json({ err: "Internal Server Error", error: error.message });
//   }
// };


// const calculateDateRange = (startDate, endDate) => {
//   const start = moment(startDate);
//   const end = moment(endDate);
//   let dates = [];
//   let current = start.clone();
//   while (current.isSameOrBefore(end)) {
//     dates.push(current.format("YYYY-MM-DD"));
//     current.add(1, "days");
//   }
//   return dates;
// };


// const updateLeaveStatus = async (req, res) => {
//   try {
//     // Retrieve the leave request and populate employee and approver info
//     const leave = await LeaveModel.findById(req.params.id)
//       .populate("employee")
//       .populate("approvedBy");

//     if (!leave) {
//       return res.status(404).json({ err: "Leave request not found" });
//     }

//     // Fetch the employee document to update leave balance
//     const employee = await EmployeeModel.findById(leave.employee._id);
//     if (!employee) {
//       return res.status(404).json({ err: "Employee not found" });
//     }

//     // Find the leave balance entry for the specific leave type
//     const leaveBalance = employee.leaveBalances.find((balance) =>
//       balance.leaveTypeId.equals(leave.leaveType)
//     );
//     if (!leaveBalance) {
//       return res.status(400).json({ err: "Leave balance not found for this leave type" });
//     }

//     // Update status and record the approver
//     const previousStatus = leave.status; // Store previous status to detect changes
//     leave.status = req.body.status;
//     leave.approvedBy = req.body.approvedBy;

//     if (req.body.status === "Approved" && previousStatus !== "Approved") {
//       // STEP 1: Calculate all dates in the leave period (inclusive)
//       const totalDates = calculateDateRange(leave.startDate, leave.endDate);
//       leave.totalDaysOfLeavePeriod = totalDates.length;

//       // STEP 2: Identify weekend dates (Sundays and even Saturdays)
//       let weekends = [];
//       totalDates.forEach((dateStr) => {
//         const date = moment(dateStr, "YYYY-MM-DD");
//         const day = date.day(); // 0 = Sunday, 6 = Saturday
//         const dayOfMonth = date.date(); // Day of the month (1-31)

//         if (day === 0) {
//           // Sunday is always a weekend
//           weekends.push(dateStr);
//         } else if (day === 6) {
//           // Saturday: Check if it's an even-numbered Saturday
//           const saturdayNumber = Math.ceil(dayOfMonth / 7); // Which Saturday of the month (1st, 2nd, etc.)
//           if (saturdayNumber % 2 === 0) {
//             // Even Saturdays (2nd, 4th, etc.) are weekends
//             weekends.push(dateStr);
//           }
//         }
//       });
//       leave.weekends = weekends;

//       // STEP 3: Retrieve holiday records within the leave period
//       const holidayRecords = await HolidayModel.find({
//         date: { $gte: leave.startDate, $lte: leave.endDate },
//       });
//       leave.holidays = holidayRecords;

//       // Convert holiday dates to string format for comparison
//       const holidayDates = holidayRecords.map((holiday) =>
//         moment(holiday.date).format("YYYY-MM-DD")
//       );

//       // STEP 4: Determine actual leave dates by excluding weekends and holidays
//       const actualLeaveDates = totalDates.filter((dateStr) => {
//         return !weekends.includes(dateStr) && !holidayDates.includes(dateStr);
//       });

//       let affectedAttendanceIds = [];
//       for (const dateStr of actualLeaveDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();

//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate,
//         });

//         // Skip if already "On Leave" or "Holiday"
//         if (attendance && (attendance.status === "On Leave" || attendance.status === "Holiday")) {
//           continue;     
//         }

//         if (attendance) {
//           if (!attendance.previousAttendance) {
//             attendance.previousAttendance = [];
//           }

//           affectedAttendanceIds.push(attendance._id);

//           attendance.previousAttendance.push({
//             timeIn: attendance.timeIn,
//             timeOut: attendance.timeOut,
//             status: attendance.status,
//             lateBy: attendance.lateBy,
//             totalHours: attendance.totalHours,
//             updatedAt: Date.now(),
//           });

//           attendance.status = "On Leave";
//           attendance.timeIn = null;
//           attendance.timeOut = null;
//           attendance.lateBy = 0;
//           attendance.totalHours = 0;
//           await attendance.save();
//         } else {
//           let newAttendance = await AttendanceModel.create({
//             employee: leave.employee._id,
//             attendanceDate: attendanceDate,
//             status: "On Leave",
//             totalHours: 0,
//           });
//           affectedAttendanceIds.push(newAttendance._id);
//         }
//       }

//       leave.affectedAttendance = affectedAttendanceIds;
//       leave.calculatedDays = affectedAttendanceIds.length;

//       // Deduct calculatedDays from currentBalance if sufficient balance exists
//       if (leaveBalance.currentBalance >= leave.calculatedDays) {
//         leaveBalance.currentBalance -= leave.calculatedDays;
//       } else {
//         return res.status(400).json({
//           err: `Insufficient leave balance. Required: ${leave.calculatedDays}, Available: ${leaveBalance.currentBalance}`,
//         });
//       }
//     }

//     if (req.body.status === "Rejected") {
//       // STEP 1: Delete attendance records for "On Leave" status within the leave period
//       const totalDates = calculateDateRange(leave.startDate, leave.endDate);

//       await AttendanceModel.deleteMany({
//         employee: leave.employee._id,
//         status: "On Leave",
//         attendanceDate: {
//           $in: totalDates.map((date) => moment(date, "YYYY-MM-DD").toDate()),
//         },
//       });

//       // STEP 2: Restore previous attendance statuses using bulkWrite
//       const bulkOps = [];
//       for (const dateStr of totalDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();
//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate,
//         });

//         if (
//           attendance &&
//           attendance.previousAttendance &&
//           attendance.previousAttendance.length > 0
//         ) {
//           const previousAttendance = attendance.previousAttendance.pop();

//           bulkOps.push({
//             updateOne: {
//               filter: { _id: attendance._id },
//               update: {
//                 $set: {
//                   timeIn: previousAttendance.timeIn,
//                   timeOut: previousAttendance.timeOut,
//                   status: previousAttendance.status,
//                   lateBy: previousAttendance.lateBy,
//                   totalHours: previousAttendance.totalHours,
//                   updatedAt: previousAttendance.updatedAt,
//                 },
//                 $set: { previousAttendance: [] },
//               },
//             },
//           });
//         }
//       }

//       if (bulkOps.length > 0) {
//         await AttendanceModel.bulkWrite(bulkOps);
//       }

//       // Add back the calculatedDays to currentBalance
//       leaveBalance.currentBalance += leave.calculatedDays;
//     }

//     // Save the updated leave request and employee document
//     await leave.save();
//     await employee.save();

//     return res.status(200).json({
//       msg: "Leave status and balance updated successfully",
//       data: leave,
//     });
//   } catch (error) {
//     console.error("Leave update error:", error);
//     return res.status(500).json({
//       err: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// this code is absolutely correct but when creating or updating the record it is not puting the same date by making the hours 0 it is adding hours also
// const calculateDateRange = (startDate, endDate) => {
//   const start = moment(startDate).startOf("day");
//   const end = moment(endDate).startOf("day");
//   let dates = [];
//   let current = start.clone();
//   while (current.isSameOrBefore(end)) {
//     dates.push(current.format("YYYY-MM-DD"));
//     current.add(1, "days");
//   }
//   return dates;
// };

// const updateLeaveStatus = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Retrieve the leave request
//     const leave = await LeaveModel.findById(req.params.id)
//       .populate("employee")
//       .populate("approvedBy")
//       .session(session);

//     if (!leave) {
//       await session.abortTransaction();
//       return res.status(404).json({ err: "Leave request not found" });
//     }

//     // Fetch the employee document
//     const employee = await EmployeeModel.findById(leave.employee._id).session(session);
//     if (!employee) {
//       await session.abortTransaction();
//       return res.status(404).json({ err: "Employee not found" });
//     }

//     // Find the leave balance entry
//     const leaveBalance = employee.leaveBalances.find((balance) =>
//       balance.leaveTypeId.equals(leave.leaveType)
//     );
//     if (!leaveBalance) {
//       await session.abortTransaction();
//       return res.status(400).json({ err: "Leave balance not found for this leave type" });
//     }

//     const previousStatus = leave.status;
//     leave.status = req.body.status;
//     leave.approvedBy = req.body.approvedBy;

//     if (req.body.status === "Approved" && previousStatus !== "Approved") {
//       // Step 1: Calculate all dates in the leave period
//       const totalDates = calculateDateRange(leave.startDate, leave.endDate);
//       leave.totalDaysOfLeavePeriod = totalDates.length;

//       // Step 2: Identify weekends (Sundays and even Saturdays)
//       let weekends = [];
//       totalDates.forEach((dateStr) => {
//         const date = moment(dateStr, "YYYY-MM-DD");
//         const day = date.day();
//         const dayOfMonth = date.date();
//         if (day === 0 || (day === 6 && Math.ceil(dayOfMonth / 7) % 2 === 0)) {
//           weekends.push(dateStr);
//         }
//       });
//       leave.weekends = weekends;

//       // Step 3: Retrieve holidays (normalize to YYYY-MM-DD)
//       const holidayRecords = await HolidayModel.find({
//         date: { $gte: moment(leave.startDate).startOf("day").toDate(), $lte: moment(leave.endDate).startOf("day").toDate() },
//       }).session(session);
//       leave.holidays = holidayRecords.map((h) => h._id);
//       const holidayDates = holidayRecords.map((h) => moment(h.date).format("YYYY-MM-DD"));

//       // Step 4: Determine actual leave dates
//       const actualLeaveDates = totalDates.filter(
//         (dateStr) => !weekends.includes(dateStr) && !holidayDates.includes(dateStr)
//       );

//       // Step 5: Prepare attendance updates and check balance
//       const attendanceOps = [];
//       const affectedAttendanceIds = [];

//       for (const dateStr of actualLeaveDates) {
//         const normalizedDate = moment(dateStr, "YYYY-MM-DD").startOf("day").toDate();
//         const attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: {
//             $gte: moment(dateStr, "YYYY-MM-DD").startOf("day").toDate(),
//             $lt: moment(dateStr, "YYYY-MM-DD").endOf("day").toDate(),
//           },
//         }).session(session);

//         if (attendance && (attendance.status === "On Leave" || attendance.status === "Holiday")) {
//           continue; // Skip if already "On Leave" or "Holiday"
//         }

//         if (attendance) {
//           // Update existing record
//           const previousData = {
//             timeIn: attendance.timeIn,
//             timeOut: attendance.timeOut,
//             status: attendance.status,
//             lateBy: attendance.lateBy,
//             totalHours: attendance.totalHours,
//             updatedAt: Date.now(),
//           };
//           attendanceOps.push({
//             updateOne: {
//               filter: { _id: attendance._id },
//               update: {
//                 $set: {
//                   status: "On Leave",
//                   timeIn: null,
//                   timeOut: null,
//                   lateBy: 0,
//                   totalHours: 0,
//                   attendanceDate: normalizedDate, // Normalize existing record's date
//                 },
//                 $push: { previousAttendance: previousData },
//               },
//             },
//           });
//           affectedAttendanceIds.push(attendance._id);
//         } else {
//           // Create new record
//           attendanceOps.push({
//             insertOne: {
//               document: {
//                 employee: leave.employee._id,
//                 attendanceDate: normalizedDate,
//                 status: "On Leave",
//                 timeIn: null,
//                 timeOut: null,
//                 lateBy: 0,
//                 totalHours: 0,
//                 previousAttendance: [],
//               },
//             },
//           });
//           affectedAttendanceIds.push(null); // Placeholder for new ID
//         }
//       }

//       // Check leave balance before applying changes
//       const calculatedDays = affectedAttendanceIds.length;
//       if (leaveBalance.currentBalance < calculatedDays) {
//         await session.abortTransaction();
//         return res.status(400).json({
//           err: `Insufficient leave balance. Required: ${calculatedDays}, Available: ${leaveBalance.currentBalance}`,
//         });
//       }

//       // Step 6: Execute bulk attendance updates
//       if (attendanceOps.length > 0) {
//         const bulkResult = await AttendanceModel.bulkWrite(attendanceOps, { session });
//         const insertedIds = Object.values(bulkResult.insertedIds);
//         affectedAttendanceIds.forEach((id, index) => {
//           if (!id) affectedAttendanceIds[index] = insertedIds.shift();
//         });
//       }

//       leave.affectedAttendance = affectedAttendanceIds;
//       leave.calculatedDays = calculatedDays;
//       leaveBalance.currentBalance -= calculatedDays;
//     }

//     if (req.body.status === "Rejected" && previousStatus === "Approved") {
//       const totalDates = calculateDateRange(leave.startDate, leave.endDate);

//       // Step 1: Delete "On Leave" records with no prior data
//       await AttendanceModel.deleteMany(
//         {
//           employee: leave.employee._id,
//           status: "On Leave",
//           attendanceDate: {
//             $in: totalDates.map((date) => moment(date, "YYYY-MM-DD").startOf("day").toDate()),
//           },
//           previousAttendance: { $size: 0 },
//         },
//         { session }
//       );

//       // Step 2: Restore previous attendance statuses
//       const bulkOps = [];
//       for (const dateStr of totalDates) {
//         const normalizedDate = moment(dateStr, "YYYY-MM-DD").startOf("day").toDate();
//         const attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: {
//             $gte: moment(dateStr, "YYYY-MM-DD").startOf("day").toDate(),
//             $lt: moment(dateStr, "YYYY-MM-DD").endOf("day").toDate(),
//           },
//         }).session(session);

//         if (attendance && attendance.previousAttendance && attendance.previousAttendance.length > 0) {
//           const previousAttendance = attendance.previousAttendance[attendance.previousAttendance.length - 1];
//           bulkOps.push({
//             updateOne: {
//               filter: { _id: attendance._id },
//               update: {
//                 $set: {
//                   timeIn: previousAttendance.timeIn,
//                   timeOut: previousAttendance.timeOut,
//                   status: previousAttendance.status,
//                   lateBy: previousAttendance.lateBy,
//                   totalHours: previousAttendance.totalHours,
//                   updatedAt: previousAttendance.updatedAt,
//                   attendanceDate: normalizedDate, // Normalize restored date
//                 },
//                 $pop: { previousAttendance: 1 },
//               },
//             },
//           });
//         }
//       }

//       if (bulkOps.length > 0) {
//         await AttendanceModel.bulkWrite(bulkOps, { session });
//       }

//       // Step 3: Refund leave balance
//       leaveBalance.currentBalance += leave.calculatedDays || 0;
//       leave.affectedAttendance = [];
//       leave.calculatedDays = 0;
//     }

//     // Save changes
//     await leave.save({ session });
//     await employee.save({ session });

//     await session.commitTransaction();
//     return res.status(200).json({
//       msg: "Leave status and balance updated successfully",
//       data: leave,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Leave update error:", error);
//     return res.status(500).json({
//       err: "Internal Server Error",
//       error: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// };



// Helper function to generate an array of dates between startDate and endDate
const calculateDateRange = (startDate, endDate) => {
  // Normalize start and end dates to midnight (00:00:00) for consistent comparison
  const start = moment(startDate).startOf("day");
  const end = moment(endDate).startOf("day");
  let dates = []; // Array to store the date strings
  let current = start.clone(); // Clone start date to avoid modifying the original
  while (current.isSameOrBefore(end)) { // Loop until current date exceeds end date
    dates.push(current.format("YYYY-MM-DD")); // Add date in YYYY-MM-DD format
    current.add(1, "days"); // Increment by one day
  }
  return dates; // Return array of dates
};

// Controller to update leave status (approve or reject)
const updateLeaveStatus = async (req, res) => {
  // Start a MongoDB transaction session for atomic operations
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Retrieve leave request by ID and populate related employee and approver data
    const leave = await LeaveModel.findById(req.params.id)
      .populate("employee") // Fetch full employee details
      .populate("approvedBy") // Fetch approver details
      .session(session); // Tie query to transaction session

    // Check if leave request exists
    if (!leave) {
      await session.abortTransaction(); // Roll back if not found
      return res.status(404).json({ err: "Leave request not found" });
    }

    // Fetch employee document for leave balance updates
    const employee = await EmployeeModel.findById(leave.employee._id).session(session);
    if (!employee) {
      await session.abortTransaction(); // Roll back if employee not found
      return res.status(404).json({ err: "Employee not found" });
    }

    // Find the leave balance for the specific leave type
    const leaveBalance = employee.leaveBalances.find((balance) =>
      balance.leaveTypeId.equals(leave.leaveType) // Match leave type ID
    );
    if (!leaveBalance) {
      await session.abortTransaction(); // Roll back if no balance found
      return res.status(400).json({ err: "Leave balance not found for this leave type" });
    }

    // Store current status and update with new status and approver from request
    const previousStatus = leave.status; // Track previous status for conditional logic
    leave.status = req.body.status; // Set new status (e.g., "Approved" or "Rejected")
    leave.approvedBy = req.body.approvedBy; // Set approver ID

    // Handle leave approval
    if (req.body.status === "Approved" && previousStatus !== "Approved") {
      // Step 1: Calculate all dates in the leave period
      const totalDates = calculateDateRange(leave.startDate, leave.endDate);
      leave.totalDaysOfLeavePeriod = totalDates.length; // Store total days in leave object

      // Step 2: Identify weekends (Sundays and even-numbered Saturdays)
      let weekends = [];
      totalDates.forEach((dateStr) => {
        const date = moment(dateStr, "YYYY-MM-DD"); // Parse date string
        const day = date.day(); // Get day of week (0 = Sunday, 6 = Saturday)
        const dayOfMonth = date.date(); // Get day of month (1-31)
        if (day === 0 || (day === 6 && Math.ceil(dayOfMonth / 7) % 2 === 0)) {
          weekends.push(dateStr); // Add Sundays and even Saturdays to weekends
        }
      });
      leave.weekends = weekends; // Store weekend dates in leave object

      // Step 3: Retrieve holidays within the leave period, normalized to midnight
      const holidayRecords = await HolidayModel.find({
        date: { 
          $gte: moment(leave.startDate).startOf("day").toDate(), // Start of leave period
          $lte: moment(leave.endDate).startOf("day").toDate() // End of leave period
        },
      }).session(session);
      leave.holidays = holidayRecords.map((h) => h._id); // Store holiday IDs
      const holidayDates = holidayRecords.map((h) => moment(h.date).format("YYYY-MM-DD")); // Convert to YYYY-MM-DD

      // Step 4: Filter out weekends and holidays to get actual leave dates
      const actualLeaveDates = totalDates.filter(
        (dateStr) => !weekends.includes(dateStr) && !holidayDates.includes(dateStr)
      );

      // Step 5: Prepare attendance updates and check leave balance
      const attendanceOps = []; // Array for bulk attendance operations
      const affectedAttendanceIds = []; // Track IDs of affected attendance records

      for (const dateStr of actualLeaveDates) {
        // Normalize date to midnight (hours, minutes, seconds = 0)
        const normalizedDate = moment(dateStr, "YYYY-MM-DD").startOf("day").toDate();
        // Find existing attendance record, matching only by date (ignoring time)
        const attendance = await AttendanceModel.findOne({
          employee: leave.employee._id,
          attendanceDate: {
            $gte: moment(dateStr, "YYYY-MM-DD").startOf("day").toDate(), // Start of day
            $lt: moment(dateStr, "YYYY-MM-DD").endOf("day").toDate(), // End of day
          },
        }).session(session);

        // Skip if already "On Leave" or "Holiday"
        if (attendance && (attendance.status === "On Leave" || attendance.status === "Holiday")) {
          continue;
        }

        if (attendance) {
          // Update existing record if it exists
          const previousData = {
            timeIn: attendance.timeIn, // Store original time in
            timeOut: attendance.timeOut, // Store original time out
            status: attendance.status, // Store original status
            lateBy: attendance.lateBy, // Store original lateBy value
            totalHours: attendance.totalHours, // Store original total hours
            updatedAt: Date.now(), // Timestamp of update
          };
          attendanceOps.push({
            updateOne: {
              filter: { _id: attendance._id }, // Match by attendance ID
              update: {
                $set: {
                  status: "On Leave", // Set status to "On Leave"
                  timeIn: null, // Clear time in
                  timeOut: null, // Clear time out
                  lateBy: 0, // Reset lateBy
                  totalHours: 0, // Reset total hours
                  attendanceDate: normalizedDate, // Set date to midnight (00:00:00)
                },
                $push: { previousAttendance: previousData }, // Add old data to history
              },
            },
          });
          affectedAttendanceIds.push(attendance._id); // Track updated record ID
        } else {
          // Create new record if no attendance exists
          attendanceOps.push({
            insertOne: {
              document: {
                employee: leave.employee._id, // Employee reference
                attendanceDate: normalizedDate, // Set date to midnight (00:00:00)
                status: "On Leave", // New status
                timeIn: null, // No time in
                timeOut: null, // No time out
                lateBy: 0, // Default lateBy
                totalHours: 0, // Default total hours
                previousAttendance: [], // Empty history for new record
              },
            },
          });
          affectedAttendanceIds.push(null); // Placeholder for new ID
        }
      }

      // Check if leave balance is sufficient before applying changes
      const calculatedDays = affectedAttendanceIds.length; // Number of days to be marked as leave
      if (leaveBalance.currentBalance < calculatedDays) {
        await session.abortTransaction(); // Roll back if insufficient balance
        return res.status(400).json({
          err: `Insufficient leave balance. Required: ${calculatedDays}, Available: ${leaveBalance.currentBalance}`,
        });
      }

      // Step 6: Execute bulk attendance updates
      if (attendanceOps.length > 0) {
        const bulkResult = await AttendanceModel.bulkWrite(attendanceOps, { session }); // Perform bulk operations
        const insertedIds = Object.values(bulkResult.insertedIds); // Get IDs of new records
        // Replace null placeholders with new IDs
        affectedAttendanceIds.forEach((id, index) => {
          if (!id) affectedAttendanceIds[index] = insertedIds.shift();
        });
      }

      leave.affectedAttendance = affectedAttendanceIds; // Store affected attendance IDs
      leave.calculatedDays = calculatedDays; // Store number of leave days
      leaveBalance.currentBalance -= calculatedDays; // Deduct from leave balance
    }

    // Handle leave rejection
    if (req.body.status === "Rejected" && previousStatus === "Approved") {
      const totalDates = calculateDateRange(leave.startDate, leave.endDate); // Get all dates in range

      // Step 1: Delete "On Leave" records with no prior data
      await AttendanceModel.deleteMany(
        {
          employee: leave.employee._id,
          status: "On Leave",
          attendanceDate: {
            $in: totalDates.map((date) => moment(date, "YYYY-MM-DD").startOf("day").toDate()), // Match normalized dates
          },
          previousAttendance: { $size: 0 }, // Only delete if no history
        },
        { session }
      );

      // Step 2: Restore previous attendance statuses
      const bulkOps = []; // Array for bulk operations
      for (const dateStr of totalDates) {
        const normalizedDate = moment(dateStr, "YYYY-MM-DD").startOf("day").toDate(); // Normalize to midnight
        // Find attendance record, matching only by date
        const attendance = await AttendanceModel.findOne({
          employee: leave.employee._id,
          attendanceDate: {
            $gte: moment(dateStr, "YYYY-MM-DD").startOf("day").toDate(), // Start of day
            $lt: moment(dateStr, "YYYY-MM-DD").endOf("day").toDate(), // End of day
          },
        }).session(session);

        // Restore previous data if available
        if (attendance && attendance.previousAttendance && attendance.previousAttendance.length > 0) {
          const previousAttendance = attendance.previousAttendance[attendance.previousAttendance.length - 1]; // Get latest history
          bulkOps.push({
            updateOne: {
              filter: { _id: attendance._id }, // Match by attendance ID
              update: {
                $set: {
                  timeIn: previousAttendance.timeIn, // Restore original time in
                  timeOut: previousAttendance.timeOut, // Restore original time out
                  status: previousAttendance.status, // Restore original status
                  lateBy: previousAttendance.lateBy, // Restore original lateBy
                  totalHours: previousAttendance.totalHours, // Restore original total hours
                  updatedAt: previousAttendance.updatedAt, // Restore original update time
                  attendanceDate: normalizedDate, // Set date to midnight (00:00:00)
                },
                $pop: { previousAttendance: 1 }, // Remove latest history entry
              },
            },
          });
        }
      }

      // Execute bulk restoration if there are operations
      if (bulkOps.length > 0) {
        await AttendanceModel.bulkWrite(bulkOps, { session });
      }

      // Step 3: Refund leave balance
      leaveBalance.currentBalance += leave.calculatedDays || 0; // Add back deducted days
      leave.affectedAttendance = []; // Clear affected attendance IDs
      leave.calculatedDays = 0; // Reset calculated days
    }

    // Save updated leave and employee documents
    await leave.save({ session });
    await employee.save({ session });

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    return res.status(200).json({
      msg: "Leave status and balance updated successfully",
      data: leave, // Return updated leave data
    });
  } catch (error) {
    // Roll back transaction on error
    await session.abortTransaction();
    console.error("Leave update error:", error); // Log error details
    return res.status(500).json({
      err: "Internal Server Error",
      error: error.message, // Return error message
    });
  } finally {
    // End the session to free resources
    session.endSession();
  }
};

const deleteLeave = async (req, res) => {
  try {
    const _id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(400).json({ err: "Invalid Id Format" });

    const leave = await LeaveModel.findById(_id);
    if (!leave) return res.status(404).json({ err: "Leave Request Not Found" });

    const holidaycheck = await HolidayModel.findByIdAndDelete(_id);
    if (!holidaycheck)
      return res.status(404).json({ err: "Leave Request Not Found" });

    res.status(200).json({ msg: "Leave Request Deleted" });
  } catch (error) {
    console.error("Error Deleting Leave Request:", error);
    res
      .status(500)
      .json({ err: "Internal Server Error", error: error.message });
  }
};
module.exports = {
  createLeaveRequest,
  updateLeaveStatus,
  getLeaveHistory,
  getLeaveHistoryByEmployee,
  deleteLeave,
};