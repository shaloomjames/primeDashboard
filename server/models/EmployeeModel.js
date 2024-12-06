const mongoose = require("mongoose");
const Counter = require("../models/CounterModel");


const employeeSchema = mongoose.Schema({
    employeeId: { 
        type: String,
        unique: true 
                },
    employeeName: {
        type: String,
        required: [true, "Employee Name Is Required"],
        minLength: 3,
        trim: true
    },
    employeeEmail: {
        type: String,
        required: [true, "Employee Email Is Requires"],
        unique: true,
        minLength: 5,
        trim: true
    },
    employeeSalary:{
        type:Number,
        required:[true,"Employee Salary is Required"],
        minLength: 3,
        trim: true
    },
    employeePassword: {
        type: String,
        required: [true, "Employee Password Is Required"],
        minLength: 3,
        trim: true
    },
    employeeRoles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "roleModel",
            default:"672f5ac5c6665fc51d7902f3"
        }
    ],
    resetPasswordToken: String, // Token for resetting password
    resetPasswordExpires: Date, // Expiry for reset token
},  
    {
        timestamps: true
    })

    // Pre-save middleware to generate the custom employeeId before saving the document
employeeSchema.pre('save', async function(next) {
    if (this.isNew && !this.employeeId )  {  // Only generate a new ID if it's a new document and employeeId is not already set
      try {
        // Fetch and increment the counter atomically
        const counter = await Counter.findOneAndUpdate(
          { _id: 'employeeCounter' },
          { $inc: { count: 1 } }, // Increment the count by 1 for the next ID
          { new: true, upsert: true } // Create the counter if it doesn't exist
        );
        const newIdNumber = counter.count;
  
        // Generate the custom employee ID with the 'prv' prefix
        this.employeeId = `Prime${newIdNumber}`;
  
        next(); // Proceed with saving the employee document
      } catch (err) {
        next(err); // Pass any errors to the next middleware
      }
    } else {
      next(); // If the employee isn't new, just proceed with saving
    }
  });
  

module.exports = mongoose.model("employeeModel", employeeSchema);