    // const mongoose = require("mongoose");

    // const AttendanceSchema = mongoose.Schema({
    //     employeeName:{
    //         type:String,
    //         required:[true,"Employee Name is Required"],
    //         minLength: 3,
    //         trim: true
    //     },
    //     employeeEmail:{
    //         type:String,
    //         required:[true,"Employee Email is Required"],
    //         minLength: 3,
    //         trim: true
    //     },
    //     timeIn:{
    //         type:Date,
    //         required:true
    //     },
    //     timeOut:{
    //         type:Date,
    //         required:true
    //     },
    //     Date:{
    //         type:Date,
    //         required:true,
    //         default:Date.now
    //     },
    //     totalHours:{
    //         type:Number,
    //         required:[true,"total hours per month is Required"]
    //     },
    //     totalHoursPerMonth:{
    //         type:Number,
    //         required:[true,"total hours per month is Required"]
    //     },
    // },
    // {
    //     timestamps:true
    // });

    // module.exports = mongoose.model("attendanceModel",AttendanceSchema);
    const mongoose = require("mongoose");

const AttendanceSchema = mongoose.Schema({
    employeeName: {
        type: String,
        required: [true, "Employee Name is required"],
        minLength: 3,
        trim: true
    },
    employeeEmail: {
        type: String,
        required: [true, "Employee Email is required"],
        trim: true
    },
    timeIn: {
        type: Date,
        required: true
    },
    timeOut: {
        type: Date,
        required: true
    },
    attendanceDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    totalHours: {
        type: Number,
        required: [true, "Total hours is required"],
        min: 0
    },
    totalHoursPerMonth: {
        type: Number,
        required: [true, "Total hours per month is required"],
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("AttendanceModel", AttendanceSchema);
