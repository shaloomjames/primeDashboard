// Import necessary modules (assuming they are available in the project)
const moment = require('moment');
const mongoose = require("mongoose");
const EmployeeModel = require('../models/EmployeeModel');
const AttendanceModel = require('../models/AttendanceModel');
const HolidayModel = require('../models/HolidayModel');

// Mark Absences for a Specific Date
// @Request   POST
// @Route     /api/attendance/mark-absences
// @Access    Private (Admin only)
const   markAbsencesForDate = async (req, res) => {
  try {
    // Extract date from request body
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ err: "Date is required" });
    }

    // Parse and validate the date
    const targetDate = moment(date, "YYYY-MM-DD");
    if (!targetDate.isValid()) {
      return res.status(400).json({ err: "Invalid date format. Use YYYY-MM-DD" });
    }

    // Prevent marking absences for future dates
    const today = moment().startOf('day');
    if (targetDate.isAfter(today)) {
      return res.status(400).json({ err: "Cannot mark absences for future dates" });
    }

    // Check if the date is a Sunday (day 0)
    if (targetDate.day() === 0) {
      return res.status(400).json({ err: "The specified date is a Sunday, which is not a working day" });
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
    const weeksDiff = targetDate.diff(referenceDate, 'weeks');
    const isSaturday = targetDate.day() === 6;
    const isOffSaturday = isSaturday && (weeksDiff % 2 === 1); // Odd weeks are off

    if (isOffSaturday) {
      return res.status(400).json({ err: "The specified date is an off Saturday, which is not a working day" });
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
        attendanceDate: targetDate.toDate()
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
          totalHours: 0
        });
        absenceCount++;
      }
    }

    // Return success response
    return res.status(200).json({
      msg: `Absences marked successfully. ${absenceCount} absence records created.`
    });

  } catch (error) {
    console.error("Error marking absences:", error);
    return res.status(500).json({ err: "Internal Server Error", error: error.message });
  }
};

// // Mark Absences for a Month for a Specific Employee
// // @Request   POST
// // @Route     /api/attendance/mark-absences-month/:employeeId/:month
// // @Access    Private (Admin only)
// const markAbsencesForMonth = async (req, res) => {
//   try {
//     // Extract employeeId and month from request params
//     const { id, month } = req.params;

//     // Validate inputs
//     if (!id) {
//       return res.status(400).json({ err: "Employee ID is required" });
//     }
//     if (!month) {
//       return res.status(400).json({ err: "Month is required" });
//     }

//     // Validate month format (should be YYYY-MM)
//     const targetMonth = moment(month, "YYYY-MM");
//     if (!targetMonth.isValid()) {
//       return res.status(400).json({ err: "Invalid month format. Use YYYY-MM" });
//     }

//     // Prevent marking absences for future months
//     const currentMonth = moment().startOf('month');
//     if (targetMonth.isAfter(currentMonth)) {
//       return res.status(400).json({ err: "Cannot mark absences for future months" });
//     }

//     // Verify employee exists
//     const employee = await EmployeeModel.findById(id);
//     if (!employee) {
//       return res.status(400).json({ err: "Employee not found" });
//     }

//     // Get all days in the month
//     const daysInMonth = targetMonth.daysInMonth();
//     const startOfMonth = targetMonth.startOf('month');
//     const endOfMonth = targetMonth.endOf('month');
//     let absenceCount = 0;

//     // Get existing attendance records for the month
//     const existingAttendance = await AttendanceModel.find({
//       employee: id,
//       attendanceDate: {
//         $gte: startOfMonth.toDate(),
//         $lte: endOfMonth.toDate()
//       }
//     });

//     // Convert existing attendance dates to a Set for quick lookup
//     const attendanceDates = new Set(
//       existingAttendance.map(record => 
//         moment(record.attendanceDate).format('YYYY-MM-DD')
//       )
//     );

//     // Get holidays for the month
//     const holidays = await HolidayModel.find({
//       date: {
//         $gte: startOfMonth.toDate(),
//         $lte: endOfMonth.toDate()
//       }
//     });
//     const holidayDates = new Set(
//       holidays.map(holiday => moment(holiday.date).format('YYYY-MM-DD'))
//     );

//     // Process each day in the month
//     const attendanceRecords = [];
//     for (let day = 1; day <= daysInMonth; day++) {
//       const currentDate = moment(targetMonth).date(day);
//       const dateString = currentDate.format('YYYY-MM-DD');

//       // Skip if attendance already exists
//       if (attendanceDates.has(dateString)) {
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

//       // Check for off Saturdays (alternate Saturdays)
//       const referenceDate = moment("2023-01-07", "YYYY-MM-DD");
//       const weeksDiff = currentDate.diff(referenceDate, 'weeks');
//       const isSaturday = currentDate.day() === 6;
//       const isOffSaturday = isSaturday && (weeksDiff % 2 === 1);
//       if (isOffSaturday) {
//         continue;
//       }

