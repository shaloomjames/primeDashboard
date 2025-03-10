

// // // // const LeaveSchema = new mongoose.Schema(
// // // //   {
// // // //     employee: {
// // // //       type: mongoose.Schema.Types.ObjectId,
// // // //       ref: "employeeModel",
// // // //       required: true,
// // // //     },
// // // //     //   leaveType: {
// // // //     //   type: String,
// // // //     //   enum: ["Casual", "Sick", "Earned", "Maternity", "Paternity", "Unpaid"],
// // // //     //   required: true,
// // // //     // },
// // // //     leaveType: {
// // // //       type: mongoose.Schema.Types.ObjectId,
// // // //       ref: "LeaveTypeModel",
// // // //       required: true,
// // // //     },
// // // //     startDate: {
// // // //       type: Date,
// // // //       required: true,
// // // //     },
// // // //     // endDate: {
// // // //     //   type: Date,
// // // //     //   required: true,
// // // //     // },

// // // //     // not mo fields
// // // //     endDate: {
// // // //       type: Date,
// // // //       required: true,
// // // //       validate: {
// // // //         validator: function (endDate) {
// // // //           return endDate >= this.startDate;
// // // //         },
// // // //         message: "End date must be after start date",
// // // //       },
// // // //     },
// // // //     reason: {
// // // //       type: String,
// // // //       trim: true,
// // // //       required: true,
// // // //     },
// // // //     adminReason: {
// // // //       type: String,
// // // //       trim: true,
// // // //     },
// // // //     status: {
// // // //       type: String,
// // // //       enum: ["Pending", "Approved", "Rejected"],
// // // //       default: "Pending",
// // // //     },
// // // //     approvedBy: {
// // // //       type: mongoose.Schema.Types.ObjectId,
// // // //       ref: "employeeModel",
// // // //     },
// // // //     affectedAttendance: [
// // // //       {
// // // //         type: mongoose.Schema.Types.ObjectId,
// // // //         ref: "AttendanceModel",
// // // //       },
// // // //     ],
// // // //     calculatedDays: {
// // // //       type: Number,
// // // //       min: 0,
// // // //       default: 0,
// // // //     },
// // // //     weekends: {
// // // //       type: Number,
// // // //       min: 0,
// // // //       default: 0,
// // // //     },
// // // //     Holidays:[ {
// // // //       // type: Number,
// // // //       // min: 0,
// // // //       // default: 0,
// // // //       type: mongoose.Schema.Types.ObjectId,
// // // //       ref: "HolidayModel",
// // // //     }],
    
// // // //   },
// // // //   { timestamps: true }
// // // // );

// // // // // Prevent overlapping leave requests
// // // // LeaveSchema.index({ employee: 1, startDate: 1, endDate: 1 }, { unique: true });

// // // // module.exports = mongoose.model("LeaveModel", LeaveSchema);

// // // const mongoose = require("mongoose");

// // // const LeaveSchema = new mongoose.Schema(
// // //   {
// // //     employee: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "employeeModel",
// // //       required: true,
// // //     },
// // //     leaveType: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "LeaveTypeModel",
// // //       required: true,
// // //     },
// // //     startDate: {
// // //       type: Date,
// // //       required: true,
// // //     },
// // //     endDate: {
// // //       type: Date,
// // //       required: true,
// // //       validate: {
// // //         validator: function (endDate) {
// // //           return endDate >= this.startDate;
// // //         },
// // //         message: "End date must be after start date",
// // //       },
// // //     },
// // //     reason: {
// // //       type: String,
// // //       trim: true,
// // //       required: true,
// // //     },
// // //     // adminReason: {
// // //     //   type: String,
// // //     //   trim: true,
// // //     // },
// // //     status: {
// // //       type: String,
// // //       enum: ["Pending", "Approved", "Rejected"],
// // //       default: "Pending",
// // //     },
// // //     approvedBy: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "employeeModel",
// // //     },
// // //     affectedAttendance: [
// // //       {
// // //         type: mongoose.Schema.Types.ObjectId,
// // //         ref: "AttendanceModel",
// // //       },
// // //     ],
// // //     calculatedDays: {
// // //       type: Number,
// // //       min: 0,
// // //       default: 0,
// // //     },
// // //     totalDaysOfLeavePeriod: {
// // //       type: Number,
// // //       min: 0,
// // //       default: 0,
// // //     },
// // //     weekends:[ {
// // //       type: Date,
// // //     }],
// // //     holidays: [
// // //       {
// // //         type: mongoose.Schema.Types.ObjectId,
// // //         ref: "HolidayModel",
// // //       }
// // //     ],
    
// // //   },
// // //   { timestamps: true }
// // // );

// // // // Prevent overlapping leave requests
// // // LeaveSchema.index({ employee: 1, startDate: 1, endDate: 1 }, { unique: true });

// // // module.exports = mongoose.model("LeaveModel", LeaveSchema);

// // const mongoose = require("mongoose");

