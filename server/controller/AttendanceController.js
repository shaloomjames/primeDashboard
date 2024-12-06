const mongoose = require("mongoose");
const attendanceModel = require("./../models/AttendanceModel");

// @Request   GET
// @Route     http://localhost:5000/api/role/
// @Access    Private
const getAttendance = async (req, res) => {
    try {
        const Attendance = await attendanceModel.find();

        if (!Attendance.length) return res.status(404).json({ err: "No Data Found" });

        return res.status(200).json(Attendance)
    } catch (error) {
        console.log("Error Reading Attendance", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
}

// @Request   GET
// @Route     http://localhost:5000/api/role/:id
// @Access    Private
const getSingleAttendance = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid ID Format" });

        const Attendance = await attendanceModel.findById(_id);
        if (!Attendance) return res.status(404).json({ err: "No Data Found" });

        return res.status(200).json(Attendance)
    } catch (error) {
        console.log("Error Reading Attendance", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
}

// @Request   post
// @Route     http://localhost:5000/api/hall/
// @access    private
// const createAttendance = async (req, res) => {
//     try {
//         const { employeeName, employeeEmail, timeIn, timeOut, attendanceDate, totalHours, totalHoursPerMonth } = req.body;

//         const nameRegex = /^[A-Za-z\s]+$/;
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         // const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/;  // Date in 'MM-DD-YYYY' format
//         const numberRegex = /^\d+$/;               // Only digits

//         // Combine attendanceDate with timeIn and timeOut to create full Date objects
//     const timeInDate = new Date(`${attendanceDate}T${timeIn}:00`);
//     const timeOutDate = new Date(`${attendanceDate}T${timeOut}:00`);

//         // Validate employeeName
//         if (!employeeName || !nameRegex.test(employeeName)) return res.status(400).json({ err: "Invalid Username. Only letters and spaces are allowed." });

//         // Validate employeeEmail
//         if (!employeeEmail || !emailRegex.test(employeeEmail)) return res.status(400).json({ err: "Invalid Email Address." });

//         // Validate timeIn and timeOut
//         if (!timeIn || !timeOut) return res.status(400).json({ err: "Both Time In and Time Out are required." });
//         if (new Date(timeOut) <= new Date(timeIn)) return res.status(400).json({ err: "Time Out must be after Time In." });


//         // Validate totalHoursPerMonth
//         if (!totalHours || !numberRegex.test(totalHours)) return res.status(400).json({ err: "Invalid input for Total Hours per Month. Only numbers are allowed." });

//         // Validate totalHoursPerMonth
//         if (!totalHoursPerMonth || !numberRegex.test(totalHoursPerMonth)) return res.status(400).json({ err: "Invalid input for Total Hours per Month. Only numbers are allowed." });

//          // Validate attendanceDate
//          if (!attendanceDate) return res.status(400).json({ err: "Invalid Date. Date is required." });

//         const attendance = await attendanceModel.create({
//             employeeName,
//             employeeEmail,
//             attendanceDate,
//             timeIn: timeInDate,
//             timeOut: timeOutDate,
//             totalHours,
//             totalHoursPerMonth
//         })

//         return res.status(201).json({ msg: "Attendance Added Successfully", attendance });

//     } catch (error) {
//         console.log("Error Adding Attendance", error);
//         return res.status(500).json({ err: "Internal Server Server", error: error.message });
//     }
// }

// @route   POST /api/attendance
// @desc    Create attendance record
// @access  Private
const createAttendance = async (req, res) => {
    try {
        const { employeeName, employeeEmail, timeIn, timeOut, attendanceDate, totalHours, totalHoursPerMonth } = req.body;

        // Basic input validation
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const numberRegex = /^\d+$/;

        // Validate employeeName
        if (!employeeName || !nameRegex.test(employeeName)) 
            return res.status(400).json({ err: "Invalid Username. Only letters and spaces are allowed." });

        // Validate employeeEmail
        if (!employeeEmail || !emailRegex.test(employeeEmail)) 
            return res.status(400).json({ err: "Invalid Email Address." });

        // Validate timeIn and timeOut
        if (!timeIn || !timeOut) 
            return res.status(400).json({ err: "Both Time In and Time Out are required." });
        if (new Date(timeOut) <= new Date(timeIn)) 
            return res.status(400).json({ err: "Time Out must be after Time In." });

        // Validate totalHours
        if (!totalHours || !numberRegex.test(totalHours)) 
            return res.status(400).json({ err: "Invalid input for Total Hours. Only numbers are allowed." });

        // Validate totalHoursPerMonth
        if (!totalHoursPerMonth || !numberRegex.test(totalHoursPerMonth)) 
            return res.status(400).json({ err: "Invalid input for Total Hours per Month. Only numbers are allowed." });

        // Validate attendanceDate
        if (!attendanceDate) 
            return res.status(400).json({ err: "Invalid Date. Date is required." });

        // Combine attendanceDate with timeIn and timeOut to create full Date objects
        const timeInDate = new Date(`${attendanceDate}T${timeIn}:00`);
        const timeOutDate = new Date(`${attendanceDate}T${timeOut}:00`);

        // Create a new attendance record
        const attendance = await attendanceModel.create({
            employeeName,
            employeeEmail,
            attendanceDate,
            timeIn: timeInDate,
            timeOut: timeOutDate,
            totalHours,
            totalHoursPerMonth
        });

        return res.status(201).json({ msg: "Attendance Added Successfully", attendance });
    } catch (error) {
        console.log("Error Adding Attendance", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};




// @Request   PUT
// @Route     http://localhost:5000/api/employee/:id
// @Access    Private
const updateAttendance = async (req, res) => {
    try {
        const { employeeName, employeeEmail, timeIn, timeOut, Date,totalHours, totalHoursPerMonth } = req.body;

        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/;  // Date in 'MM-DD-YYYY' format

        
        
        // Validate employeeName
        if (!employeeName || !nameRegex.test(employeeName)) return res.status(400).json({ err: "Invalid Username. Only letters and spaces are allowed." });
        
        // Validate employeeEmail
        if (!employeeEmail || !emailRegex.test(employeeEmail)) return res.status(400).json({ err: "Invalid Email Address." });
        
        // Validate timeIn and timeOut
        if (!timeIn || !timeOut) return res.status(400).json({ err: "Time In and Time Out are required." });
        if (new Date(timeOut) <= new Date(timeIn)) return res.status(400).json({ err: "Time Out must be after Time In." });

        // Validate Date
        if (!Date) return res.status(400).json({ err: "Date is Required" });
        
        // Validate totalHoursPerMonth
        if (!totalHours || !numberRegex.test(totalHours)) return res.status(400).json({ err: "Invalid input for Total Hours per Month. Only numbers are allowed." });

        // Validate totalHoursPerMonth
        if (!totalHoursPerMonth || !numberRegex.test(totalHoursPerMonth)) return res.status(400).json({ err: "Invalid input for Total Hours per Month. Only numbers are allowed." });

        const updatedData = {
            employeeName,
            employeeEmail,
            Date,
            timeIn,
            timeOut,
            totalHours,
            totalHoursPerMonth
        };

        const updatedAttendance = await attendanceModel.findByIdAndUpdate(_id, updatedData, { new: true, omitUndefined: true });

        return res.status(201).json({ msg: "Attendance Updated Successfully", updatedData })
    } catch (error) {
        console.log("Error Updating Attendance", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
}

// @Request   DELETE
// @Route     http://localhost:5000/api/employee/:id
// @Access    Private
const deleteAttendance = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid ID Format" });

        const deletedAttendance = await AttendanceModel.findByIdAndDelete(_id);
        if (!deletedAttendance) return res.status(404).json({ err: "Attendance Not Found" });

        return res.status(200).json({ msg: "Attendance Deleted Successfully", deletedAttendance });
    } catch (error) {
        console.log("Error Deleting Attendance", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
}

module.exports = { getAttendance, getSingleAttendance, createAttendance, updateAttendance, deleteAttendance }
