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
      
    if (!leaves)  return res.status(404).json({ err: "No Leave Requests Found" }); 

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error Fetching Leave history:", error);
    res
      .status(500)
      .json({ err: "Internal Server Error", error: error.message });
  }
};

const getSingleLeave = async (req, res) => {
  try {
    const _id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(400).json({ err: "Invalid Id Format" });

    const leave = await LeaveModel.findById(_id)
      .populate("employee")
      .populate("leaveType")
      .populate("approvedBy")
      .sort("-createdAt")
      ;

    if (!leave) return res.status(404).json({ err: "No Leave Request Found" });

    return res.status(200).json(leave);
  } catch (error) {
    console.log("Error Fetching Leave history", error);
    return res.status(500).json({ err: "Internal Server Error", error: error.message });
  }
};

// // Create Leave Request
// const createLeaveRequest = async (req, res) => {
//   try {
//     const {
//       employee,
//       leaveType,
//       startDate,
//       endDate,
//       reason,
//     } = req.body;

//     // Adjusted regex for multiple characters (letters and spaces)
//     const nameRegex = /^[A-Za-z\s]+$/;
//     // const leaveTypeRegex = /^(Casual|Sick|Earned|Maternity|Paternity|Unpaid)$/;
//     const StatusTypeRegex = /^(Pending|Approved|Rejected)$/;

//     // Validate employee id
//     if (!mongoose.Types.ObjectId.isValid(employee))
//       return res.status(400).json({ err: "Invalid Employee id Format" });

//     // // Validate leave type
//     const leaveTypeExist = await LeaveTypeModel.findById(leaveType);
//     if (!leaveTypeExist) {
//       return res.status(400).json({ err: "Invalid Leave Type" });
//     }

//     // Validate reason
//      if (!reason || !nameRegex.test(reason)) return res.status(400).json({ err: "Invalid Reason" });
    
//     // Validate startDate and endDate existence and format
//     if (!startDate || isNaN(Date.parse(startDate))) {
//       return res.status(400).json({ err: "Invalid Start Date" });
//     }
//     if (!endDate || isNaN(Date.parse(endDate))) {
//       return res.status(400).json({ err: "Invalid End Date" });
//     }

//     // Ensure startDate is before (or equal to) endDate
//     if (new Date(startDate) > new Date(endDate)) {
//       return res.status(400).json({ err: "Start Date must be before or equal to End Date" });
//     }

//     // Validate that the employee exists in the database
//     const employeeExists = await EmployeeModel.findById(employee);
//     if (!employeeExists) {
//       return res.status(404).json({ err: "Employee not found" });
//     }
    
//     first i want to calculate the number of days from the starting date to ending date then subtract the weekends/sunday and holidays then set the remaining days in number to calculatedDays 
//     Check for overlapping leaves. If there are overlapping leave requests, the existing leaves in the leave model that overlap will remain, and the number of overlapping days will be subtracted 
//     from the total leave days between the start and end dates

//     const overlappingLeave = await LeaveModel.find({
//       employee,
//       $or: [
//         { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
//       ],
//     });

//     if (overlappingLeave) {
//       return res.status(409).json({
//         err: "Existing leave request conflicts with this period",
//       });
//     }
//     // Retrieve holidays that fall within the leave period
//     const Holidays = await HolidayModel.find({
//       date: { $gte: new Date(startDate), $lte: new Date(endDate) }
//     }).select('date'); // Assuming holidayDate field exists

//     // Create the leave request
//     const leave = await LeaveModel.create({
//       employee, // Use the key as defined in the schema
//       leaveType,
//       startDate,
//       endDate,
//       reason,
//       Holidays ,//Send all holidays overlapping in the holiday array field so the employee can see which leave dates overlap with holidays and also subtract the number of holidays. 
//       calculatedDays //Total leave days to be approved, adjusted by subtracting the days that overlap with holidays or other leave requests, and to be deducted from the leave balance.
//     });

//     res.status(201).json({
//       msg: "Leave request submitted successfully",
//       data: leave,
//     });
//   } catch (error) {
//     console.error("Leave creation error:", error);
//     res
//       .status(500)
//       .json({ err: "Internal Server Error", error: error.message });
//   }
// };

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

//      // Validate leave type - Ensure it's provided and is a valid ObjectId
//      if (!leaveType || !mongoose.Types.ObjectId.isValid(leaveType)) {
//       return res.status(400).json({ err: "Invalid or missing Leave Type ID" });
//     }