//       // If we reach here, mark as absent
//       attendanceRecords.push({
//         employee: id,
//         attendanceDate: currentDate.toDate(),
//         status: "Absence",
//         timeIn: null,
//         timeOut: null,
//         lateBy: 0,
//         totalHours: 0
//       });
//       absenceCount++;
//     }

//     // Bulk insert absence records
//     if (attendanceRecords.length > 0) {
//       await AttendanceModel.insertMany(attendanceRecords);
//     }

//     // Return success response
//     return res.status(200).json({
//       msg: `Absences marked successfully for ${employee.name} in ${month}. ${absenceCount} absence records created.`
//     });

//   } catch (error) {
//     console.error("Error marking absences for month:", error);
//     return res.status(500).json({ err: "Internal Server Error", error: error.message });
//   }
// };

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
// @Route     /api/attendance/mark-absences-month/:employeeId/:month
// @Access    Private (Admin only)
const markAbsencesForMonth = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Extract employeeId and month from request params
    const { id: employeeId, month } = req.params;

    // Validate inputs
    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ err: "Valid Employee ID is required" });
    }
    if (!month) {
      return res.status(400).json({ err: "Month is required" });
    }

    // Validate month format (should be YYYY-MM)
    const targetMonth = moment(month, "YYYY-MM", true); // Strict parsing
    if (!targetMonth.isValid()) {
      return res.status(400).json({ err: "Invalid month format. Use YYYY-MM" });
    }

    // Prevent marking absences for future months
    const currentMonth = moment().startOf("month");
    if (targetMonth.isAfter(currentMonth)) {
      return res.status(400).json({ err: "Cannot mark absences for future months" });
    }

    // Verify employee exists
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ err: "Employee not found" });
    }

    // Get all days in the month
    const daysInMonth = targetMonth.daysInMonth();
    const startOfMonth = targetMonth.startOf("month");
    const endOfMonth = targetMonth.endOf("month");

    // Get existing attendance records for the month (includes leaves)
    const existingAttendance = await AttendanceModel.find({
      employee: employeeId,
      attendanceDate: {
        $gte: startOfMonth.toDate(),
        $lte: endOfMonth.toDate(),
      },
    });

    // Separate sets for quick lookup: all attendance dates and leave dates
    const attendanceDates = new Set(
      existingAttendance.map((record) => moment(record.attendanceDate).format("YYYY-MM-DD"))
    );
    const leaveDates = new Set(
      existingAttendance
        .filter((record) => record.status === "On Leave")
        .map((record) => moment(record.attendanceDate).format("YYYY-MM-DD"))
    );

    // Get holidays for the month
    const holidays = await HolidayModel.find({
      date: {
        $gte: startOfMonth.toDate(),
        $lte: endOfMonth.toDate(),
      },
    });
    const holidayDates = new Set(
      holidays.map((holiday) => moment(holiday.date).format("YYYY-MM-DD"))
    );

    // Process each day in the month
    const attendanceRecords = [];
    let absenceCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = moment(targetMonth).date(day);
      const dateString = currentDate.format("YYYY-MM-DD");

      // Skip if any attendance record exists (e.g., "On Time", "Late", "Absence")
      if (attendanceDates.has(dateString)) {
        continue;
      }

      // Explicitly skip leave dates (even if no other attendance record exists)
      if (leaveDates.has(dateString)) {
        continue;
      }

      // Skip Sundays (weekends)
      if (currentDate.day() === 0) {
        continue;
      }

      // Skip holidays
      if (holidayDates.has(dateString)) {
        continue;
      }

      // Skip alternate (off) Saturdays
      const isSaturday = currentDate.day() === 6;
      if (isSaturday) {
        const referenceDate = moment("2023-01-07", "YYYY-MM-DD"); // Adjust if needed
        const weeksDiff = currentDate.diff(referenceDate, "weeks");
        const isOffSaturday = weeksDiff % 2 === 1; // Every other Saturday is off
        if (isOffSaturday) {
          continue;
        }
      }

      // If we reach here, it’s a working day without an attendance log or leave, mark as absent
      attendanceRecords.push({
        employee: employeeId,
        employeeModell: "employeeModel", // Match AttendanceSchema default
        attendanceDate: currentDate.toDate(),
        status: "Absence",
        timeIn: null,
        timeOut: null,
        lateBy: 0,
        totalHours: 0,
        previousAttendance: [],
      });
      absenceCount++;
    }

    // Bulk insert absence records within transaction
    if (attendanceRecords.length > 0) {
      await AttendanceModel.insertMany(attendanceRecords, { session });
    }

    await session.commitTransaction();
    return res.status(200).json({
      msg: `Absences marked successfully for ${employee.name} in ${month}. ${absenceCount} absence records created.`,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error marking absences for month:", error);
    return res.status(500).json({ err: "Internal Server Error", details: error.message });
  } finally {
    session.endSession();
  }
};


// Export the controller
module.exports = { markAbsencesForDate ,markAbsencesForMonth};