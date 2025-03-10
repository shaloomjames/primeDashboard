  const mongoose = require("mongoose");

  const LeaveTypeSchema = new mongoose.Schema(
    {
      leaveTypeName: {
        type: String,
        required: [true, "Leave type is required"],
        trim: true,
        unique: true,
      },
      allowedLeaves: {
        type: Number,
        required: [true, "Allowed leaves is required"],
        min: [1, "Allowed leaves cannot be negative"],
      },
      leaveTypeStatus: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        required: [true, "Leave type status is required"],
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("LeaveTypeModel", LeaveTypeSchema);
