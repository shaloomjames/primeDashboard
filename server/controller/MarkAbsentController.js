// Import necessary modules (assuming they are available in the project)
const moment = require("moment");
const mongoose = require("mongoose");
const EmployeeModel = require("../models/EmployeeModel");
const AttendanceModel = require("../models/AttendanceModel");
const HolidayModel = require("../models/HolidayModel");
const LeaveModel = require("../models/LeaveModel");

// Mark Absences for a Specific Date
// @Request   POST
// @Route     /api/attendance/mark-absences
// @Access    Private (Admin only)
const markAbsencesForDate = async (req, res) => {
  try {
    // Extract date from request body
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ err: "Date is required" });
    }

    // Parse and validate the date
    const targetDate = moment(date, "YYYY-MM-DD");
    if (!targetDate.isValid()) {
      return res
        .status(400)
        .json({ err: "Invalid date format. Use YYYY-MM-DD" });
    }

    // Prevent marking absences for future dates
    const today = moment().startOf("day");
    if (targetDate.isAfter(today)) {
      return res
        .status(400)
        .json({ err: "Cannot mark absences for future dates" });
    }

    // Check if the date is a Sunday (day 0)
    if (targetDate.day() === 0) {
      return res
        .status(400)
        .json({
          err: "The specified date is a Sunday, which is not a working day",
        });
    }

    // Check if the date is a holiday
    const holiday = await HolidayModel.findOne({ date: targetDate.toDate() });
    if (holiday) {
      return res.status(400).json({ err: "The specified date is a holiday" });
    }

    // Determine if the date is an off Saturday (alternate Saturdays)
    // For simplicity, assume alternate Saturdays are off, starting from a reference date
    // Reference: First Saturday of 2023 (2023-01-07) is a working day, then alternate
    const referenceDate = moment("2023-01-07", "YYYY-MM-DD");
    const weeksDiff = targetDate.diff(referenceDate, "weeks");
    const isSaturday = targetDate.day() === 6;
    const isOffSaturday = isSaturday && weeksDiff % 2 === 1; // Odd weeks are off

    if (isOffSaturday) {
      return res
        .status(400)
        .json({
          err: "The specified date is an off Saturday, which is not a working day",
        });
    }

    // If we reach here, the date is a working day
    // Fetch all employees
    const employees = await EmployeeModel.find();
    let absenceCount = 0;

    // Process each employee
    for (const employee of employees) {
      // Check if an attendance record exists for this employee on the target date
      const attendance = await AttendanceModel.findOne({
        employee: employee._id,
        attendanceDate: targetDate.toDate(),
      });

      // If no attendance record exists, mark as absent
      if (!attendance) {
        await AttendanceModel.create({
          employee: employee._id,
          attendanceDate: targetDate.toDate(),
          status: "Absence",
          timeIn: null,
          timeOut: null,
          lateBy: 0,
          totalHours: 0,
        });
        absenceCount++;
      }
    }

    // Return success response
    return res.status(200).json({
      msg: `Absences marked successfully. ${absenceCount} absence records created.`,
    });
  } catch (error) {
    console.error("Error marking absences:", error);
    return res
      .status(500)
      .json({ err: "Internal Server Error", error: error.message });
  }
};

// // // Mark Absences for a Month for a Specific Employee
// // // @Request   POST
// // // @Route     /api/attendance/mark-absences-month/:employeeId/:month
// // // @Access    Private (Admin only)
// // const markAbsencesForMonth = async (req, res) => {
// //   try {
// //     // Extract employeeId and month from request params
// //     const { id, month } = req.params;

// //     // Validate inputs
// //     if (!id) {
// //       return res.status(400).json({ err: "Employee ID is required" });
// //     }
// //     if (!month) {
// //       return res.status(400).json({ err: "Month is required" });
// //     }

// //     // Validate month format (should be YYYY-MM)
// //     const targetMonth = moment(month, "YYYY-MM");
// //     if (!targetMonth.isValid()) {
// //       return res.status(400).json({ err: "Invalid month format. Use YYYY-MM" });
// //     }

// //     // Prevent marking absences for future months
// //     const currentMonth = moment().startOf('month');
// //     if (targetMonth.isAfter(currentMonth)) {
// //       return res.status(400).json({ err: "Cannot mark absences for future months" });
// //     }

// //     // Verify employee exists
// //     const employee = await EmployeeModel.findById(id);
// //     if (!employee) {
// //       return res.status(400).json({ err: "Employee not found" });
// //     }

// //     // Get all days in the month
// //     const daysInMonth = targetMonth.daysInMonth();
// //     const startOfMonth = targetMonth.startOf('month');
// //     const endOfMonth = targetMonth.endOf('month');
// //     let absenceCount = 0;

// //     // Get existing attendance records for the month
// //     const existingAttendance = await AttendanceModel.find({
// //       employee: id,
// //       attendanceDate: {
// //         $gte: startOfMonth.toDate(),
// //         $lte: endOfMonth.toDate()
// //       }
// //     });