//     // Validate leave type by checking if it exists in the database
//     const leaveTypeExist = await LeaveTypeModel.findById(leaveType);
//     // console.log("leave type data retrived",leaveTypeExist)
//     if (!leaveTypeExist) {
//       return res.status(400).json({ err: "Invalid Leave Type" });
//     }

//     // Validate reason field: must exist and match the regex
//     if (!reason || !nameRegex.test(reason)) {
//       return res.status(400).json({ err: "Reason must contain only letters and spaces" });
//     }

//     // Parse start and end dates into Date objects
//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     // Validate date formats and ensure start date is before or equal to end date
//     if (!start.getTime() || !end.getTime()) {
//       return res.status(400).json({ err: "Invalid Date format" });
//     }
//     if (start > end) {
//       return res.status(400).json({ err: "Start date must be before or equal to the end date" });
//     }

//     // Check if the employee exists in the database
//     const employeeExists = await EmployeeModel.findById(employee);
//     if (!employeeExists) {
//       return res.status(404).json({ err: "Employee not found" });
//     }

//        // Check for exact duplicate leave requests for the same employee
//        const existingLeave = await LeaveModel.findOne({
//         employee,
//         startDate: { $eq: start },
//         endDate: { $eq: end }
//       });
  
//       if (existingLeave) {
//         return res.status(400).json({ err: "Duplicate leave request for the same dates" });
//       }

//     // Calculate total number of days between start and end dates (inclusive)
//     const totalDays = Math.ceil((end - start) / 86400000) + 1;

//     // Initialize variables to track weekends, holidays, and overlapping days
//     let weekendsCount = 0; // Count of weekends (Sundays and alternate Saturdays)
//     let weekends = []; // Store weekend days
//     let holidays = []; // Store non-weekend holidays
//     let overlappingLeaves = []; // Store overlapping approved leaves

//     // Track off Saturdays (alternating weekends)
//     const offSaturdays = [];
//     let saturdayFlag = true;

//     // Iterate through each day in the date range to count weekends
//     const currentDate = new Date(start);
//     while (currentDate <= end) {
//       const day = currentDate.getDay(); // Get day of the week (0 = Sunday, 6 = Saturday)
//       const dateStr = currentDate.toISOString().split('T')[0]; // Convert date to ISO string

//       // Check if the day is Sunday (always a weekend)
//       if (day === 0) {
//         weekendsCount++;
//         weekends.push(dateStr);
//       }
//       // Check if the day is Saturday (alternate weekends)
//       else if (day === 6) {
//         if (saturdayFlag) {
//           weekendsCount++;
//           weekends.push(dateStr); // Add to weekends array
//           offSaturdays.push(dateStr); // Track off Saturdays
//         }
//         saturdayFlag = !saturdayFlag; // Toggle the flag for alternating Saturdays
//       }

//       // Move to the next day
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     // Retrieve holidays within the leave period, excluding weekends
//     const holidayRecords = await HolidayModel.find({
//       date: { $gte: start, $lte: end }
//     });

//     // Extract holidays falling on weekends
//     holidays = holidayRecords.filter(holiday => {
//       const hDate = new Date(holiday.date);
//       const hDay = hDate.getDay();
//       const hDateStr = hDate.toISOString().split('T')[0];

//       // Exclude holidays on weekends (Sundays or off Saturdays)
//       return hDay !== 0 && !(hDay === 6 && offSaturdays.includes(hDateStr));
//     }).map(holiday => holiday._id); // Only store the holiday ID

//     // Calculate base working days by subtracting weekends and holidays
//     let workingDays = totalDays - weekendsCount - holidays.length;

//     // Check for overlapping approved leaves for the same employee
//     const overlappingLeavesRecords = await LeaveModel.find({
//       employee,
//       status: 'Approved',
//       $or: [
//         { startDate: { $lte: end }, endDate: { $gte: start } }
//       ]
//     });

//     // Calculate overlapping days
//     let overlappingDays = 0;
//     const checkDate = new Date(start); // Start checking from the leave start date
    
//     while (checkDate <= end) {
//       const day = checkDate.getDay(); // Get day of the week
//       const dateStr = checkDate.toISOString().split('T')[0]; // Convert date to ISO string

//       // Check if the day is a weekend (Sunday or off Saturday)
//       const isWeekend = day === 0 || (day === 6 && offSaturdays.includes(dateStr));
      
