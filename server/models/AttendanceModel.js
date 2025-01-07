const mongoose = require("mongoose");

const AttendanceSchema = mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employeeModel",  // Reference to Employee model
        required: true
    },
    attendanceDate: {
        type: Date,
        required: true,
        default: Date.now,
            // Ensure unique entry for each employee per day
      unique: true,
    },
    timeIn: {
        type: Date,
        required: true
    },
    timeOut: {
        type: Date,
        default: null  // Optional unless the employee checks out
    },
    status: {
        type: String,
        enum: ["On Time", "Late", "Absence", "Holiday"],
        default: "On Time"
    },
    lateBy: {
        type: Number,
        default: 0  // Calculate late time in minutes, if needed
    },
    totalHours: {
        type: Number,
        required: [true, "Total hours worked is required"],
        min: 0
    },
}, { timestamps: true });

module.exports = mongoose.model("AttendanceModel", AttendanceSchema);