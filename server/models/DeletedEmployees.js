const mongoose = require("mongoose");

const deletedEmployeeSchema = mongoose.Schema({
  employeeId: { type: String, unique: true },
  employeeName: { type: String, required: true, minLength: 3, trim: true },
  employeeEmail: { type: String, required: true, minLength: 5, trim: true },
  employeeSalary: { type: Number, required: true, trim: true },
  employeePassword: { type: String, required: true, minLength: 3, trim: true },
  employeeRoles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roleModel",
    },
  ],
  deletedAt: { type: Date, default: Date.now }, // Track deletion timestamp
}, {
  timestamps: true,
});

module.exports = mongoose.model("deletedEmployeeModel", deletedEmployeeSchema);