//       // Check if the day is a holiday
//       const isHoliday = holidays.some(holidayId => holidayId.toString() === dateStr);

//       // If the day is a working day (not a weekend or holiday)
//       if (!isWeekend && !isHoliday) {
//         // Check if the day overlaps with any existing approved leave
//         const isOverlapping = overlappingLeavesRecords.some(leave => {
//           const leaveStart = new Date(leave.startDate);
//           const leaveEnd = new Date(leave.endDate);
//           return checkDate >= leaveStart && checkDate <= leaveEnd;
//         });
        
//         // Increment overlapping days if there's an overlap
//         if (isOverlapping) overlappingDays++;
//       }
      
//       // Move to the next day
//       checkDate.setDate(checkDate.getDate() + 1);
//     }

//     // Final leave days calculation after deductions
//     const calculatedDays = workingDays - overlappingDays;

//     // If no eligible leave days remain, return an error
//     if (calculatedDays <= 0) {
//       return res.status(400).json({ 
//         err: "No eligible leave days remaining after accounting for weekends, holidays, and overlapping leaves." 
//       });
//     }

//     // Check the employee's leave balance for the requested leave type
//     const employeeData = await EmployeeModel.findById(employee)
//       .populate('leaveBalances');
//     const balanceEntry = employeeData.leaveBalances.find(b => b.leaveTypeId.equals(leaveType));

//     // If insufficient leave balance, return an error
//     if (!balanceEntry || balanceEntry.currentBalance < calculatedDays) {
//       return res.status(400).json({ 
//         err: `Insufficient leave balance for ${leaveTypeExist.leaveTypeName}. You have ${balanceEntry.currentBalance} days Left, but you requested ${calculatedDays} days.` 
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
//       calculatedDays, // Final calculated leave days
//       status: 'Pending' // Default status for new leave requests
//     });

//     // Return success response with the created leave request
//     res.status(201).json({
//       msg: "Leave request created successfully",
//       data: leave
//     });