// //     // Convert existing attendance dates to a Set for quick lookup
// //     const attendanceDates = new Set(
// //       existingAttendance.map(record =>
// //         moment(record.attendanceDate).format('YYYY-MM-DD')
// //       )
// //     );

// //     // Get holidays for the month
// //     const holidays = await HolidayModel.find({
// //       date: {
// //         $gte: startOfMonth.toDate(),
// //         $lte: endOfMonth.toDate()
// //       }
// //     });
// //     const holidayDates = new Set(
// //       holidays.map(holiday => moment(holiday.date).format('YYYY-MM-DD'))
// //     );

// //     // Process each day in the month
// //     const attendanceRecords = [];
// //     for (let day = 1; day <= daysInMonth; day++) {
// //       const currentDate = moment(targetMonth).date(day);
// //       const dateString = currentDate.format('YYYY-MM-DD');

// //       // Skip if attendance already exists
// //       if (attendanceDates.has(dateString)) {
// //         continue;
// //       }

// //       // Skip Sundays
// //       if (currentDate.day() === 0) {
// //         continue;
// //       }

// //       // Skip holidays
// //       if (holidayDates.has(dateString)) {
// //         continue;
// //       }

// //       // Check for off Saturdays (alternate Saturdays)
// //       const referenceDate = moment("2023-01-07", "YYYY-MM-DD");
// //       const weeksDiff = currentDate.diff(referenceDate, 'weeks');
// //       const isSaturday = currentDate.day() === 6;
// //       const isOffSaturday = isSaturday && (weeksDiff % 2 === 1);
// //       if (isOffSaturday) {
// //         continue;
// //       }

// //       // If we reach here, mark as absent
// //       attendanceRecords.push({
// //         employee: id,
// //         attendanceDate: currentDate.toDate(),
// //         status: "Absence",
// //         timeIn: null,
// //         timeOut: null,
// //         lateBy: 0,
// //         totalHours: 0
// //       });
// //       absenceCount++;
// //     }

// //     // Bulk insert absence records
// //     if (attendanceRecords.length > 0) {
// //       await AttendanceModel.insertMany(attendanceRecords);
// //     }

// //     // Return success response
// //     return res.status(200).json({
// //       msg: `Absences marked successfully for ${employee.name} in ${month}. ${absenceCount} absence records created.`
// //     });

// //   } catch (error) {
// //     console.error("Error marking absences for month:", error);
// //     return res.status(500).json({ err: "Internal Server Error", error: error.message });
// //   }
// // };

// @Request   POST
// @Route     /api/attendance/mark-absences-month/:employeeId/:month
// @Access    Private (Admin only)
// const markAbsencesForMonth = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Extract employeeId and month from request params
//     const { id: employeeId, month } = req.params;

//     // Validate inputs
//     if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
//       return res.status(400).json({ err: "Valid Employee ID is required" });
//     }
//     if (!month) {
//       return res.status(400).json({ err: "Month is required" });
//     }

//     // Validate month format (should be YYYY-MM)
//     const targetMonth = moment(month, "YYYY-MM", true); // Strict parsing
//     if (!targetMonth.isValid()) {
//       return res.status(400).json({ err: "Invalid month format. Use YYYY-MM" });
//     }

//     // Prevent marking absences for future months
//     const currentMonth = moment().startOf('month');
//     if (targetMonth.isAfter(currentMonth)) {
//       return res.status(400).json({ err: "Cannot mark absences for future months" });
//     }

//     // Verify employee exists
//     const employee = await EmployeeModel.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({ err: "Employee not found" });
//     }

//     // Get all days in the month
//     const daysInMonth = targetMonth.daysInMonth();
//     const startOfMonth = targetMonth.startOf("month");
//     const endOfMonth = targetMonth.endOf("month");

//     // Get existing attendance records for the month (includes leaves)
//     const existingAttendance = await AttendanceModel.find({
//       employee: employeeId,
//       attendanceDate: {
//         $gte: startOfMonth.toDate(),
//         $lte: endOfMonth.toDate(),
//       },
//     });

//     // Convert existing attendance dates to a Set for quick lookup
//     const attendanceDates = new Set(
//       existingAttendance.map((record) => moment(record.attendanceDate).format("YYYY-MM-DD"))
//     );

//     // Get holidays for the month
//     const holidays = await HolidayModel.find({
//       date: {
//         $gte: startOfMonth.toDate(),
//         $lte: endOfMonth.toDate(),
//       },
//     });
//     const holidayDates = new Set(
//       holidays.map((holiday) => moment(holiday.date).format("YYYY-MM-DD"))
//     );

//     // Process each day in the month
//     const attendanceRecords = [];
//     let absenceCount = 0;

//     for (let day = 1; day <= daysInMonth; day++) {
//       const currentDate = moment(targetMonth).date(day);
//       const dateString = currentDate.format("YYYY-MM-DD");

