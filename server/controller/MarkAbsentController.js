// Import necessary modules (assuming they are available in the project)
const moment = require('moment');
const EmployeeModel = require('../models/EmployeeModel');
const AttendanceModel = require('../models/AttendanceModel');
const HolidayModel = require('../models/HolidayModel');

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

module.exports = { markAbsencesForDate };