//   } catch (error) {
//     // Handle any unexpected errors
//     console.error("Leave creation error:", error);
//     res.status(500).json({ 
//       err: "Internal Server Error", 
//       message: error.message 
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
      return res.status(400).json({ err: "Reason must contain only letters and spaces" });
    }

    // Parse start and end dates into Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date formats and ensure start date is before or equal to end date
    if (!start.getTime() || !end.getTime()) {
      return res.status(400).json({ err: "Invalid Date format" });
    }

        // Ensure holiday is created only for today or future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time from today

    if (date < today) {
      return res
        .status(400)
        .json({ err: "Holiday date must be today or a future date" });
    }


    if (start > end) {
      return res.status(400).json({ err: "Start date must be before or equal to the end date" });
    }

    // Check if the employee exists in the database
    const employeeExists = await EmployeeModel.findById(employee);
    if (!employeeExists) {
      return res.status(404).json({ err: "Employee not found" });
    }

    // Calculate total number of days between start and end dates (inclusive)
    const totalDays = Math.ceil((end - start) / 86400000) + 1;

    // Initialize variables to track weekends, holidays, and overlapping days
    let weekendsCount = 0; // Count of weekends (Sundays and alternate Saturdays)
    let weekends = []; // Store weekend days
    let holidays = []; // Store non-weekend holidays
    let overlappingLeaves = []; // Store overlapping approved leaves
    let skippedDates = []; // To track skipped dates (due to overlap)

    // Track off Saturdays (alternating weekends)
    const offSaturdays = [];
    let saturdayFlag = true;

    // Iterate through each day in the date range to count weekends
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const day = currentDate.getDay(); // Get day of the week (0 = Sunday, 6 = Saturday)
      const dateStr = currentDate.toISOString().split('T')[0]; // Convert date to ISO string

      // Check if the day is Sunday (always a weekend)
      if (day === 0) {
        weekendsCount++;
        weekends.push(dateStr);
      }
      // Check if the day is Saturday (alternate weekends)
      else if (day === 6) {
        if (saturdayFlag) {
          weekendsCount++;
          weekends.push(dateStr); // Add to weekends array
          offSaturdays.push(dateStr); // Track off Saturdays
        }
        saturdayFlag = !saturdayFlag; // Toggle the flag for alternating Saturdays
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Retrieve holidays within the leave period, excluding weekends
    const holidayRecords = await HolidayModel.find({
      date: { $gte: start, $lte: end }
    });

    // Extract holidays falling on weekends
    holidays = holidayRecords.filter(holiday => {
      const hDate = new Date(holiday.date);
      const hDay = hDate.getDay();
      const hDateStr = hDate.toISOString().split('T')[0];

      // Exclude holidays on weekends (Sundays or off Saturdays)
      return hDay !== 0 && !(hDay === 6 && offSaturdays.includes(hDateStr));
    }).map(holiday => holiday._id); // Only store the holiday ID

    // Calculate base working days by subtracting weekends and holidays
    let workingDays = totalDays - weekendsCount - holidays.length;

    // Check for overlapping approved leaves for the same employee
    const overlappingLeavesRecords = await LeaveModel.find({
      employee,
      status: 'Approved',
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    // Iterate through the leave period and check each date for overlap
    const checkDate = new Date(start); // Start checking from the leave start date
    while (checkDate <= end) {
      const dateStr = checkDate.toISOString().split('T')[0]; // Convert date to ISO string

      // Check if the day is a weekend (Sunday or off Saturday)
      const isWeekend = checkDate.getDay() === 0 || (checkDate.getDay() === 6 && offSaturdays.includes(dateStr));
      
      // Check if the day is a holiday
      const isHoliday = holidays.some(holidayId => holidayId.toString() === dateStr);

      // Skip weekends and holidays
      if (isWeekend || isHoliday) {
        checkDate.setDate(checkDate.getDate() + 1);
        continue;
      }

      // If the day is a working day, check if the day overlaps with any approved leave
      const isOverlapping = overlappingLeavesRecords.some(leave => {
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
        err: "No eligible leave days remaining after accounting for weekends, holidays, and overlapping leaves." 
      });
    }

    // Check the employee's leave balance for the requested leave type
    const employeeData = await EmployeeModel.findById(employee)
      .populate('leaveBalances');
    const balanceEntry = employeeData.leaveBalances.find(b => b.leaveTypeId.equals(leaveType));

    // If insufficient leave balance, return an error
    if (!balanceEntry || balanceEntry.currentBalance < calculatedDays) {
      return res.status(400).json({ 
        err: `Insufficient leave balance for ${leaveTypeExist.leaveTypeName}. You have ${balanceEntry.currentBalance} days Left, but you requested ${calculatedDays} days.` 
      });
    }

    // Create the leave request in the database
    const leave = await LeaveModel.create({
      employee,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      weekends, // Store weekends (Sundays & off Saturdays)
      holidays, // Store holidays
      skippedDates, // Store skipped dates due to overlap
      calculatedDays, // Final calculated leave days
      status: 'Pending' // Default status for new leave requests
    });

    // Return success response with the created leave request
    res.status(201).json({
      msg: "Leave request created successfully",
      data: leave
    });

  } catch (error) {
    // Handle any unexpected errors
    console.error("Leave creation error:", error);
    res.status(500).json({ 
      err: "Internal Server Error", 
      message: error.message 
    });
  }
}



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

// const updateLeaveStatus = async (req, res) => {
//   try {
//     // Retrieve the leave request and populate employee and approver info
//     const leave = await LeaveModel.findById(req.params.id)
//       .populate("employee")
//       .populate("approvedBy");

//     if (!leave) {
//       return res.status(404).json({ err: "Leave request not found" });
//     }

//     // Update status and record approver
//     leave.status = req.body.status;
//     leave.approvedBy = req.user.id;

//     // Process further only if the status is "Approved"
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

//       // STEP 2: Identify weekend dates:
//       // - Sundays are always weekends.
//       // - For Saturdays, alternate them: first Saturday in the range is off, the next is not, then off, etc.
//       let weekends = [];
//       let saturdayFlag = true;
//       totalDates.forEach((dateStr) => {
//         const day = moment(dateStr, "YYYY-MM-DD").day();
//         if (day === 0) {
//           // Sunday
//           weekends.push(dateStr);
//         } else if (day === 6) {
//           // Saturday: add only if the flag is true, then toggle the flag.
//           if (saturdayFlag) {
//             weekends.push(dateStr);
//           }
//           saturdayFlag = !saturdayFlag;
//         }
//       });
//       leave.weekends = weekends; // Store array of weekend date strings

//       // STEP 3: Retrieve holiday records within the leave period
//       const holidayRecords = await HolidayModel.find({
//         date: { $gte: leave.startDate, $lte: leave.endDate }
//       });
//       leave.holidays = holidayRecords; // Store holiday objects

//       // Convert holiday dates to strings for easy comparison
//       const holidayDates = holidayRecords.map(holiday =>
//         moment(holiday.date).format("YYYY-MM-DD")
//       );

//       // STEP 4: Determine actual leave dates by excluding weekends and holiday dates
//       const actualLeaveDates = totalDates.filter(dateStr => {
//         return !weekends.includes(dateStr) && !holidayDates.includes(dateStr);
//       });

//       // STEP 5: Mark attendance for each actual leave date and collect affected attendance _ids
//       let affectedAttendanceIds = [];
//       for (const dateStr of actualLeaveDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();

//         // Check for an existing attendance record
//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate
//         });

//         if (attendance) {
//           // Do not overwrite if already marked as a Holiday
//           if (attendance.status === "Holiday") {
//             continue;
//           } else {
//             attendance.status = "On Leave";
//             attendance.totalHours = 0;
//             await attendance.save();
//             affectedAttendanceIds.push(attendance._id);
//           }
//         } else {
//           // Create a new attendance record for the leave day
//           let newAttendance = await AttendanceModel.create({
//             employee: leave.employee._id,
//             attendanceDate: attendanceDate,
//             status: "On Leave",
//             totalHours: 0
//           });
//           affectedAttendanceIds.push(newAttendance._id);
//         }
//       }
//       // Store all affected attendance IDs in the leave request
//       leave.affectedAttendance = affectedAttendanceIds;
//     }

//     // Save the updated leave request
//     await leave.save();
//     return res.status(200).json({
//       msg: "Leave status updated successfully",
//       data: leave
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
//     // leave.status = req.body.status;
//     // leave.approvedBy = req.body.approvedBy;
//     const {status,} = req.body;

//     // Process only if the status is "Approved"
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

//       // STEP 2: Identify weekend dates:
//       // - Sundays are always weekends.
//       // - For Saturdays, alternate them: the first Saturday is off, then the next is a working day, then off, etc.
//       let weekends = [];
//       let saturdayFlag = true;
//       totalDates.forEach((dateStr) => {
//         const day = moment(dateStr, "YYYY-MM-DD").day();
//         if (day === 0) {
//           // Sunday
//           weekends.push(dateStr);
//         } else if (day === 6) {
//           // Saturday: add only if flag is true, then toggle the flag.
//           if (saturdayFlag) {
//             weekends.push(dateStr);
//           }
//           saturdayFlag = !saturdayFlag;
//         }
//       });
//       leave.weekends = weekends; // Store array of weekend date strings

//       // STEP 3: Retrieve holiday records within the leave period
//       const holidayRecords = await HolidayModel.find({
//         date: { $gte: leave.startDate, $lte: leave.endDate }
//       });
//       leave.holidays = holidayRecords; // Store full holiday objects

//       // Convert holiday dates to string format for comparison
//       const holidayDates = holidayRecords.map(holiday =>
//         moment(holiday.date).format("YYYY-MM-DD")
//       );

//       // STEP 4: Determine actual leave dates by excluding weekends and holiday dates
//       const actualLeaveDates = totalDates.filter(dateStr => {
//         return !weekends.includes(dateStr) && !holidayDates.includes(dateStr);
//       });

//       // STEP 5: Mark attendance for each actual leave date,
//       // but only if an attendance record for that day does NOT already exist.
//       let affectedAttendanceIds = [];
//       for (const dateStr of actualLeaveDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();

//         // Check for an existing attendance record for this employee on this date
//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate
//         });

//         if (attendance) {
//           // If an attendance record exists, skip marking for this day.
//           continue;
//         } else {
//           // Create a new attendance record for the leave day
//           let newAttendance = await AttendanceModel.create({
//             employee: leave.employee._id,
//             attendanceDate: attendanceDate,
//             status: "On Leave",
//             totalHours: 0
//           });
//           affectedAttendanceIds.push(newAttendance._id);
//         }
//       }
//       // Store the IDs of the newly created attendance records and update calculatedDays
//       leave.affectedAttendance = affectedAttendanceIds;
//       leave.calculatedDays = affectedAttendanceIds.length;
//     }

//     // Save the updated leave request
//     await leave.save();
//     return res.status(200).json({
//       msg: "Leave status updated successfully",
//       data: leave
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

//     // Process only if the status is "Approved"
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

//       // STEP 2: Identify weekend dates:
//       // - Sundays are always weekends.
//       // - For Saturdays, alternate them: the first Saturday is off, then the next is a working day, then off, etc.
//       let weekends = [];
//       let saturdayFlag = true;
//       totalDates.forEach((dateStr) => {
//         const day = moment(dateStr, "YYYY-MM-DD").day();
//         if (day === 0) {
//           // Sunday
//           weekends.push(dateStr);
//         } else if (day === 6) {
//           // Saturday: add only if flag is true, then toggle the flag.
//           if (saturdayFlag) {
//             weekends.push(dateStr);
//           }
//           saturdayFlag = !saturdayFlag;
//         }
//       });
//       leave.weekends = weekends; // Store array of weekend date strings

//       // STEP 3: Retrieve holiday records within the leave period
//       const holidayRecords = await HolidayModel.find({
//         date: { $gte: leave.startDate, $lte: leave.endDate }
//       });
//       leave.holidays = holidayRecords; // Store full holiday objects

//       // Convert holiday dates to string format for comparison
//       const holidayDates = holidayRecords.map(holiday =>
//         moment(holiday.date).format("YYYY-MM-DD")
//       );

//       // STEP 4: Determine actual leave dates by excluding weekends and holiday dates
//       const actualLeaveDates = totalDates.filter(dateStr => {
//         return !weekends.includes(dateStr) && !holidayDates.includes(dateStr);
//       });

//       // STEP 5: Mark attendance for each actual leave date,
//       // but only if an attendance record for that day does NOT already exist.
//       let affectedAttendanceIds = [];
//       for (const dateStr of actualLeaveDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();

//         // Check for an existing attendance record for this employee on this date
//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate
//         });

//         if (attendance) {
//           // If an attendance record exists, skip marking for this day.
//           continue;
//         } else {
//           // Create a new attendance record for the leave day
//           let newAttendance = await AttendanceModel.create({
//             employee: leave.employee._id,
//             attendanceDate: attendanceDate,
//             status: "On Leave",
//             totalHours: 0
//           });
//           affectedAttendanceIds.push(newAttendance._id);
//         }
//       }
//       // Store the IDs of the newly created attendance records and update calculatedDays
//       leave.affectedAttendance = affectedAttendanceIds;
//       leave.calculatedDays = affectedAttendanceIds.length;
//     }

//     // Save the updated leave request
//     await leave.save();
//     return res.status(200).json({
//       msg: "Leave status updated successfully",
//       data: leave
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

//     // Process for "Approved" status
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

//       // STEP 5: Mark attendance for each actual leave date, but only if an attendance record for that day does NOT already exist.
//       let affectedAttendanceIds = [];
//       for (const dateStr of actualLeaveDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();

//         // Check for an existing attendance record for this employee on this date
//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate
//         });

//         if (attendance) {
//           // If an attendance record exists, skip marking for this day
//           continue;
//         } else {
//           // Create a new attendance record for the leave day
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
//     }

//     if (req.body.status === "Rejected") {
//       // STEP 1: Save all the dates in the leave period from startDate to endDate
//       const totalDates = [];
//       const start = moment(leave.startDate);
//       const end = moment(leave.endDate);
//       let current = start.clone();
//       while (current.isSameOrBefore(end)) {
//         totalDates.push(current.format("YYYY-MM-DD"));
//         current.add(1, "days");
//       }
    
//       // STEP 2: Delete attendance records for the employee with status "On Leave" for each date in the leave period
//       await AttendanceModel.deleteMany({
//         employee: leave.employee._id,
//         status: "On Leave",
//         attendanceDate: { $in: totalDates.map(date => moment(date, "YYYY-MM-DD").toDate()) }
//       });
    
//       // STEP 3: Prepare bulk update operations to restore previous attendance status
//       const bulkOps = [];
    
//       // Loop through each date in the leave period
//       for (const dateStr of totalDates) {
//         const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();
    
//         // Find attendance records for this employee and date
//         let attendance = await AttendanceModel.findOne({
//           employee: leave.employee._id,
//           attendanceDate: attendanceDate,
//         });
    
//         // If attendance exists and has previousAttendance, restore it
//         if (attendance && attendance.previousAttendance && attendance.previousAttendance.length > 0) {
//           const previousAttendance = attendance.previousAttendance.pop(); // Get the last stored record
    
//           // Prepare bulk update operation for attendance restoration
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
//                   leaveConvertedToHolidayCount: previousAttendance.leaveConvertedToHolidayCount,
//                   updatedAt: previousAttendance.updatedAt,
//                 },
//                 $set: { previousAttendance: [] }, // Clear the previousAttendance field
//               },
//             },
//           });
//         }
//       }
    
//       // If there are any bulk operations, execute them in bulk
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
//       data: leave
//     });
//   } catch (error) {
//     console.error("Leave update error:", error);
//     return res
//       .status(500)
//       .json({ err: "Internal Server Error", error: error.message });
//   }
// };

// this code was final and correct but this was not overiting the other attendance record instead it was creating a new one
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
//           if (attendance.status === "On Leave") {
//             // If the status is already "On Leave", don't create a new attendance record
//             continue;
//         }
//           // if (attendance.status === "On Leave") {
//           //   leaveCount++;
//           // }
//           if (!attendance.previousAttendance) {
//             attendance.previousAttendance = [];
//           }
//           // affectedAttendance field of leave model
//           affectedAttendanceIds.push(attendance._id);
//               attendance.previousAttendance.push({
//                 timeIn: attendance.timeIn,
//                 timeOut: attendance.timeOut,
//                 status: attendance.status,
//                 lateBy: attendance.lateBy,
//                 totalHours: attendance.totalHours,
//                 leaveConvertedToHolidayCount: leaveCount,
//                 updatedAt: Date.now(),
//               });
//               // Update the attendance record to mark it as On Leave
//               attendance.status = "On Leave";
//               attendance.timeIn = null;
//               attendance.timeOut = null;
//               attendance.lateBy = 0;
//               attendance.totalHours = 0;
//               await attendance.save();
//          }else{
//           let newAttendance = await AttendanceModel.create({
//             employee: leave.employee._id,
//             attendanceDate: attendanceDate,
//             status: "On Leave",
//             totalHours: 0
//           });
//           affectedAttendanceIds.push(newAttendance._id);

//          }
//       }
//       leave.affectedAttendance = affectedAttendanceIds;
//       leave.calculatedDays = affectedAttendanceIds.length;
//       leave.leaveConvertedToHolidayCount = leaveCount;
//     }

    

//     if (req.body.status === "Rejected") {
//       // STEP 1: Save all the dates in the leave period from startDate to endDate
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

//       // STEP 3: Prepare bulk update operations to restore previous attendance status
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
//                   leaveConvertedToHolidayCount: previousAttendance.leaveConvertedToHolidayCount,
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
//           // If attendance exists, overwrite the existing record to "On Leave"
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

//           // Overwrite the existing attendance status to "On Leave"
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


const calculateDateRange = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  let dates = [];
  let current = start.clone();
  while (current.isSameOrBefore(end)) {
    dates.push(current.format("YYYY-MM-DD"));
    current.add(1, "days");
  }
  return dates;
};