//       // Skip if any attendance record exists (including leaves)
//       if (attendanceDates.has(dateString)) {
//         continue;
//       }

//       // Skip Sundays (weekends)
//       if (currentDate.day() === 0) {
//         continue;
//       }

//       // Skip holidays
//       if (holidayDates.has(dateString)) {
//         continue;
//       }

//       // Skip alternate (off) Saturdays
//       const isSaturday = currentDate.day() === 6;
//       if (isSaturday) {
//         const referenceDate = moment("2023-01-07", "YYYY-MM-DD"); // Adjust if needed
//         const weeksDiff = currentDate.diff(referenceDate, "weeks");
//         const isOffSaturday = weeksDiff % 2 === 1; // Every other Saturday is off
//         if (isOffSaturday) {
//           continue;
//         }
//       }

//       // If we reach here, it’s a working day without an attendance log, mark as absent
//       attendanceRecords.push({
//         employee: employeeId,
//         employeeModell: "employeeModel", // Match AttendanceSchema default
//         attendanceDate: currentDate.toDate(),
//         status: "Absence",
//         timeIn: null,
//         timeOut: null,
//         lateBy: 0,
//         totalHours: 0,
//         previousAttendance: [],
//       });
//       absenceCount++;
//     }

//     // Bulk insert absence records within transaction
//     if (attendanceRecords.length > 0) {
//       await AttendanceModel.insertMany(attendanceRecords, { session });
//     }

//     await session.commitTransaction();
//     return res.status(200).json({
//       msg: `Absences marked successfully for ${employee.name} in ${month}. ${absenceCount} absence records created.`,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Error marking absences for month:", error);
//     return res.status(500).json({ err: "Internal Server Error", details: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// @Request   POST
// @Route     /api/attendance/mark-absences-month/:id/:month
// @Access    Private (Admin only)
// const markAbsencesForMonth = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Extract employeeId and month from request params
//     const { id, month } = req.params;
//     // dumy month === 2025-03

//     // Validate inputs
//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ err: "Valid Employee ID is required" });
//     }
//     if (!month) {
//       return res.status(400).json({ err: "Month is required" });
//     }

//     // Validate month format (should be YYYY-MM)
//     const targetMonth = moment(month, "YYYY-MM", true); // Strict parsing
//     if (!targetMonth.isValid()) {
//       return res.status(400).json({ err: "Invalid month format. Use YYYY-MM" });
//     }

//     // Prevent marking absences for future months
//     const currentMonth = moment().startOf("month");
//     if (targetMonth.isAfter(currentMonth)) {
//       return res
//         .status(400)
//         .json({ err: "Cannot mark absences for future months" });
//     }

//     // Verify employee exists
//     const employee = await EmployeeModel.findById(id);
//     if (!employee) {
//       return res.status(404).json({ err: "Employee not found" });
//     }
//     // Get all days in the month
//     const daysInMonth = targetMonth.daysInMonth();
//     const startOfMonth = targetMonth.startOf("month");
//     const endOfMonth = targetMonth.endOf("month");
    
//     const ExistingLeavesRecords = await LeaveModel.find({
//        employee,
//        status: "Approved",
//        $or: [{ startDate: { $lte: endOfMonth }, endDate: { $gte: startOfMonth } }],
//      });
//     // Process each day in the month
//     const attendanceRecords = [];
//     let absenceCount = 0;

//     for (let day = 1; day <= daysInMonth; day++) {
//       const currentDate = moment(targetMonth).date(day);
//       const dateString = currentDate.format("YYYY-MM-DD");

//       // Check if an attendance record exists for this employee on the target date
//       const existingAttendance = await AttendanceModel.find({
//         employee: id,
//         attendanceDate: dateString,
//       });

//        // Check if an attendance record exists for this employee on the target date
//        const holidayDates = await HolidayModel.find({
//         date: dateString,
//       });


//       // Skip if  attendance record exists (e.g., "On Time", "Late", "Absence")
//       if (existingAttendance.length > 0) {
//         continue;
//       }

//       // Explicitly skip leave dates (even if no other attendance record exists)
//       if (ExistingLeavesRecords.has(dateString)) {
//         continue;
//       }

//       // Skip holidays
//       if (holidayDates.has(dateString)) {
//         continue;
//       }

//       // Skip Sundays (weekends)
//       if (currentDate.day() === 0) {
//         continue;
//       }

//       // Skip alternate (off) Saturdays
//       const isSaturday = currentDate.day() === 6;
//       if (isSaturday) {
//         const saturdayNumber = Math.ceil(currentDate.date() / 7); // 1st, 2nd, 3rd, etc.
//         if (saturdayNumber % 2 === 0) {
//           // Even Saturdays (2nd, 4th) are off
//           continue;
//         }
//       }

//       // Move to the next day
//       // currentDate.setDate(currentDate.getDate() + 1);

