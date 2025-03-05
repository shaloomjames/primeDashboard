const mongoose = require("mongoose");

const HolidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employeeModel",
    },
    affectedAttendance: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AttendanceModel",
          },
        ],
        // // not my field
        // impactReport: {
        //   leavesAdjusted: Number,
        //   employeesAffected: Number,
        //   balanceRestored: Number
        // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HolidayModel", HolidaySchema);
