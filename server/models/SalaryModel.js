const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    selectedMonth: { type: Date, required: true },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employeeModel", // Reference to Employee model
      required: true,
    },
    monthtotalDays: { type: Number, required: true },
    totalWorkingDays: { type: Number, required: true },
    daysOnTime: { type: Number, required: true, default: 0 },
    daysLate: { type: Number, required: true, default: 0 },
    absentDays: { type: Number, required: true, default: 0 },
    effectiveAbsentDays: { type: Number, required: true, default: 0 },
    totalAbsentDays: { type: Number, required: true, default: 0 },
    daysLateLeft: { type: Number, required: true, default: 0 },
    basicSalary: { type: Number, required: true, default: 0, min: 0 },
    salaryPerDay: { type: Number, required: true, min: 0 },
    allowances: [
      {
        name: { type: String },
        amount: { type: Number, default: 0, min: 0 },
      },
    ],
    totalAllowanceAmount: { type: Number, required: true, default: 0 },
    salarySubtotal: { type: Number, required: true },
    deductions: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true, default: 0, min: 0 },
      },
    ],
    totalDeduction: { type: Number, required: true, default: 0 },
    netSalary: { type: Number, required: true, default: 0 },
    remarks: { type: String, default: "" },
    totalAttendanceRecordDays: { type: Number,  default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Salary", salarySchema);