//       // If we reach here, it’s a working day without an attendance log or leave, mark as absent
//       attendanceRecords.push({
//         employee: employeeId,
//         employeeModell: "employeeModel", // Match AttendanceSchema default
//         attendanceDate: currentDate.toDate(),
//         status: "Absence",
//         timeIn: null,
//         timeOut: null,
//         lateBy: 0,
//         totalHours: 0,
//         previousAttendance: [],
//       });
//       absenceCount++;
//     }

//     // Bulk insert absence records within transaction
//     if (attendanceRecords.length > 0) {
//       await AttendanceModel.insertMany(attendanceRecords, { session });
//     }

//     await session.commitTransaction();
//     return res.status(200).json({
//       msg: `Absences marked successfully for ${employee.name} in ${month}. ${absenceCount} absence records created.`,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Error marking absences for month:", error);
//     return res
//       .status(500)
//       .json({ err: "Internal Server Error", details: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// // @Request   POST
// // @Route     /api/attendance/mark-absences-month/:id/:month
// // @Access    Private (Admin only)
// const markAbsencesForMonth = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   // Extract employeeId and month from request params
//   const { id, month } = req.params;

//   // Validate inputs
//   if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({ err: "Valid Employee ID is required" });
//   }
//   if (!month) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({ err: "Month is required" });
//   }

//   // Validate month format (should be YYYY-MM)
//   const targetMonth = moment(month, "YYYY-MM", true); // Strict parsing
//   if (!targetMonth.isValid()) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({ err: "Invalid month format. Use YYYY-MM" });
//   }

//   // Prevent marking absences for future months
//   const currentMonth = moment().startOf("month");
//   if (targetMonth.isAfter(currentMonth)) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({ err: "Cannot mark absences for future months" });
//   }

//   // Verify employee exists
//   const employee = await EmployeeModel.findById(id).session(session);
//   if (!employee) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(404).json({ err: "Employee not found" });
//   }

//   // Get all days in the month
//   const daysInMonth = targetMonth.daysInMonth();
//   const startOfMonth = targetMonth.startOf("month");
//   const endOfMonth = targetMonth.endOf("month");

//   // Fetch existing data outside the loop
//   let existingAttendance, holidays, approvedLeaves;
//   try {
//     [existingAttendance, holidays, approvedLeaves] = await Promise.all([
//       AttendanceModel.find({
//         employee: id,
//         attendanceDate: {
//           $gte: startOfMonth.toDate(),
//           $lte: endOfMonth.toDate(),
//         },
//       }).session(session),
//       HolidayModel.find({
//         date: {
//           $gte: startOfMonth.toDate(),
//           $lte: endOfMonth.toDate(),
//         },
//       }).session(session),
//       LeaveModel.find({
//         employee: id,
//         status: "Approved",
//         $or: [
//           { startDate: { $lte: endOfMonth.toDate() } },
//           { endDate: { $gte: startOfMonth.toDate() } },
//         ],
//       }).session(session),
//     ]);
//   } catch (fetchError) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(500).json({ err: "Failed to fetch existing records: " + fetchError.message });
//   }

//   // Check if fetching attendance failed
//   if (!Array.isArray(existingAttendance)) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(500).json({ err: "Failed to fetch existing attendance records" });
//   }

//   // Create Sets for efficient lookup
//   const attendanceDates = new Set(
//     existingAttendance.map((record) =>
//       moment(record.attendanceDate).format("YYYY-MM-DD")
//     )
//   );
//   const holidayDates = new Set(
//     holidays.map((holiday) => moment(holiday.date).format("YYYY-MM-DD"))
//   );
//   const leaveDates = new Set();
//   approvedLeaves.forEach((leave) => {
//     const start = moment(leave.startDate);
//     const end = moment(leave.endDate);
//     for (
//       let date = start.clone();
//       date.isSameOrBefore(end);
//       date.add(1, "day")
//     ) {
//       leaveDates.add(date.format("YYYY-MM-DD"));
//     }
//   });

//   // Process each day in the month
//   const attendanceRecords = [];
//   let absenceCount = 0;

//   for (let day = 1; day <= daysInMonth; day++) {
//     const currentDate = moment(targetMonth).date(day);
//     const dateString = currentDate.format("YYYY-MM-DD");

//     // Skip if attendance exists (any status)
//     if (attendanceDates.has(dateString)) {
//       continue;
//     }

//     // Skip approved leave dates
//     if (leaveDates.has(dateString)) {
//       continue;
//     }

//     // Skip Sundays (weekends)
//     if (currentDate.day() === 0) {
//       continue;
//     }

//     // Skip holidays
//     if (holidayDates.has(dateString)) {
//       continue;
//     }

//     // Skip alternate (off) Saturdays
//     const isSaturday = currentDate.day() === 6;
//     if (isSaturday) {
//       const saturdayNumber = Math.ceil(currentDate.date() / 7); // 1st, 2nd, 3rd, etc.
//       if (saturdayNumber % 2 === 0) {
//         // Even Saturdays (2nd, 4th) are off
//         continue;
//       }
//     }

