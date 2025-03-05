const mongoose = require("mongoose");

const deletedEmployeeSchema = mongoose.Schema(
  {
    employeeId: { type: String, unique: true },
    employeeName: { type: String, required: true, minLength: 3, trim: true },
    employeeEmail: { type: String, required: true, minLength: 5, trim: true },
    employeeSalary: { type: Number, required: true, trim: true },
    employeePassword: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
    },
    employeeRoles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roleModel",
      },
    ],
    employeeallowances: [
      {
        name: { type: String },
        amount: { type: Number, default: 0 },
      },
    ],
    employeeTimeIn: {
      type: String, // Store check-in time as Date
      default: "21:00", // Default to 21:00 if no check-in yet
    },
    employeeTimeOut: {
      type: String, // Store check-out time as Date
      default: "05:00", // Default to 05:00 if no check-out yet
    },

    deletedAt: { type: Date, default: Date.now }, // Track deletion timestamp
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("deletedEmployeeModel", deletedEmployeeSchema);
