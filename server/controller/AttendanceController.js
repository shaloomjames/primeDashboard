const moment = require("moment");
const AttendanceModel = require("../models/AttendanceModel");
const  EmployeeModel = require("../models/EmployeeModel");


// Generate a Monthly Attendance Report
// @Request   GET
// @Route     http://localhost:5000/api/attendance//report/:employeeId/:month
// @Access    Private for admin
const getAttendanceReport = async (req, res) => {
  const { employeeId, month } = req.params; // Ex: 2024-12 for December

  // Set the start and end date of the month
  const startDate = moment(`${month}-01`).startOf("month");
  const endDate = moment(startDate).endOf("month");

  const totalDays = endDate.date(); // Total days in the month (e.g., 31 for December)

  try {
    // Fetch all attendance records for the employee within the selected month
    const attendanceLogs = await AttendanceModel.find({
      employee: employeeId,
      attendanceDate: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    }).populate("employee");

        // ** Check if no attendance records exist **
        if (attendanceLogs.length === 0) {
          // Fetch the employee's name separately if logs are empty
          const employee = await EmployeeModel.findById(employeeId);
    
          if (!employee) {
            return res.status(404).json({
              err: `Employee with ID ${employeeId} not found.`,
            });
          }
    
          return res.status(404).json({
            err: `No attendance records were found for ${employee.employeeName} for the month of ${moment(startDate).format("MMMM YYYY")}. Please check if the employee's attendance is recorded in the system for this month.`,
          });
          
        }

    // Calculate "On Time" and "Late" days
    const daysLate = attendanceLogs.filter((log) => log.status === "Late").length;
    const daysOnTime = attendanceLogs.filter((log) => log.status === "On Time").length;

    // ** Calculate Sundays in the month **
    let totalSundays = 0;
    for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, "day")) {
      if (date.day() === 0) { // 0 represents Sunday in moment.js
        totalSundays++;
      }
    }

    // ** Calculate Absent Days (exclude Sundays) ** // ** Calculate Working Days **
    const workingDays = totalDays - totalSundays; // Exclude Sundays from the total days
    const loggedDays = daysOnTime + daysLate; // Only consider days with logs
    const absentDays = workingDays - loggedDays; // Absent days exclude Sundays


    // ** Handle Late-to-Absent Conversion and Remaining Late Days **
    const calculateAbsentDays = (lates) => {
      let effectiveAbsentDays = Math.floor(lates / 3); // 3 lates convert to 1 absent day
      let remainingLates = lates % 3; // Remaining late days
      return { effectiveAbsentDays, remainingLates };
    };

    const { effectiveAbsentDays, remainingLates } = calculateAbsentDays(daysLate);

    // ** Combine Absents **
    const totalAbsentDays = Math.min(
      absentDays + effectiveAbsentDays,
      workingDays
    ); // Cap to working days

    // Send the response
    res.status(200).json({
      employee: attendanceLogs[0]?.employee,  // Include employee data (from populated model)
      reportMonth: month,
      totalDays,            // Total days in the month
      totalSundays,         // Total number of Sundays
      workingDays,          // Total working days (excluding Sundays)
      absentDays,           // Correct number of absent days (excluding Sundays)
      daysLate,             // Total late days
      daysOnTime,           // Total on-time days
      effectiveAbsentDays,    // Effective absent days due to late-to-absent conversion
      remainingLates,         // Late days left after conversion
      totalAbsentDays,        // Final total absent days (combined manual + effective)
    });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


// @Request   GET
// @Route     http://localhost:5000/api/attendance
// @Access    Private for admin
const getAttendance = async (req, res) => {
    try {
        const Attendance = await AttendanceModel.find().populate("employee");

        if (!Attendance.length) return res.status(404).json({ err: "No Data Found" });

        return res.status(200).json(Attendance)
    } catch (error) {
        console.log("Error Reading Attendance", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
}

// @Request   GET
// @Route     http://localhost:5000/api/attendance/:id
// @Access    Private
const getAttendanceByEmployeeId = async (req, res) => {
  try {
    const { id } = req.params; // Extract the employee ID from the request parameters

    // Fetch attendance records for the specified employee ID
    const attendanceRecords = await AttendanceModel.find({ employee: id }).populate("employee");
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @Request   GET
// @Route     http://localhost:5000/api/attendance
// @Access    Private
const getSingleAttendance = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid ID Format" });

        const Attendance = await AttendanceModel.findById(_id).populate("employee");
        if (!Attendance) return res.status(404).json({ err: "No Data Found" });

        return res.status(200).json(Attendance)
    } catch (error) {
        console.log("Error Reading Attendance", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
}


// @Request   PODT
// @Route     http://localhost:5000/api/attendance
// @Access    Private
const createAttendance = async (req, res) => {
  try {
    const { employee, attendanceDate, timeIn, timeOut, status, lateBy, totalHours } = req.body;

    if (!employee) return res.status(400).json({ err: "Employee ID is required." });

      // Check for existing attendance record for the employee on the same day
      const existingAttendance = await AttendanceModel.findOne({ employee, attendanceDate });
      if (existingAttendance) {
        return res.status(400).json({ err: "Attendance already marked for today." });
      }

    if (!timeIn) return res.status(400).json({ err: "Check-in time is required." });

    const timeInDate = new Date(timeIn);
    const timeOutDate = timeOut ? new Date(timeOut) : null;

    if (timeOutDate && timeOutDate <= timeInDate)
      return res.status(400).json({ err: "Check-out time must be after check-in time." });

    const attendance = await AttendanceModel.create({
      employee,
      attendanceDate: new Date(attendanceDate || Date.now()),
      timeIn: timeInDate,
      timeOut: timeOutDate,
      status: status || "On Time",
      lateBy: lateBy || 0,
      totalHours: totalHours || 0,
    });

    return res.status(201).json({ msg: "Attendance added successfully", attendance });
  } catch (error) {
    console.error("Error creating attendance:", error);
    return res.status(500).json({ err: "Internal Server Error", error: error.message });
  }
};


// @Request   PUT
// @Route     http://localhost:5000/api/attendance/:id
// @Access    Private
const updateAttendance = async (req, res) => {
  try {
    const { timeOut } = req.body;

    const attendance = await AttendanceModel.findById(req.params.id);
    if (!attendance) return res.status(404).json({ err: "Attendance not found." });

    if (timeOut) {
      const timeOutDate = new Date(timeOut);
      const totalHours = (timeOutDate - new Date(attendance.timeIn)) / (1000 * 60 * 60);

      attendance.timeOut = timeOutDate;
      attendance.totalHours = totalHours;
    }

    await attendance.save();

    return res.status(200).json({ msg: "Attendance updated successfully", attendance });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({ err: "Internal Server Error", error: error.message });
  }
};

module.exports = {getAttendance,getSingleAttendance,getAttendanceByEmployeeId, createAttendance, updateAttendance ,getAttendanceReport};