const updateLeaveStatus = async (req, res) => {
  try {
    // Retrieve the leave request and populate employee and approver info
    const leave = await LeaveModel.findById(req.params.id)
      .populate("employee")
      .populate("approvedBy");

    if (!leave) {
      return res.status(404).json({ err: "Leave request not found" });
    }

    // Update status and record the approver (from req.user.id)
    leave.status = req.body.status;
    leave.approvedBy = req.body.approvedBy;

    if (req.body.status === "Approved") {
      // STEP 1: Calculate all dates in the leave period (inclusive)
      const totalDates = calculateDateRange(leave.startDate, leave.endDate);
      leave.totalDaysOfLeavePeriod = totalDates.length;

      // STEP 2: Identify weekend dates (weekends will be saved for leave calculation)
      let weekends = [];
      let saturdayFlag = true;
      totalDates.forEach((dateStr) => {
        const day = moment(dateStr, "YYYY-MM-DD").day();
        if (day === 0) { // Sunday
          weekends.push(dateStr);
        } else if (day === 6) { // Saturday
          if (saturdayFlag) {
            weekends.push(dateStr);
          }
          saturdayFlag = !saturdayFlag;
        }
      });
      leave.weekends = weekends;

      // STEP 3: Retrieve holiday records within the leave period
      const holidayRecords = await HolidayModel.find({
        date: { $gte: leave.startDate, $lte: leave.endDate }
      });
      leave.holidays = holidayRecords;

      // Convert holiday dates to string format for comparison
      const holidayDates = holidayRecords.map(holiday =>
        moment(holiday.date).format("YYYY-MM-DD")
      );

      // STEP 4: Determine actual leave dates by excluding weekends and holiday dates
      const actualLeaveDates = totalDates.filter(dateStr => {
        return !weekends.includes(dateStr) && !holidayDates.includes(dateStr);
      });

      let affectedAttendanceIds = [];
      for (const dateStr of actualLeaveDates) {
        const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();

        let attendance = await AttendanceModel.findOne({
          employee: leave.employee._id,
          attendanceDate: attendanceDate
        });

        // Skip attendance updates if the status is already "On Leave" or "Holiday"
        if (attendance && (attendance.status === "On Leave" || attendance.status === "Holiday")) {
          continue;  // Skip if already "On Leave" or "Holiday"
        }

        if (attendance) {
          // Move current attendance data to previousAttendance and mark as "On Leave"
          if (!attendance.previousAttendance) {
            attendance.previousAttendance = [];
          }

          affectedAttendanceIds.push(attendance._id);

          attendance.previousAttendance.push({
            timeIn: attendance.timeIn,
            timeOut: attendance.timeOut,
            status: attendance.status,
            lateBy: attendance.lateBy,
            totalHours: attendance.totalHours,
            updatedAt: Date.now(),
          });

          // Mark attendance as "On Leave"
          attendance.status = "On Leave";
          attendance.timeIn = null;
          attendance.timeOut = null;
          attendance.lateBy = 0;
          attendance.totalHours = 0;
          await attendance.save();
        } else {
          // Create new attendance record with status "On Leave"
          let newAttendance = await AttendanceModel.create({
            employee: leave.employee._id,
            attendanceDate: attendanceDate,
            status: "On Leave",
            totalHours: 0
          });
          affectedAttendanceIds.push(newAttendance._id);
        }
      }

      leave.affectedAttendance = affectedAttendanceIds;
      leave.calculatedDays = affectedAttendanceIds.length;
    }

    if (req.body.status === "Rejected") {
      // STEP 1: Delete attendance records for "On Leave" status within the leave period
      const totalDates = calculateDateRange(leave.startDate, leave.endDate);

      await AttendanceModel.deleteMany({
        employee: leave.employee._id,
        status: "On Leave",
        attendanceDate: { $in: totalDates.map(date => moment(date, "YYYY-MM-DD").toDate()) }
      });

      // STEP 2: Restore previous attendance statuses using bulkWrite
      const bulkOps = [];
      for (const dateStr of totalDates) {
        const attendanceDate = moment(dateStr, "YYYY-MM-DD").toDate();
        let attendance = await AttendanceModel.findOne({
          employee: leave.employee._id,
          attendanceDate: attendanceDate,
        });

        if (attendance && attendance.previousAttendance && attendance.previousAttendance.length > 0) {
          const previousAttendance = attendance.previousAttendance.pop();

          bulkOps.push({
            updateOne: {
              filter: { _id: attendance._id },
              update: {
                $set: {
                  timeIn: previousAttendance.timeIn,
                  timeOut: previousAttendance.timeOut,
                  status: previousAttendance.status,
                  lateBy: previousAttendance.lateBy,
                  totalHours: previousAttendance.totalHours,
                  updatedAt: previousAttendance.updatedAt,
                },
                $set: { previousAttendance: [] }, // Clear the previousAttendance field
              },
            },
          });
        }
      }

      if (bulkOps.length > 0) {
        await AttendanceModel.bulkWrite(bulkOps);
      }

      // STEP 3: Update leave status to "Rejected" and save
      leave.status = "Rejected";
      await leave.save();

      return res.status(200).json({
        msg: "Leave status updated successfully and attendance restored",
        data: leave,
      });
    }

    // Save the updated leave request
    await leave.save();
    return res.status(200).json({
      msg: "Leave status updated successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Leave update error:", error);
    return res
      .status(500)
      .json({ err: "Internal Server Error", error: error.message });
  }
};




const deleteLeave = async (req, res) => {
  try {
    const _id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(400).json({ err: "Invalid Id Format" });

    const leave = await LeaveModel.findById(_id);
    if (!leave) return res.status(404).json({ err: "Leave Request Not Found" });


    const holidaycheck = await HolidayModel.findByIdAndDelete(_id)
    if (!holidaycheck) return res.status(404).json({ err: "Leave Request Not Found" });

    res.status(200).json({ msg: "Leave Request Deleted" });
  } catch (error) {
    console.error("Error Deleting Leave Request:", error);
    res
      .status(500)
      .json({ err: "Internal Server Error", error: error.message });
  }
}
module.exports = { createLeaveRequest, updateLeaveStatus, getLeaveHistory ,getSingleLeave,deleteLeave};