//     // Mark as absent
//     attendanceRecords.push({
//       employee: id,
//       employeeModell: "employeeModel",
//       attendanceDate: currentDate.toDate(),
//       status: "Absence",
//       timeIn: null,
//       timeOut: null,
//       lateBy: 0,
//       totalHours: 0,
//       previousAttendance: [],
//     });
//     absenceCount++;
//   }

//   // Bulk insert absence records within transaction
//   if (attendanceRecords.length > 0) {
//     try {
//       await AttendanceModel.insertMany(attendanceRecords, { session });
//     } catch (insertError) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(500).json({ err: "Failed to insert absence records: " + insertError.message });
//     }
//   }

//   await session.commitTransaction();
//   session.endSession();
//   return res.status(200).json({
//     msg: `Absences marked successfully for ${employee.employeeName || "Unknown Employee"} in ${month}. ${absenceCount} absence records created.`,
//     data: { absenceCount },
//   });
// };


// // @Request   POST
// // @Route     /api/attendance/mark-absences-month/:id/:month
// // @Access    Private (Admin only)
// const markAbsencesForMonth = async (req, res) => {
//   let session;
//   try {
//     // Start MongoDB session and transaction
//     session = await mongoose.startSession();
//     session.startTransaction();

//     // Extract employeeId and month from request params
//     const { id, month } = req.params;

//     // Validate inputs
//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       throw new Error("Valid Employee ID is required");
//     }
//     if (!month) {
//       throw new Error("Month is required");
//     }

//     // Validate month format (should be YYYY-MM)
//     const targetMonth = moment(month, "YYYY-MM", true); // Strict parsing
//     if (!targetMonth.isValid()) {
//       throw new Error("Invalid month format. Use YYYY-MM");
//     }

//     // Prevent marking absences for future months
//     const currentMonth = moment().startOf("month");
//     if (targetMonth.isAfter(currentMonth)) {
//       throw new Error("Cannot mark absences for future months");
//     }

//     // Verify employee exists
//     const employee = await EmployeeModel.findById(id).session(session);
//     if (!employee) {
//       throw new Error("Employee not found");
//     }

//     // Get all days in the month
//     const daysInMonth = targetMonth.daysInMonth();
//     const startOfMonth = targetMonth.startOf("month");
//     const endOfMonth = targetMonth.endOf("month");

//     // Fetch existing data
//     const [existingAttendance, holidays, approvedLeaves] = await Promise.all([
//       AttendanceModel.find({
//         employee: id,
//         attendanceDate: {
//           $gte: startOfMonth.toDate(),
//           $lte: endOfMonth.toDate(),
//         },
//       }).session(session),
//       HolidayModel.find({
//         date: {
//           $gte: startOfMonth.toDate(),
//           $lte: endOfMonth.toDate(),
//         },
//       }).session(session),
//       LeaveModel.find({
//         employee: id,
//         status: "Approved",
//         $or: [
//           { startDate: { $lte: endOfMonth.toDate() } },
//           { endDate: { $gte: startOfMonth.toDate() } },
//         ],
//       }).session(session),
//     ]);

//     // Validate fetched data
//     if (!Array.isArray(existingAttendance)) {
//       throw new Error("Failed to fetch existing attendance records");
//     }

//     // Create Sets for efficient lookup
//     const attendanceDates = new Set(
//       existingAttendance.map((record) =>
//         moment(record.attendanceDate).format("YYYY-MM-DD")
//       )
//     );
//     const holidayDates = new Set(
//       holidays.map((holiday) => moment(holiday.date).format("YYYY-MM-DD"))
//     );
//     const leaveDates = new Set();
//     approvedLeaves.forEach((leave) => {
//       const start = moment(leave.startDate);
//       const end = moment(leave.endDate);
//       for (
//         let date = start.clone();
//         date.isSameOrBefore(end);
//         date.add(1, "days")
//       ) {
//         leaveDates.add(date.format("YYYY-MM-DD"));
//       }
//     });

//     // Process each day in the month
//     const attendanceRecords = [];
//     let absenceCount = 0;

//     for (let day = 1; day <= daysInMonth; day++) {
//       const currentDate = targetMonth.clone().date(day); // Use clone to avoid mutating targetMonth
//       const dateString = currentDate.format("YYYY-MM-DD");

//       // Skip if any attendance record exists (Present, Absence, etc.)
//       if (attendanceDates.has(dateString)) {
//         continue;
//       }

//       // Skip approved leave dates
//       if (leaveDates.has(dateString)) {
//         continue;
//       }

//       // Skip Sundays (weekends)
//       if (currentDate.day() === 0) {
//         continue;
//       }

//       // Skip holidays
//       if (holidayDates.has(dateString)) {
//         continue;
//       }

