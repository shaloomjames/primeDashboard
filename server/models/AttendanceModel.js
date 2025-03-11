// const mongoose = require("mongoose");

// const AttendanceSchema = mongoose.Schema(
//   {
//     // employee: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   ref: "employeeModel", // Reference to Employee model
//     //   required: true,
//     // },
//     employee: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: "employeeModell", // Dynamic reference field
//       required: true,
//     },
//     employeeModell: {
//       type: String,
//       required: true,
//       enum: ["employeeModel", "deletedEmployeeModel"], // Restrict possible models
//       default: "employeeModel", // Default to employeeModel
//     },    
//     attendanceDate:{
//       type: Date,
//       required: true,
//       default: Date.now,
//     },
//     timeIn: {
//       type: Date,
//       default: null,
//       required: function() {
//         return this.status !== "Holiday" && this.status !== "On Leave" && this.status !== "Absence"; // Only required if the status is not "Holiday"
//       },
//     },
//     timeOut: {
//       type: Date,
//       default: null, // Optional unless the employee checks out
//     },
//     status: {
//       type: String,
//       enum: ["On Time", "Late", "Absence", "Holiday", "On Leave"],
//       default: "On Time",
//       required: true,
//     },
//     lateBy: {
//       type: Number,
//       default: 0, // Calculate late time in minutes, if needed
//     },
//     totalHours: {
//       type: Number,
//       required: [true, "Total hours worked is required"],
//       min: 0,
//       default: 0,
//     },
//     // The reason for making the previousAttendance field an array is to allow you to store multiple versions of the attendance record over time. This could be useful in certain situations, such as:
//     previousAttendance: [
//       {
//         timeIn: { type: Date },
//         timeOut: { type: Date },
//         status: { type: String },
//         lateBy: { type: Number },
//         totalHours: { type: Number },
//         leaveConvertedToHolidayCount: { type: Number },
//         updatedAt: { type: Date, default: Date.now }, // Timestamp of when the old record was saved
//       },
//     ], 
    
//     // systemGenerated: {
//     //   type: Boolean,
//     //   default: false
//     // },

//   },
//   { timestamps: true }
// );
// AttendanceSchema.index({ employee: 1, attendanceDate: 1 }, { unique: true });

// module.exports = mongoose.model("AttendanceModel", AttendanceSchema);

const mongoose = require("mongoose");

const AttendanceSchema = mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "employeeModell",
      required: true,
    },
    employeeModell: {
      type: String,
      required: true,
      enum: ["employeeModel", "deletedEmployeeModel"],
      default: "employeeModel",
    },
    attendanceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    timeIn: {
      type: Date,
      default: null,
      required: function () {
        return this.status !== "Holiday" && this.status !== "On Leave" && this.status !== "Absence";
      },
    },
    timeOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["On Time", "Late", "Absence", "Holiday", "On Leave"],
      default: "On Time",
      required: true,
    },
    lateBy: {
      type: Number,
      default: 0,
    },
    totalHours: {
      type: Number,
      required: [true, "Total hours worked is required"],
      min: 0,
      default: 0,
    },
    previousAttendance: [
      {
        timeIn: { type: Date },
        timeOut: { type: Date },
        status: { type: String },
        lateBy: { type: Number },
        totalHours: { type: Number },
        leaveConvertedToHolidayCount: { type: Number },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

AttendanceSchema.index({ employee: 1, attendanceDate: 1 }, { unique: true });

module.exports = mongoose.model("AttendanceModel", AttendanceSchema);