// // const LeaveSchema = new mongoose.Schema(
// //   {
// //     employee: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "employeeModel",
// //       required: true,
// //     },
// //     leaveType: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "LeaveTypeModel",
// //       required: true,
// //     },
// //     startDate: {
// //       type: Date,
// //       required: true,
// //     },
// //     endDate: {
// //       type: Date,
// //       required: true,
// //       validate: {
// //         validator: function (endDate) {
// //           return endDate >= this.startDate;
// //         },
// //         message: "End date must be after start date",
// //       },
// //     },
// //     reason: {
// //       type: String,
// //       trim: true,
// //       required: true,
// //     },
// //     status: {
// //       type: String,
// //       enum: ["Pending", "Approved", "Rejected"],
// //       default: "Pending",
// //     },
// //     approvedBy: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "employeeModel",
// //     },
// //     affectedAttendance: [
// //       {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: "AttendanceModel",
// //       },
// //     ],
// //     calculatedDays: {
// //       type: Number,
// //       min: 0,
// //       default: 0,
// //     },
// //     totalDaysOfLeavePeriod: {
// //       type: Number,
// //       min: 0,
// //       default: 0,
// //     },
// //     weekends: [
// //       {
// //         type: Date, // You can store dates or flags for weekends
// //       },
// //     ],
// //     holidays: [
// //       {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: "HolidayModel",
// //       },
// //     ],
// //   },
// //   { timestamps: true }
// // );

// // // Prevent overlapping leave requests
// // LeaveSchema.index({ employee: 1, startDate: 1, endDate: 1 }, { unique: true });

// // // Middleware to calculate total days of leave period
// // LeaveSchema.pre("save", function (next) {
// //   const leave = this;
// //   if (leave.startDate && leave.endDate) {
// //     leave.totalDaysOfLeavePeriod = Math.ceil((leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24)) + 1;
// //   }
// //   next();
// // });

// // // Middleware to prevent overlapping leave requests
// // LeaveSchema.pre('save', async function (next) {
// //   const leave = this;
// //   const existingLeave = await LeaveModel.findOne({
// //     employee: leave.employee,
// //     status: 'Approved',
// //     $or: [
// //       { startDate: { $lte: leave.endDate }, endDate: { $gte: leave.startDate } }
// //     ]
// //   });

// //   if (existingLeave) {
// //     return next(new Error('Leave request overlaps with an existing approved leave.'));
// //   }

// //   next();
// // });

// // module.exports = mongoose.model("LeaveModel", LeaveSchema);

// const mongoose = require("mongoose");

// const LeaveSchema = new mongoose.Schema(
//   {
//     employee: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "employeeModel",
//       required: true,
//     },
//     leaveType: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "LeaveTypeModel",
//       required: true,
//     },
//     startDate: {
//       type: Date,
//       required: true,
//     },
//     endDate: {
//       type: Date,
//       required: true,
//       validate: {
//         validator: function (endDate) {
//           return endDate >= this.startDate;
//         },
//         message: "End date must be after start date",
//       },
//     },
//     reason: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Approved", "Rejected"],
//       default: "Pending",
//     },
//     approvedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "employeeModel",
//     },
//     affectedAttendance: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "AttendanceModel",
//       },
//     ],
//     calculatedDays: {
//       type: Number,
//       min: 0,
//       default: 0,
//     },
//     totalDaysOfLeavePeriod: {
//       type: Number,
//       min: 0,
//       default: 0,
//     },
//     weekends: [
//       {
//         type: Date, // You can store dates or flags for weekends
//       },
//     ],
//     holidays: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "HolidayModel",
//       },
//     ],
//     skippedDates: [
//       {
//         type: Date, // Store skipped dates (overlapping leaves)
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Prevent overlapping leave requests
// LeaveSchema.index({ employee: 1, startDate: 1, endDate: 1 }, { unique: true });

// // Middleware to calculate total days of leave period
// LeaveSchema.pre("save", function (next) {
//   const leave = this;
//   if (leave.startDate && leave.endDate) {
//     leave.totalDaysOfLeavePeriod = Math.ceil((leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24)) + 1;
//   }
//   next();
// });

// // Middleware to prevent overlapping leave requests
// LeaveSchema.pre('save', async function (next) {
//   const leave = this;
//   const existingLeave = await LeaveModel.findOne({
//     employee: leave.employee,
//     status: 'Approved',
//     $or: [
//       { startDate: { $lte: leave.endDate }, endDate: { $gte: leave.startDate } }
//     ]
//   });

//   if (existingLeave) {
//     return next(new Error('Leave request overlaps with an existing approved leave.'));
//   }

//   next();
// });

// module.exports = mongoose.model("LeaveModel", LeaveSchema);



const mongoose = require("mongoose");

// Define the schema
const LeaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employeeModel",
      required: true,
    },
    leaveType: {
      type: String,
      ref: "LeaveTypeModel",
      required: true,
    },
    leaveTypeName: { // Stores the name for historical reference
      type: String,
      // required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (endDate) {
          return endDate >= this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    reason: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employeeModel",
    },
    affectedAttendance: [ 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AttendanceModel",
      },
    ],
    calculatedDays: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalDaysOfLeavePeriod: {
      type: Number,
      min: 0,
      default: 0,
    },
    weekends: [
      {
        type: Date, // You can store dates or flags for weekends
      },
    ],
    holidays: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HolidayModel",
      },
    ],
    skippedDates: [
      {
        type: Date, // Store skipped dates (overlapping leaves)
      },
    ],
  },
  { timestamps: true }
);

// Middleware to calculate total days of leave period
LeaveSchema.pre("save", function (next) {
  const leave = this;
  if (leave.startDate && leave.endDate) {
    leave.totalDaysOfLeavePeriod = Math.ceil((leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24)) + 1;
  }
  next();
});

// Pre-save middleware to set leaveTypeName
LeaveSchema.pre("save", async function(next) {
  if (this.isNew || this.isModified("leaveType")) {
    try {
      const leaveType = await mongoose.model("LeaveTypeModel").findById(this.leaveType);
      if (leaveType) {
        this.leaveTypeName = leaveType.leaveTypeName;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Export the model after the schema and middleware are defined
module.exports = mongoose.model("LeaveModel", LeaveSchema);