//       // Skip alternate (off) Saturdays
//       const isSaturday = currentDate.day() === 6;
//       if (isSaturday) {
//         const saturdayNumber = Math.ceil(day / 7); // Use day directly
//         if (saturdayNumber % 2 === 0) {
//           continue; // Even Saturdays (2nd, 4th) are off
//         }
//       }

//       // Mark as absent
//       attendanceRecords.push({
//         employee: id,
//         attendanceDate: currentDate.toDate(),
//         status: "Absence",
//         timeIn: null,
//         timeOut: null,
//         lateBy: 0,
//         totalHours: 0,
//         previousAttendance: [],
//       });
//       absenceCount++;
//     }

//     // Bulk insert absence records within transaction
//     if (attendanceRecords.length > 0) {
//       await AttendanceModel.insertMany(attendanceRecords, { session });
//     }

//     // Commit transaction
//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({
//       msg: `Absences marked successfully for ${employee.employeeName || "Unknown Employee"} in ${month}. ${absenceCount} absence records created.`,
//       data: { absenceCount },
//     });
//   } catch (error) {
//     if (session) {
//       await session.abortTransaction();
//       session.endSession();
//     }
//     const statusCode = error.message === "Employee not found" ? 404 : 400;
//     return res.status(statusCode).json({ err: error.message });
//   }
// };

// // @Request   POST
// // @Route     /api/attendance/mark-absences-month/:id/:month
// // @Access    Private (Admin only)
// const markAbsencesForMonth = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { id, month } = req.params;

//     // Validate inputs
//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ success: false, error: "Valid Employee ID is required" });
//     }
//     if (!month) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ success: false, error: "Month is required" });
//     }

//     const targetMonth = moment(month, "YYYY-MM", true);
//     if (!targetMonth.isValid()) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ success: false, error: "Invalid month format. Use YYYY-MM" });
//     }

//     const currentMonth = moment().startOf("month");
//     if (targetMonth.isAfter(currentMonth)) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ success: false, error: "Cannot mark absences for future months" });
//     }

//     const employee = await EmployeeModel.findById(id).session(session);
//     if (!employee) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ success: false, error: "Employee not found" });
//     }

//     const daysInMonth = targetMonth.daysInMonth();
//     const startOfMonth = targetMonth.startOf("month");
//     const endOfMonth = targetMonth.endOf("month");

//     // Fetch existing data
//     const [existingAttendance, holidays, approvedLeaves] = await Promise.all([
//       AttendanceModel.find({
//         employee: id,
//         attendanceDate: {
//           $gte: startOfMonth.toDate(),
//           $lte: endOfMonth.toDate(),
//         },
//       }).session(session),
//       HolidayModel.find({
//         date: {
//           $gte: startOfMonth.toDate(),
//           $lte: endOfMonth.toDate(),
//         },
//       }).session(session),
//       LeaveModel.find({
//         employee: id,
//         status: "Approved",
//         $or: [
//           { startDate: { $lte: endOfMonth.toDate() } },
//           { endDate: { $gte: startOfMonth.toDate() } },
//         ],
//       }).session(session),
//     ]);

//     // Log fetched data for debugging
//     console.log("Existing Attendance:", existingAttendance.length, existingAttendance.map(r => moment(r.attendanceDate).format("YYYY-MM-DD")));
//     console.log("Holidays:", holidays.length, holidays.map(h => moment(h.date).format("YYYY-MM-DD")));
//     console.log("Approved Leaves:", approvedLeaves.length);

//     // Create Sets for efficient lookup
//     const attendanceDates = new Set(
//       existingAttendance.map((record) =>
//         moment(record.attendanceDate).format("YYYY-MM-DD")
//       )
//     );
//     const holidayDates = new Set(
//       holidays.map((holiday) => moment(holiday.date).format("YYYY-MM-DD"))
//     );
//     const leaveDates = new Set();
//     approvedLeaves.forEach((leave) => {
//       const start = moment(leave.startDate).startOf("day");
//       const end = moment(leave.endDate).startOf("day");
//       for (
//         let date = start.clone();
//         date.isSameOrBefore(end, "day");
//         date.add(1, "day")
//       ) {
//         leaveDates.add(date.format("YYYY-MM-DD"));
//       }
//     });

//     // Process each day in the month
//     const attendanceRecords = [];
//     let absenceCount = 0;

//     for (let day = 1; day <= daysInMonth; day++) {
//       const currentDate = moment(targetMonth).date(day);
//       const dateString = currentDate.format("YYYY-MM-DD");

//       // Log each day's decision
//       console.log(`Processing ${dateString}:`);

//       // Skip if any attendance record exists
//       if (attendanceDates.has(dateString)) {
//         console.log(`  - Skipped: Existing attendance`);
//         continue;
//       }

//       // Skip approved leave dates
//       if (leaveDates.has(dateString)) {
//         console.log(`  - Skipped: On leave`);
//         continue;
//       }

//       // Skip Sundays
//       if (currentDate.day() === 0) {
//         console.log(`  - Skipped: Sunday`);
//         continue;
//       }

//       // Skip holidays
//       if (holidayDates.has(dateString)) {
//         console.log(`  - Skipped: Holiday`);
//         continue;
//       }

//       // Skip even-numbered Saturdays
//       const isSaturday = currentDate.day() === 6;
//       if (isSaturday) {
//         const saturdayNumber = Math.ceil(currentDate.date() / 7);
//         if (saturdayNumber % 2 === 0) {
//           console.log(`  - Skipped: Even Saturday`);
//           continue;
//         }
//       }

//       // Mark as absent
//       console.log(`  - Marked as Absent`);
//       attendanceRecords.push({
//         employee: id,
//         employeeModell: "employeeModel",
//         attendanceDate: currentDate.toDate(),
//         status: "Absence",
//         timeIn: null,
//         timeOut: null,
//         lateBy: 0,
//         totalHours: 0,
//         previousAttendance: [],
//       });
//       absenceCount++;
//     }

//     // Bulk insert absence records
//     if (attendanceRecords.length > 0) {
//       await AttendanceModel.insertMany(attendanceRecords, { session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({
//       success: true,
//       msg: `Absences marked successfully for ${
//         employee.employeeName || "Unknown Employee"
//       } in ${month}. ${absenceCount} absence records created.`,
//       data: { absenceCount },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error marking absences:", error);
//     return res.status(500).json({
//       success: false,
//       error: error.message || "Internal Server Error",
//     });
//   }
// };
// @Request   POST
// @Route     /api/attendance/mark-absences-month/:id/:month
// @Access    Private (Admin only)
// const markAbsencesForMonth = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { id, month } = req.params;

//     // Validate inputs
//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ success: false, error: "Valid Employee ID is required" });
//     }
//     if (!month) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ success: false, error: "Month is required" });
//     }

//     const targetMonth = moment(month, "YYYY-MM", true);
//     if (!targetMonth.isValid()) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ success: false, error: "Invalid month format. Use YYYY-MM" });
//     }

//     const currentMonth = moment().startOf("month");
//     if (targetMonth.isAfter(currentMonth)) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ success: false, error: "Cannot mark absences for future months" });
//     }

//     const employee = await EmployeeModel.findById(id).session(session);
//     if (!employee) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ success: false, error: "Employee not found" });
//     }

//     const daysInMonth = targetMonth.daysInMonth();
//     const startOfMonth = targetMonth.startOf("month");
//     const endOfMonth = targetMonth.endOf("month");

//     // Fetch existing data
//     const [existingAttendance, holidays, approvedLeaves] = await Promise.all([
//       AttendanceModel.find({
//         employee: id,
//         attendanceDate: {
//           $gte: startOfMonth.toDate(),
//           $lte: endOfMonth.toDate(),
//         },
//       }).session(session),
//       HolidayModel.find({
//         date: {
//           $gte: startOfMonth.toDate(),
//           $lte: endOfMonth.toDate(),
//         },
//       }).session(session),
//       LeaveModel.find({
//         employee: id,
//         status: "Approved",
//         $or: [
//           { startDate: { $lte: endOfMonth.toDate() } },
//           { endDate: { $gte: startOfMonth.toDate() } },
//         ],
//       }).session(session),
//     ]);

//     // Create Sets for efficient lookup
//     const attendanceDates = new Set(
//       existingAttendance.map((record) =>
//         moment(record.attendanceDate).startOf("day").format("YYYY-MM-DD")
//       )
//     );
//     const holidayDates = new Set(
//       holidays.map((holiday) =>
//         moment(holiday.date).startOf("day").format("YYYY-MM-DD")
//       )
//     );
//     const leaveDates = new Set();
//     approvedLeaves.forEach((leave) => {
//       const start = moment(leave.startDate).startOf("day");
//       const end = moment(leave.endDate).startOf("day");
//       for (
//         let date = start.clone();
//         date.isSameOrBefore(end, "day");
//         date.add(1, "day")
//       ) {
//         leaveDates.add(date.format("YYYY-MM-DD"));
//       }
//     });

//     // Process each day in the month
//     const attendanceRecords = [];
//     let absenceCount = 0;

//     for (let day = 1; day <= daysInMonth; day++) {
//       const currentDate = moment(targetMonth).date(day).startOf("day");
//       const dateString = currentDate.format("YYYY-MM-DD");

//       // Skip if any attendance record exists (regardless of status)
//       if (attendanceDates.has(dateString)) {
//         continue;
//       }

//       // Skip approved leave dates
//       if (leaveDates.has(dateString)) {
//         continue;
//       }

//       // Skip Sundays
//       if (currentDate.day() === 0) {
//         continue;
//       }

//       // Skip holidays
//       if (holidayDates.has(dateString)) {
//         continue;
//       }

//       // Skip even-numbered Saturdays
//       const isSaturday = currentDate.day() === 6;
//       if (isSaturday) {
//         const saturdayNumber = Math.ceil(currentDate.date() / 7);
//         if (saturdayNumber % 2 === 0) {
//           continue;
//         }
//       }

//       // Mark as absent only if no prior record exists
//       attendanceRecords.push({
//         employee: id,
//         employeeModell: "employeeModel",
//         attendanceDate: currentDate.toDate(),
//         status: "Absence",
//         timeIn: null,
//         timeOut: null,
//         lateBy: 0,
//         totalHours: 0,
//         previousAttendance: [],
//       });
//       absenceCount++;
//     }

//     // Bulk insert absence records
//     if (attendanceRecords.length > 0) {
//       await AttendanceModel.insertMany(attendanceRecords, { session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({
//       success: true,
//       msg: `Absences marked successfully for ${
//         employee.employeeName || "Unknown Employee"
//       } in ${month}. ${absenceCount} absence records created.`,
//       data: { absenceCount },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error marking absences:", error);
//     return res.status(500).json({
//       success: false,
//       error: error.message || "Internal Server Error",
//     });
//   }
// };
const markAbsencesForMonth = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id, month } = req.params;

    // Validate inputs
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: "Valid Employee ID is required" });
    }
    if (!month) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: "Month is required" });
    }

    const targetMonth = moment(month, "YYYY-MM", true).startOf("month");
    if (!targetMonth.isValid()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: "Invalid month format. Use YYYY-MM" });
    }

    const currentMonth = moment().startOf("month");
    if (targetMonth.isAfter(currentMonth)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: "Cannot mark absences for future months" });
    }

    const employee = await EmployeeModel.findById(id).session(session);
    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const daysInMonth = targetMonth.daysInMonth();
    const startOfMonth = targetMonth.clone().startOf("month").toDate();
    const endOfMonth = targetMonth.clone().endOf("month").startOf("day").toDate();

    // Fetch existing data with midnight-normalized dates
    const [existingAttendance, holidays, approvedLeaves] = await Promise.all([
      AttendanceModel.find({
        employee: id,
        attendanceDate: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      }).session(session),
      HolidayModel.find({
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      }).session(session),
      LeaveModel.find({
        employee: id,
        status: "Approved",
        $or: [
          { startDate: { $lte: endOfMonth } },
          { endDate: { $gte: startOfMonth } },
        ],
      }).session(session),
    ]);

    // Create Sets for efficient lookup with midnight-normalized dates
    const attendanceDates = new Set(
      existingAttendance.map((record) =>
        moment(record.attendanceDate).startOf("day").format("YYYY-MM-DD")
      )
    );
    const holidayDates = new Set(
      holidays.map((holiday) =>
        moment(holiday.date).startOf("day").format("YYYY-MM-DD")
      )
    );
    const leaveDates = new Set();
    approvedLeaves.forEach((leave) => {
      const start = moment(leave.startDate).startOf("day");
      const end = moment(leave.endDate).startOf("day");
      for (
        let date = start.clone();
        date.isSameOrBefore(end, "day");
        date.add(1, "day")
      ) {
        leaveDates.add(date.format("YYYY-MM-DD"));
      }
    });

    // Process each day in the month with midnight-normalized dates
    const attendanceRecords = [];
    let absenceCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = moment(targetMonth).date(day).startOf("day");
      const dateString = currentDate.format("YYYY-MM-DD");

      // Skip if any attendance record exists (regardless of status)
      if (attendanceDates.has(dateString)) {
        continue;
      }

      // Skip approved leave dates
      if (leaveDates.has(dateString)) {
        continue;
      }

      // Skip Sundays
      if (currentDate.day() === 0) {
        continue;
      }

      // Skip holidays
      if (holidayDates.has(dateString)) {
        continue;
      }

      // Skip even-numbered Saturdays
      const isSaturday = currentDate.day() === 6;
      if (isSaturday) {
        const saturdayNumber = Math.ceil(currentDate.date() / 7);
        if (saturdayNumber % 2 === 0) {
          continue;
        }
      }

      // Mark as absent only if no prior record exists, store date at midnight
      attendanceRecords.push({
        employee: id,
        employeeModell: "employeeModel",
        attendanceDate: currentDate.startOf("day").toDate(), // Ensure midnight
        status: "Absence",
        timeIn: null,
        timeOut: null,
        lateBy: 0,
        totalHours: 0,
        previousAttendance: [],
      });
      absenceCount++;
    }

    // Bulk insert absence records
    if (attendanceRecords.length > 0) {
      await AttendanceModel.insertMany(attendanceRecords, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      msg: `Absences marked successfully for ${
        employee.employeeName || "Unknown Employee"
      } in ${month}. ${absenceCount} absence records created.`,
      data: { absenceCount },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error marking absences:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

// Export the controller
module.exports = { markAbsencesForDate, markAbsencesForMonth };
