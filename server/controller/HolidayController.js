const HolidayModel = require("../models/HolidayModel");
const LeaveModel = require("../models/LeaveModel");
const AttendanceModel = require("../models/AttendanceModel");
const { default: mongoose } = require("mongoose");
const EmployeeModel = require("../models/EmployeeModel");


// const createHoliday = async (req, res) => {
//   try {
//     const { name, date, description, createdBy } = req.body;

//     const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/; // Regex allowing letters, numbers, spaces, and some punctuation

//     // Validate name and description
//     if (!nameRegex.test(name)) {
//       return res.status(400).json({
//         err: "Invalid name. Only letters, numbers, and spaces are allowed.",
//       });
//     }
//     if (!nameRegex.test(description)) {
//       return res.status(400).json({
//         err: "Invalid description. Only letters, numbers, spaces, and punctuation are allowed.",
//       });
//     }

//     // Check if a holiday already exists for the given date
//     const existingHoliday = await HolidayModel.findOne({ date: date });
//     if (existingHoliday) {
//       return res.status(409).json({ err: "Holiday already exists for this date" });
//     }

//     // Ensure holiday is created only for today or future dates
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize today's date (zero out time)

//     const newDate = new Date(date);
//     newDate.setHours(0, 0, 0, 0); // Normalize new date

//     if (newDate.getTime() < today.getTime()) {
//       return res
//         .status(400)
//         .json({ err: "Holiday date must be today or a future date" });
//     }

//     // Create holiday record
//     const holiday = await HolidayModel.create({
  //       name,
//       date,
//       description,
//       createdBy,
//       affectedAttendance: [], // Initialize affectedAttendance as an empty array
//     });

//     // Fetch all employees
//     const employees = await EmployeeModel.find();

//     // Process attendance for each employee concurrently using Promise.all()
//     await Promise.all(
//       employees.map(async (employee) => {
//         let leaveCount = 0;
//         // Find attendance record for this employee on the holiday date
//         let attendance = await AttendanceModel.findOne({
//           employee: employee._id,
//           attendanceDate: date,
//         });

//         if (attendance) {
  //           if (attendance.status === "On Leave") {
//             leaveCount++;
//           }
//           if (!attendance.previousAttendance) {
//             attendance.previousAttendance = [];
//           }
//           // Add attendance _id to holiday's affectedAttendance array
//           holiday.affectedAttendance.push(attendance._id);
//           attendance.previousAttendance.push({
//             timeIn: attendance.timeIn,
//             timeOut: attendance.timeOut,
//             status: attendance.status,
//             lateBy: attendance.lateBy,
//             totalHours: attendance.totalHours,
//             leaveConvertedToHolidayCount: leaveCount,
//             updatedAt: Date.now(),
//           });
//           // Update the attendance record to mark it as a Holiday
//           attendance.status = "Holiday";
//           attendance.timeIn = null;
//           attendance.timeOut = null;
//           attendance.lateBy = 0;
//           attendance.totalHours = 0;
//           await attendance.save();
//         } else {
//           // If no attendance exists for this employee on the holiday date, create one
//           const newAttendance = await AttendanceModel.create({
  //             employee: employee._id,
//             attendanceDate: date,
//             status: "Holiday",
//             timeIn: null,
//             timeOut: null,
//             lateBy: 0,
//             totalHours: 0,
//           });
//           holiday.affectedAttendance.push(newAttendance._id);
//         }
//       })
//     );

//     // Save the holiday with the updated affectedAttendance list
//     await holiday.save();

//     return res.status(201).json({ msg: "Holiday created successfully", data: holiday });
//   } catch (error) {
  //     console.error("Holiday creation error:", error);
//     return res
//       .status(500)
//       .json({ err: "Internal Server Error", error: error.message });
//   }
// };



// // Create Holiday
// const createHoliday = async (req, res) => {
//   try {
//     const { name, date, description, createdBy } = req.body;

//     const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/; // Regex allowing some punctuation

//     // // Validate name and description
//     // if (!nameRegex.test(name)) {
//     //   return res
//     //     .status(400)
//     //     .json({
//     //       err: "Invalid name. Only letters, numbers, and spaces are allowed.",
//     //     });
//     // }
//     // if (!nameRegex.test(description)) {
//     //   return res
//     //     .status(400)
//     //     .json({ 
//     //       err: "Invalid description. Only letters, numbers, spaces, and punctuation are allowed.",
//     //     });
//     // }

//     // Validate required fields
//     if (!name || !nameRegex.test(name)) {
//       return res.status(400).json({
//         err: "Invalid name. Only letters, numbers, spaces, and some punctuation are allowed.",
//       });
//     }
//     if (description && !nameRegex.test(description)) {
//       return res.status(400).json({
//         err: "Invalid description. Only letters, numbers, spaces, and some punctuation are allowed.",
//       });
//     }
//     if (!date) {
//       return res.status(400).json({ err: "Date is required" });
//     }


//     // // Ensure holiday is created only for today or future dates
//     // const today = new Date();
//     // today.setHours(0, 0, 0, 0); // Remove time from today

//      // Normalize dates by zeroing out the time portion
//      const today = new Date();
//      today.setHours(0, 0, 0, 0); // Normalize today's date
 
//      const newDate = new Date(date);
//      newDate.setHours(0, 0, 0, 0); // Normalize new date

//     // if (date < today) {
//     //   return res
//     //     .status(400)
//     //     .json({ err: "Holiday date must be today or a future date" });
//     // }

//      // Disallow creating a holiday in the past
//      if (newDate.getTime() < today.getTime()) {
//       return res
//         .status(400)
//         .json({ err: "Holiday date must be today or a future date" });
//     }

//     // Disallow creating a holiday on Sunday
//     const dayOfWeek = newDate.getDay(); // 0 = Sunday, 6 = Saturday
//     if (dayOfWeek === 0) {
//       return res.status(400).json({ err: "Holiday cannot be created on Sunday. It is a weekend" });
//     }

//       // Disallow creating a holiday on alternate Saturdays (even-numbered week)
//       if (dayOfWeek === 6) {
//         const weekNumber = Math.ceil(newDate.getDate() / 7);
//         if (weekNumber % 2 === 0) {
//           return res.status(400).json({ err: "Holiday cannot be created on alternate Saturdays.They are weekends" });
//         }
//       }
  
//           // Check if holiday already exists
//     const existingHoliday = await HolidayModel.findOne({ date: date });
//     if (existingHoliday) {
//       return res
//         .status(409)
//         .json({ err: "Holiday already exists for this date" });
//     }


//     // Create holiday record
//     const holiday = await HolidayModel.create({
//       name,
//       date,
//       description,
//       createdBy,
//       affectedAttendance: [], // Initialize affectedAttendance as an empty array
//     });

//     // Fetch all employees from the employee model
//     const employees = await EmployeeModel.find();


//     // Process attendance for each employee concurrently using Promise.all()
//     await Promise.all(
//       employees.map(async (employee) => {
//         let leaveCount = 0;
//         // Find attendance record for this employee on the holiday date
//         let attendance = await AttendanceModel.findOne({
//           employee: employee._id,
//           attendanceDate: newDate,
//           });

//         if (attendance) {
//           // if (attendance.status === "On Leave") {
//           //   leaveCount++;
//           // }
//           // if (!attendance.previousAttendance) {
//           //   attendance.previousAttendance = [];
//           // }
//           // // Add attendance _id to holiday's affectedAttendance array
//           // holiday.affectedAttendance.push(attendance._id);
//           // attendance.previousAttendance.push({
//           //   timeIn: attendance.timeIn,
//           //   timeOut: attendance.timeOut,
//           //   status: attendance.status,
//           //   lateBy: attendance.lateBy,
//           //   totalHours: attendance.totalHours,
//           //   leaveConvertedToHolidayCount: leaveCount,
//           //   updatedAt: Date.now(),
//           // });
//           // // Update the attendance record to mark it as a Holiday
//           // attendance.status = "Holiday";
//           // attendance.timeIn = null;
//           // attendance.timeOut = null;
//           // attendance.lateBy = 0;
//           // attendance.totalHours = 0;
//           // await attendance.save();
//           // Only update if status is "On Time", "Late", "Absence", or "On Leave"
//           const statusesToReplace = ["On Time", "Late", "Absence", "On Leave"];
//           if (statusesToReplace.includes(attendance.status)) {
//             if (!attendance.previousAttendance) {
//               attendance.previousAttendance = [];
//             }
//             // Store previous attendance data
//             holiday.affectedAttendance.push(attendance._id);
//             attendance.previousAttendance.push({
//               timeIn: attendance.timeIn,
//               timeOut: attendance.timeOut,
//               status: attendance.status,
//               lateBy: attendance.lateBy,
//               totalHours: attendance.totalHours,
//               leaveConvertedToHolidayCount: attendance.status === "On Leave" ? 1 : 0,
//               updatedAt: Date.now(),
//             });
//             // Update to Holiday status
//             attendance.status = "Holiday";
//             attendance.timeIn = null;
//             attendance.timeOut = null;
//             attendance.lateBy = 0;
//             attendance.totalHours = 0;
//             await attendance.save({ session });
//           }
//         } else {
//           // If no attendance exists for this employee on the holiday date, create one
//           const newAttendance = await AttendanceModel.create({
//             employee: employee._id,
//             attendanceDate: date,
//             status: "Holiday",
//             timeIn: null,
//             timeOut: null,
//             lateBy: 0,
//             totalHours: 0,
//           });
//           holiday.affectedAttendance.push(newAttendance._id);
//         }
//       })
//     );

//     // Save the holiday with the updated affectedAttendance list
//     await holiday.save();

//       // // Loop through each employee and update attendance
//       // for (let employee of employees) {
//       //   let leaveCount = 0;
//       //   // Find attendance record for this employee on the holiday date
//       //   let attendance = await AttendanceModel.findOne({
//       //     employee: employee._id,
//       //     attendanceDate: date,
//       //   });

//       //   // If attendance exists, update previousAttendance and change the status to Holiday
//       //   if (attendance) {
//       //     if (attendance.status === "On Leave") {
//       //       leaveCount++;
//       //     }

//       //     // Save the current attendance record in the previousAttendance field
//       //     if (!attendance.previousAttendance) {
//       //       attendance.previousAttendance = [];
//       //     }
//       //     holiday.affectedAttendance.push(attendance._id);
//       //     attendance.previousAttendance.push({
//       //       timeIn: attendance.timeIn,
//       //       timeOut: attendance.timeOut,
//       //       status: attendance.status,
//       //       lateBy: attendance.lateBy,
//       //       totalHours: attendance.totalHours,
//       //       leaveConvertedToHolidayCount: leaveCount, // Store the leave count here
//       //       updatedAt: Date.now(),
//       //     });

//       //     // Update the attendance status to Holiday
//       //     attendance.status = "Holiday";
//       //     attendance.timeIn = null;
//       //     attendance.timeOut = null;
//       //     attendance.lateBy = 0;
//       //     attendance.totalHours = 0;

//       //     // Save the updated attendance
//       //     await attendance.save();
//       //   } else {
//       //     // If no attendance exists for this date, create a new attendance record for the holiday
//       //     const newAttendance = await AttendanceModel.create({
//       //       employee: employee._id,
//       //       attendanceDate: date,
//       //       status: "Holiday",
//       //       timeIn: null,
//       //       timeOut: null,
//       //       lateBy: 0,
//       //       totalHours: 0,
//       //     });
//       //     // Push the newly created attendance ID to the holiday
//       //     holiday.affectedAttendance.push(newAttendance._id);
//       //   }
//       // }
//       // // Save the holiday with updated affected attendance list
//       // await holiday.save();
      
//     return res.status(201).json({ msg: "Holiday created successfully", data: holiday });
//   } catch (error) {
//     console.error("Holiday creation error:", error);
//     return res.status(500).json({ err: "Internal Server Error", error: error.message });
//   }
// };

// Create Holiday
// const createHoliday = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { name, date, description, createdBy } = req.body;

//     const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/; // Regex allowing some punctuation

//     // Validate required fields
//     if (!name || !nameRegex.test(name)) {
//       return res.status(400).json({
//         err: "Invalid name. Only letters, numbers, spaces, and some punctuation are allowed.",
//       });
//     }
//     if (description && !nameRegex.test(description)) {
//       return res.status(400).json({
//         err: "Invalid description. Only letters, numbers, spaces, and some punctuation are allowed.",
//       });
//     }
//     if (!date) {
//       return res.status(400).json({ err: "Date is required" });
//     }

//     // Normalize dates by zeroing out the time portion
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize today's date

//     const newDate = new Date(date);
//     newDate.setHours(0, 0, 0, 0); // Normalize new date

//     // Disallow creating a holiday in the past
//     if (newDate.getTime() < today.getTime()) {
//       return res.status(400).json({ err: "Holiday date must be today or a future date" });
//     }

//     // Disallow creating a holiday on Sunday
//     const dayOfWeek = newDate.getDay(); // 0 = Sunday, 6 = Saturday
//     if (dayOfWeek === 0) {
//       return res.status(400).json({ err: "Holiday cannot be created on Sunday. It is a weekend" });
//     }

//     // Disallow creating a holiday on alternate Saturdays (even-numbered week)
//     if (dayOfWeek === 6) {
//       const weekNumber = Math.ceil(newDate.getDate() / 7);
//       if (weekNumber % 2 === 0) {
//         return res.status(400).json({ err: "Holiday cannot be created on alternate Saturdays. They are weekends" });
//       }
//     }

//     // Check if holiday already exists
//     const existingHoliday = await HolidayModel.findOne({ date: newDate });
//     if (existingHoliday) {
//       return res.status(409).json({ err: "Holiday already exists for this date" });
//     }

//     // Create holiday record
//     const holiday = await HolidayModel.create(
//       [
//         {
//           name,
//           date: newDate,
//           description: description || "", // Default to empty string if not provided
//           createdBy,
//           affectedAttendance: [],
//         },
//       ],
//       { session }
//     ).then((result) => result[0]); // Extract the first document

//     // Fetch all employees
//     const employees = await EmployeeModel.find();

//     // Process attendance for each employee concurrently
//     await Promise.all(
//       employees.map(async (employee) => {
//         // Find attendance record for this employee on the holiday date
//         let attendance = await AttendanceModel.findOne({
//           employee: employee._id,
//           attendanceDate: newDate,
//         });

//         if (attendance) {
//           // Only update if status is "On Time", "Late", "Absence", or "On Leave"
//           const statusesToReplace = ["On Time", "Late", "Absence", "On Leave"];
//           if (statusesToReplace.includes(attendance.status)) {
//             if (!attendance.previousAttendance) {
//               attendance.previousAttendance = [];
//             }
//             // Store previous attendance data
//             holiday.affectedAttendance.push(attendance._id);
//             attendance.previousAttendance.push({
//               timeIn: attendance.timeIn,
//               timeOut: attendance.timeOut,
//               status: attendance.status,
//               lateBy: attendance.lateBy,
//               totalHours: attendance.totalHours,
//               leaveConvertedToHolidayCount: attendance.status === "On Leave" ? 1 : 0,
//               updatedAt: Date.now(),
//             });
//             // Update to Holiday status
//             attendance.status = "Holiday";
//             attendance.timeIn = null;
//             attendance.timeOut = null;
//             attendance.lateBy = 0;
//             attendance.totalHours = 0;
//             await attendance.save({ session });
//           }
//         } else {
//           // Create a new Holiday attendance record if none exists
//           const newAttendance = await AttendanceModel.create(
//             [
//               {
//                 employee: employee._id,
//                 employeeModell: "employeeModel", // Explicitly set to match schema
//                 attendanceDate: newDate,
//                 status: "Holiday",
//                 timeIn: null,
//                 timeOut: null,
//                 lateBy: 0,
//                 totalHours: 0,
//                 previousAttendance: [],
//               },
//             ],
//             { session }
//           ).then((result) => result[0]);
//           holiday.affectedAttendance.push(newAttendance._id);
//         }
//       })
//     );

//     // Save the holiday with updated affectedAttendance
//     await holiday.save({ session });

//     await session.commitTransaction();
//     return res.status(201).json({ msg: "Holiday created successfully", data: holiday });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Holiday creation error:", error);
//     if (error.code === 11000) { // MongoDB duplicate key error
//       return res.status(409).json({ err: "Holiday or attendance already exists for this date" });
//     }
//     return res.status(500).json({ err: "Internal Server Error", details: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// const createHoliday = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { name, date, description, createdBy } = req.body;

//     const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/;

//     if (!name || !nameRegex.test(name)) {
//       return res.status(400).json({
//         err: "Invalid name. Only letters, numbers, spaces, and some punctuation are allowed.",
//       });
//     }
//     if (description && !nameRegex.test(description)) {
//       return res.status(400).json({
//         err: "Invalid description. Only letters, numbers, spaces, and some punctuation are allowed.",
//       });
//     }
//     if (!date) {
//       return res.status(400).json({ err: "Date is required" });
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const newDate = new Date(date);
//     newDate.setHours(0, 0, 0, 0);

//     if (newDate.getTime() < today.getTime()) {
//       return res.status(400).json({ err: "Holiday date must be today or a future date" });
//     }

//     const dayOfWeek = newDate.getDay();
//     if (dayOfWeek === 0) {
//       return res.status(400).json({ err: "Holiday cannot be created on Sunday. It is a weekend" });
//     }
//     if (dayOfWeek === 6) {
//       const weekNumber = Math.ceil(newDate.getDate() / 7);
//       if (weekNumber % 2 === 0) {
//         return res.status(400).json({ err: "Holiday cannot be created on alternate Saturdays. They are weekends" });
//       }
//     }

//     const existingHoliday = await HolidayModel.findOne({ date: newDate });
//     if (existingHoliday) {
//       return res.status(409).json({ err: "Holiday already exists for this date" });
//     }

//     const holiday = await HolidayModel.create(
//       [
//         {
//           name,
//           date: newDate,
//           description: description || "",
//           createdBy,
//           affectedAttendance: [],
//         },
//       ],
//       { session }
//     ).then((result) => result[0]);

//     const employees = await EmployeeModel.find();

//     await Promise.all(
//       employees.map(async (employee) => {
//         let attendance = await AttendanceModel.findOne({
//           employee: employee._id,
//           attendanceDate: newDate,
//         });

//         if (attendance) {
//           const statusesToReplace = ["On Time", "Late", "Absence", "On Leave"];
//           if (statusesToReplace.includes(attendance.status)) {
//             if (!attendance.previousAttendance) {
//               attendance.previousAttendance = [];
//             }
//             holiday.affectedAttendance.push(attendance._id);
//             attendance.previousAttendance.push({
//               timeIn: attendance.timeIn,
//               timeOut: attendance.timeOut,
//               status: attendance.status,
//               lateBy: attendance.lateBy,
//               totalHours: attendance.totalHours,
//               leaveConvertedToHolidayCount: attendance.status === "On Leave" ? 1 : 0,
//               updatedAt: Date.now(),
//             });
//             attendance.status = "Holiday";
//             attendance.timeIn = null;
//             attendance.timeOut = null;
//             attendance.lateBy = 0;
//             attendance.totalHours = 0;
//             await attendance.save({ session });
//           }
//         } else {
//           const newAttendance = await AttendanceModel.create(
//             [
//               {
//                 employee: employee._id,
//                 employeeModell: "employeeModel",
//                 attendanceDate: newDate,
//                 status: "Holiday",
//                 timeIn: null,
//                 timeOut: null,
//                 lateBy: 0,
//                 totalHours: 0,
//                 previousAttendance: [],
//               },
//             ],
//             { session }
//           ).then((result) => result[0]);
//           holiday.affectedAttendance.push(newAttendance._id);
//         }
//       })
//     );

//     await holiday.save({ session });
//     await session.commitTransaction();
//     return res.status(201).json({ msg: "Holiday created and attendance updated successfully", data: holiday });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Holiday creation error:", error);
//     if (error.code === 11000) {
//       return res.status(409).json({ err: "Holiday or attendance already exists for this date" });
//     }
//     return res.status(500).json({ err: "Internal Server Error", details: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// Create a new holiday and update attendance records


// When deleting a holiday, we need to check the attendance records for that holiday date in the Attendance model for each employee. If the employee
//  has a record in the previousAttendance field, we must first update the attendance record for the holiday date to the value in the previousAttendance
//  field, and then delete the holiday. If the employee does not have a record in the previousAttendance field, we should only delete the attendance
//  for the holiday date.
//  We should also check if the holiday date is in the past. If it is, we should not allow the holiday to be deleted.

// const deleteHoliday = async (req, res) => {
//   try {
//     const _id = req.params.id;

//     // Validate the holiday ID
//     if (!mongoose.Types.ObjectId.isValid(_id))
//       return res.status(400).json({ err: "Invalid Id Format" });

//     // Fetch the holiday record
//     const holiday = await HolidayModel.findById(_id);
//     if (!holiday) return res.status(404).json({ err: "Holiday Not Found" });

//     // // Fetch all attendance records that match the holiday date
//     // const attendanceRecords = await AttendanceModel.find({
//     //   attendanceDate: holiday.date,
//     // });
//           // Ensure the holiday date is not in the past
//     if (holiday.date < new Date()) {
//       return res.status(400).json({
//         err: "Holiday date is in the past. Deletion is not allowed.",
//       });
//     }

//       // Find all attendance records for the holiday date
//     const attendanceRecords = await AttendanceModel.find({
//       attendanceDate: holiday.date,
//       status: "Holiday", // Only find records that are marked as Holiday
//     });

//     // Loop through all the attendance records and restore previous attendance if it exists for each employee
//     for (let attendance of attendanceRecords) {
//       // Check if the employee has previous attendance data
//       if (
//         attendance.previousAttendance &&
//         attendance.previousAttendance.length > 0
//       ) {
//         // Restore the previous attendance data if available
//         const previousAttendance = attendance.previousAttendance.pop(); // Get the last stored record
//         attendance.timeIn = previousAttendance.timeIn;
//         attendance.timeOut = previousAttendance.timeOut;
//         attendance.status = previousAttendance.status;
//         attendance.lateBy = previousAttendance.lateBy;
//         attendance.totalHours = previousAttendance.totalHours;
//         attendance.leaveConvertedToHolidayCount =
//           previousAttendance.leaveConvertedToHolidayCount;
//         attendance.updatedAt = previousAttendance.updatedAt;

//         // Clear the previousAttendance field
//         attendance.previousAttendance = [];

//         // Save the updated attendance
//         await attendance.save();
//       } else {
//         // If no previous attendance exists, delete the attendance record
//         await AttendanceModel.findOneAndDelete({
//           attendanceDate: holiday.date,
//           employee: attendance.employee, // Make sure we're deleting the right employee's record
//         });
//       }
//     }

//     // Delete the holiday record
//     const deletedHoliday = await HolidayModel.findByIdAndDelete(_id);
//     return res.status(200).json({
//       msg: "Holiday deleted successfully",
//       data: deletedHoliday,
//     });
//   } catch (error) {
//     console.error("Error deleting Holiday", error.message);
//     return res.status(500).json({
//       err: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

  // const deleteHoliday = async (req, res) => {
  //   try {
  //     const _id = req.params.id;

  //     // Validate the holiday ID
  //     if (!mongoose.Types.ObjectId.isValid(_id))
  //       return res.status(400).json({ err: "Invalid Id Format" });

  //       // Fetch the holiday record
  //       const holiday = await HolidayModel.findById(_id);
  //       if (!holiday) return res.status(404).json({ err: "Holiday Not Found" });

  //       // // Ensure the holiday date is not in the past
  //       // if (holiday.date < new Date()) {
  //       //   return res.status(400).json({
  //       //     err: "Holiday date is in the past. Deletion is not allowed.",
  //       //   });
  //       // }
  //       // Normalize the holiday date
  // const holidayDate = new Date(holiday.date);
  // holidayDate.setHours(0, 0, 0, 0);

  // // Normalize the current date
  // const currentDate = new Date();
  // currentDate.setHours(0, 0, 0, 0);

  // // Ensure the holiday date is not in the past
  // if (holidayDate < currentDate) {
  //   return res.status(400).json({
  //     err: "Holiday date is in the past. Deletion is not allowed.",
  //   });
  // }

  //       // Find all attendance records for the holiday date marked as "Holiday"
  //       const attendanceRecords = await AttendanceModel.find({
  //         attendanceDate: holiday.date,
  //         status: "Holiday", // Only find records that are marked as Holiday
  //       });

  //       // Bulk update or delete attendance records
  //       const bulkOps = attendanceRecords.map(attendance => {
  //         if (attendance.previousAttendance && attendance.previousAttendance.length > 0) {
  //           const previousAttendance = attendance.previousAttendance.pop(); // Get the last stored record
  //           return {
  //             updateOne: {
  //               filter: { _id: attendance._id },
  //               update: {
  //                 $set: {
  //                   timeIn: previousAttendance.timeIn,
  //                   timeOut: previousAttendance.timeOut,
  //                   status: previousAttendance.status,
  //                   lateBy: previousAttendance.lateBy,
  //                   totalHours: previousAttendance.totalHours,
  //                   leaveConvertedToHolidayCount: previousAttendance.leaveConvertedToHolidayCount,
  //                   updatedAt: previousAttendance.updatedAt,
  //                 },
  //                 $set: { previousAttendance: [] }, // Clear the previousAttendance field
  //               },
  //             },
  //           };
  //         } else {
  //           // Delete the attendance record if no previous attendance exists
  //           return {
  //             deleteOne: {
  //               filter: { _id: attendance._id },
  //             },
  //           };
  //         }
  //       });

  //       // Perform the bulk operations in a single query
  //       if (bulkOps.length > 0) {
  //         await AttendanceModel.bulkWrite(bulkOps);
  //       }

  //     // Delete the holiday record
  //     const deletedHoliday = await HolidayModel.findByIdAndDelete(_id);
  //     return res.status(200).json({
  //       msg: "Holiday deleted successfully",
  //       data: deletedHoliday,
  //     });
  //   } catch (error) {
  //     console.error("Error deleting Holiday", error.message);
  //     return res.status(500).json({
  //       err: "Internal Server Error",
  //       error: error.message,
  //     });
  //   }
  // };


// const updateHoliday = async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const { name, date, description } = req.body;

//     const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/; // Regex allowing some punctuation

//     // Validate the ID format
//     if (!mongoose.Types.ObjectId.isValid(_id)) {
//       return res.status(400).json({ err: "Invalid Id Format" });
//     }

//     // Validate name and description if they are provided
//     if (name && !nameRegex.test(name)) {
//       return res
//         .status(400)
//         .json({
//           err: "Invalid name. Only letters, numbers, and spaces are allowed.",
//         });
//     }

//     if (description && !nameRegex.test(description)) {
//       return res
//         .status(400)
//         .json({
//           err: "Invalid description. Only letters, numbers, spaces, and punctuation are allowed.",
//         });
//     }

//     // Prepare data to update
//     const data = {};
//     if (name) data.name = name;

//     const holiday = await HolidayModel.findById(_id);
//     if (!holiday) {
//       return res.status(404).json({ err: "Holiday Not Found" });
//     }

//     // Ensure holiday is created only for today or future dates
//     const today = new Date();
//     if (date && date < today) {
//       return res.status(400).json({ err: "Holiday date must be today or a future date" });
//     }

//     // Prevent updating past holidays
//     if (holiday.date < today) {
//       return res.status(400).json({ err: "Cannot update past holidays" });
//     }

//     // If the date is being changed, handle restoring previous attendance
//     if (holiday.date !== date) {
//       // Fetch all attendance records for the old holiday date
//       const attendanceRecords = await AttendanceModel.find({
//         attendanceDate: holiday.date,
//         status: "Holiday", // Only find records that are marked as Holiday        
//       });

//       // Loop through all the attendance records and restore previous attendance if it exists for each employee
//       for (let attendance of attendanceRecords) {
//         if (attendance.previousAttendance && attendance.previousAttendance.length > 0) {
//           const previousAttendance = attendance.previousAttendance.pop(); // Get the last stored record
//           attendance.timeIn = previousAttendance.timeIn;
//           attendance.timeOut = previousAttendance.timeOut;
//           attendance.status = previousAttendance.status;
//           attendance.lateBy = previousAttendance.lateBy;
//           attendance.totalHours = previousAttendance.totalHours;
//           attendance.leaveConvertedToHolidayCount = previousAttendance.leaveConvertedToHolidayCount;
//           attendance.updatedAt = previousAttendance.updatedAt;

//           // Clear the previousAttendance field after restoring
//           attendance.previousAttendance = [];

//           // Save the updated attendance
//           await attendance.save();
//         }else{
//           // If no previous attendance exists, delete the attendance record
//           await AttendanceModel.findOneAndDelete({ attendanceDate: holiday.date, employee: attendance.employee });
//         }
//       }

//       const employees = EmployeeModel.find();
//       for(let employee of employees)
//       {
//         let leaveCount = 0;
//         // Find attendance record for this employee on the holiday date
//         let attendance = await AttendanceModel.findOne({
//           employee: employee._id,
//           attendanceDate: date,
//         });

//         // If attendance exists, update previousAttendance and change the status to Holiday
//         if (attendance) {
//           if (attendance.status === "On Leave") {
//             leaveCount++;
//           }

//           // Save the current attendance record in the previousAttendance field
//           if (!attendance.previousAttendance) {
//             attendance.previousAttendance = [];
//           }
//           holiday.affectedAttendance.push(attendance._id);
//           attendance.previousAttendance.push({
//             timeIn: attendance.timeIn,
//             timeOut: attendance.timeOut,
//             status: attendance.status,
//             lateBy: attendance.lateBy,
//             totalHours: attendance.totalHours,
//             leaveConvertedToHolidayCount: leaveCount, // Store the leave count here
//             updatedAt: Date.now(),
//           });

//           // Update the attendance status to Holiday
//           attendance.status = "Holiday";
//           attendance.timeIn = null;
//           attendance.timeOut = null;
//           attendance.lateBy = 0;
//           attendance.totalHours = 0;

//           // Save the updated attendance
//           await attendance.save();
//         } else {
//           // If no attendance exists for this date, create a new attendance record for the holiday
//           const newAttendance = await AttendanceModel.create({
//             employee: employee._id,
//             attendanceDate: date,
//             status: "Holiday",
//             timeIn: null,
//             timeOut: null,
//             lateBy: 0,
//             totalHours: 0,
//           });
//           // Push the newly created attendance ID to the holiday
//           holiday.affectedAttendance.push(newAttendance._id);
//         }
//       }
//     }

//     // Update the holiday's fields (name, date, description)
//     if (date) data.date = date;
//     if (description) data.description = description;

//     // Perform the update
//     const updatedHoliday = await HolidayModel.findByIdAndUpdate(_id, data, {
//       new: true, // Return the updated holiday
//     });

//     // If no holiday found with the given ID
//     if (!updatedHoliday) {
//       return res.status(404).json({ err: "Holiday Not Found" });
//     }

//     // Return the updated holiday
//     return res.status(200).json({ msg: "Holiday Updated Successfully", updatedHoliday });
//   } catch (error) {
//     console.log("Error Updating Holiday", error);
//     return res.status(500).json({ err: "Internal Server Error", error: error.message });
//   }
// };



// const updateHoliday = async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const { name, date, description } = req.body;

//     const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/; // Regex allowing some punctuation

//     // Validate the ID format
//     if (!mongoose.Types.ObjectId.isValid(_id)) {
//       return res.status(400).json({ err: "Invalid Id Format" });
//     }

//     // Validate name and description if they are provided
//     if (name && !nameRegex.test(name)) {
//       return res.status(400).json({
//         err: "Invalid name. Only letters, numbers, and spaces are allowed.",
//       });
//     }

//     if (description && !nameRegex.test(description)) {
//       return res.status(400).json({
//         err: "Invalid description. Only letters, numbers, spaces, and punctuation are allowed.",
//       });
//     }

//     // Prepare data to update
//     const data = {};
//     if (name) data.name = name;

//     const holiday = await HolidayModel.findById(_id);
//     if (!holiday) {
//       return res.status(404).json({ err: "Holiday Not Found" });
//     }

//     // Ensure holiday is created only for today or future dates
//     const today = new Date();
//     if (date && new Date(date) < today) {
//       return res.status(400).json({ err: "Holiday date must be today or a future date" });
//     }

//     // Prevent updating past holidays
//     if ( new Date(holiday.date) < today) {
//       return res.status(400).json({ err: "Cannot update past holidays" });
//     }

//     // // If the date is being changed, handle restoring previous attendance
//     // if (holiday.date !== date) {
//     //   if (CheckEverlapingHolidays.length > 0) {
//     //     return res.status(400).json({ err: "Holiday of this date already exists" });
//     //   }

//         // Check if the date is changed, and if so, ensure no holiday exists for the new date
//         // if (holiday.date !== date) {
//         //   const existingHoliday = await HolidayModel.findOne({ date: date });
//         //   if (existingHoliday) {
//         //     return res.status(400).json({ err: "Holiday for this date already exists" });
//         //   }    

//         if (new Date(date).getTime() !== new Date(holiday.date).getTime()) {
//           // The dates are different – proceed with checking if the updated date exists
//           const existingHoliday = await HolidayModel.findOne({ date: date });
//           if (existingHoliday) {
//             return res.status(400).json({ err: "Holiday for this date already exists" });
//           }

//       // Fetch all attendance records for the old holiday date
//       const attendanceRecords = await AttendanceModel.find({
//         attendanceDate: holiday.date,
//         status: "Holiday", // Only find records that are marked as Holiday        
//       });

//       // Loop through all the attendance records and restore previous attendance if it exists for each employee
//       for (let attendance of attendanceRecords) {
//         if (attendance.previousAttendance && attendance.previousAttendance.length > 0) {
//           const previousAttendance = attendance.previousAttendance.pop(); // Get the last stored record
//           attendance.timeIn = previousAttendance.timeIn;
//           attendance.timeOut = previousAttendance.timeOut;
//           attendance.status = previousAttendance.status;
//           attendance.lateBy = previousAttendance.lateBy;
//           attendance.totalHours = previousAttendance.totalHours;
//           attendance.leaveConvertedToHolidayCount = previousAttendance.leaveConvertedToHolidayCount;
//           attendance.updatedAt = previousAttendance.updatedAt;

//           // Clear the previousAttendance field after restoring
//           attendance.previousAttendance = [];

//           // Save the updated attendance
//           await attendance.save();
//         } else {
//           // If no previous attendance exists, delete the attendance record
//           await AttendanceModel.findOneAndDelete({
//             attendanceDate: holiday.date,
//             employee: attendance.employee,
//           });
//         }
//       }
//     }

//     // Fetch all employees
//     const employees = await EmployeeModel.find();

//     // Loop through all employees to update or create attendance for the new holiday date
//     for (let employee of employees) {
//       let leaveCount = 0;

//       // Find attendance record for this employee on the new holiday date
//       let attendance = await AttendanceModel.findOne({
//         employee: employee._id,
//         attendanceDate: date,
//       });

//       // If attendance exists, update previousAttendance and change the status to Holiday
//       if (attendance) {
//         if (attendance.status === "On Leave") {
//           leaveCount++;
//         }

//         // Save the current attendance record in the previousAttendance field
//         if (!attendance.previousAttendance) {
//           attendance.previousAttendance = [];
//         }

//         // Push the current attendance to the holiday's affectedAttendance
//         holiday.affectedAttendance.push(attendance._id);

//         attendance.previousAttendance.push({
//           timeIn: attendance.timeIn,
//           timeOut: attendance.timeOut,
//           status: attendance.status,
//           lateBy: attendance.lateBy,
//           totalHours: attendance.totalHours,
//           leaveConvertedToHolidayCount: leaveCount, // Store the leave count here
//           updatedAt: Date.now(),
//         });

//         // Update the attendance status to Holiday
//         attendance.status = "Holiday";
//         attendance.timeIn = null;
//         attendance.timeOut = null;
//         attendance.lateBy = 0;
//         attendance.totalHours = 0;

//         // Save the updated attendance
//         await attendance.save();
//       } else {
//         // If no attendance exists for this date, create a new attendance record for the holiday
//         const newAttendance = await AttendanceModel.create({
//           employee: employee._id,
//           attendanceDate: date,
//           status: "Holiday",
//           timeIn: null,
//           timeOut: null,
//           lateBy: 0,
//           totalHours: 0,
//         });

//         // Push the newly created attendance ID to the holiday's affectedAttendance
//         holiday.affectedAttendance.push(newAttendance._id);
//       }
//     }

//     // Update the holiday's fields (name, date, description)
//     if (date) data.date = date;
//     if (description) data.description = description;

//     // Perform the update
//     const updatedHoliday = await HolidayModel.findByIdAndUpdate(_id, data, {
//       new: true, // Return the updated holiday
//     });

//     // If no holiday found with the given ID
//     if (!updatedHoliday) {
//       return res.status(404).json({ err: "Holiday Not Found" });
//     }

//     // Return the updated holiday
//     return res.status(200).json({ msg: "Holiday Updated Successfully", updatedHoliday });
//   } catch (error) {
//     console.log("Error Updating Holiday", error);
//     return res.status(500).json({ err: "Internal Server Error", error: error.message });
//   }
// };


// Get Holidays
const getHolidays = async (req, res) => {
  try {
    const holidays = await HolidayModel.find()
      .populate("createdBy")
      .populate("affectedAttendance");
      
    if (!holidays.length) return res.status(404).json({ err: "No Holidays Found" });

    res.status(200).json(holidays);
  } catch (error) {
    console.error("Holiday fetch error:", error);
    return res
      .status(500)
      .json({ err: "Internal Server Error", error: error.message });
    }
};

const getSingleHoliday = async (req, res) => {
  try {
    const _id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(400).json({ err: "Invalid Id Format" });
    
    const holiday = await HolidayModel.findById(_id)
    .populate("createdBy")
    .populate("affectedAttendance");
    
    if (!holiday.length) return res.status(404).json({ err: "Holiday Not Found" });
    
    return res.status(200).json(holiday);
  } catch (error) {
    console.log("Error Fetching Single Holiday", error);
    return res
    .status(500)
    .json({ err: "Internal Server Error", error: error.message });
  }
};


const createHoliday = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Extract holiday details from request body
    const { name, date, description, createdBy } = req.body;

    // Regular expression to validate name and description
    const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/;

    // Validate name
    if (!name || !nameRegex.test(name)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        err: "Invalid name. Only letters, numbers, spaces, and some punctuation are allowed.",
      });
    }

    // Validate description (optional)
    if (description && !nameRegex.test(description)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        err: "Invalid description. Only letters, numbers, spaces, and some punctuation are allowed.",
      });
    }

    // Validate date
    if (!date) {
      await session.abortTransaction(); 
      session.endSession();
      return res.status(400).json({ err: "Date is required" });
    }

    // Normalize dates to midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const holidayDate = new Date(date);
    holidayDate.setHours(0, 0, 0, 0);

    // Ensure holiday is for today or a future date
    if (holidayDate.getTime() < today.getTime()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ err: "Holiday date must be today or a future date" });
    }

    // Check if holiday falls on a weekend
    const dayOfWeek = holidayDate.getDay();
    if (dayOfWeek === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ err: "Holiday cannot be created on Sunday (weekend)" });
    }
    if (dayOfWeek === 6) {
      const weekNumber = Math.ceil(holidayDate.getDate() / 7);
      if (weekNumber % 2 === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ err: "Holiday cannot be created on even-numbered Saturdays (weekend)" });
      }
    }

    // Check for duplicate holiday
    const existingHoliday = await HolidayModel.findOne({ date: holidayDate });
    if (existingHoliday) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ err: "A holiday already exists on this date" });
    }

    // Create the holiday record
    const holiday = await HolidayModel.create(
      [{
        name,
        date: holidayDate,
        description: description || "",
        createdBy,
        affectedAttendance: [],
      }],
      { session }
    ).then((result) => result[0]);

    // Fetch all employees
    const employees = await EmployeeModel.find().session(session);

    // Process each employee's attendance for the holiday date
    await Promise.all(
      employees.map(async (employee) => {
        // Check if attendance exists for this employee on the holiday date
        let attendance = await AttendanceModel.findOne({
          employee: employee._id,
          attendanceDate: holidayDate,
        }).session(session);

        if (attendance) {
          // If attendance exists and is "On Leave", reduce leave balance
          if (attendance.status === "On Leave") {
            // Find the leave request associated with this attendance
            const leave = await LeaveModel.findOne({
              employee: employee._id,
              startDate: { $lte: holidayDate },
              endDate: { $gte: holidayDate },
              status: "Approved",
              affectedAttendance: attendance._id,
            }).session(session);

            if (leave) {
              // Update employee's leave balance for this leave type
              const leaveBalance = employee.leaveBalances.find((balance) =>
                balance.leaveTypeId.equals(leave.leaveType)
              );

              if (leaveBalance && leaveBalance.currentBalance > 0) {
                leaveBalance.currentBalance -= 1; // Reduce one leave day
                await employee.save({ session }); // Save updated employee

                // Update leave record's calculatedDays
                if (leave.calculatedDays > 0) {
                  leave.calculatedDays -= 1;
                  // Add holiday to leave's holidays array if not already present
                  if (!leave.holidays.some(h => h.equals(holiday._id))) {
                    leave.holidays.push(holiday._id);
                  }
                  await leave.save({ session });
                }
              }
            }

            // Convert "On Leave" to "Holiday" and store previous data
            if (!attendance.previousAttendance) {
              attendance.previousAttendance = [];
            }
            attendance.previousAttendance.push({
              timeIn: attendance.timeIn,
              timeOut: attendance.timeOut,
              status: attendance.status,
              lateBy: attendance.lateBy,
              totalHours: attendance.totalHours,
              leaveConvertedToHolidayCount: 1, // Mark that it was converted from "On Leave"
              updatedAt: Date.now(),
            });
            attendance.status = "Holiday";
            attendance.timeIn = null;
            attendance.timeOut = null;
            attendance.lateBy = 0;
            attendance.totalHours = 0;
            holiday.affectedAttendance.push(attendance._id);
            await attendance.save({ session });
          }
          // Handle other statuses ("On Time", "Late", "Absence")
          else if (["On Time", "Late", "Absence"].includes(attendance.status)) {
            if (!attendance.previousAttendance) {
              attendance.previousAttendance = [];
            }
            attendance.previousAttendance.push({
              timeIn: attendance.timeIn,
              timeOut: attendance.timeOut,
              status: attendance.status,
              lateBy: attendance.lateBy,
              totalHours: attendance.totalHours,
              leaveConvertedToHolidayCount: 0,
              updatedAt: Date.now(),
            });
            attendance.status = "Holiday";
            attendance.timeIn = null;
            attendance.timeOut = null;
            attendance.lateBy = 0;
            attendance.totalHours = 0;
            holiday.affectedAttendance.push(attendance._id);
            await attendance.save({ session });
          }
        } else {
          // If no attendance exists, create a new "Holiday" record
          const newAttendance = await AttendanceModel.create(
            [{
              employee: employee._id,
              employeeModell: "employeeModel",
              attendanceDate: holidayDate,
              status: "Holiday",
              timeIn: null,
              timeOut: null,
              lateBy: 0,
              totalHours: 0,
              previousAttendance: [],
            }],
            { session }
          ).then((result) => result[0]);
          holiday.affectedAttendance.push(newAttendance._id);
        }
      })
    );

    // Save the holiday with updated affectedAttendance
    await holiday.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      msg: "Holiday created, attendance updated, and leave balances adjusted successfully",
      data: holiday,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Holiday creation error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ err: "Holiday or attendance already exists for this date" });
    }
    return res.status(500).json({ err: "Internal Server Error", details: error.message });
  }
};

// const deleteHoliday = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const _id = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(_id)) {
//       return res.status(400).json({ err: "Invalid Id Format" });
//     }

//     const holiday = await HolidayModel.findById(_id);
//     if (!holiday) {
//       return res.status(404).json({ err: "Holiday Not Found" });
//     }

//     const holidayDate = new Date(holiday.date);
//     holidayDate.setHours(0, 0, 0, 0);

//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0);

//     // Optional: Comment out if you want to allow past holiday deletion
//     if (holidayDate < currentDate) {
//       return res.status(400).json({
//         err: "Holiday date is in the past. Deletion is not allowed.",
//       });
//     }

//     const attendanceRecords = await AttendanceModel.find({
//       attendanceDate: holidayDate,
//       status: "Holiday",
//     });

//     const bulkOps = attendanceRecords.map((attendance) => {
//       if (attendance.previousAttendance && attendance.previousAttendance.length > 0) {
//         const previousAttendance = attendance.previousAttendance.pop();
//         return {
//           updateOne: {
//             filter: { _id: attendance._id },
//             update: {
//               $set: {
//                 timeIn: previousAttendance.timeIn,
//                 timeOut: previousAttendance.timeOut,
//                 status: previousAttendance.status,
//                 lateBy: previousAttendance.lateBy,
//                 totalHours: previousAttendance.totalHours,
//                 leaveConvertedToHolidayCount: previousAttendance.leaveConvertedToHolidayCount,
//                 updatedAt: previousAttendance.updatedAt,
//                 previousAttendance: attendance.previousAttendance, // Keep remaining entries
//               },
//             },
//           },
//         };
//       } else {
//         return {
//           deleteOne: {
//             filter: { _id: attendance._id },
//           },
//         };
//       }
//     });

//     if (bulkOps.length > 0) {
//       await AttendanceModel.bulkWrite(bulkOps, { session });
//     }

//     const deletedHoliday = await HolidayModel.findByIdAndDelete(_id, { session });
//     await session.commitTransaction();
//     return res.status(200).json({
//       msg: "Holiday deleted successfully",
//       data: deletedHoliday,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Error deleting Holiday:", error.message);
//     if (error.code === 11000) {
//       return res.status(409).json({ err: "Conflict in attendance or holiday data" });
//     }
//     return res.status(500).json({ err: "Internal Server Error", details: error.message });
//   } finally {
//     session.endSession();
//   }
// };


const deleteHoliday = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const _id = req.params.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ err: "Invalid Id Format" });
    }

    // Find the holiday
    const holiday = await HolidayModel.findById(_id).session(session);
    if (!holiday) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ err: "Holiday Not Found" });
    }

    const holidayDate = new Date(holiday.date);
    holidayDate.setHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Optional: Prevent deletion of past holidays
    if (holidayDate < currentDate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        err: "Holiday date is in the past. Deletion is not allowed.",
      });
    }

    // Find attendance records affected by this holiday (using affectedAttendance)
    const attendanceRecords = await AttendanceModel.find({
      _id: { $in: holiday.affectedAttendance },
      attendanceDate: holidayDate,
      status: "Holiday",
    }).session(session);

    const bulkOps = [];
    const employeesToUpdate = new Map(); // Track employees for leave balance updates

    // Process each attendance record
    await Promise.all(
      attendanceRecords.map(async (attendance) => {
        if (attendance.previousAttendance && attendance.previousAttendance.length > 0) {
          const previousAttendance = attendance.previousAttendance[attendance.previousAttendance.length - 1];

          // If reverting to "On Leave", adjust leave balance and leave record
          if (previousAttendance.status === "On Leave") {
            const employee = await EmployeeModel.findById(attendance.employee).session(session);
            const leave = await LeaveModel.findOne({
              employee: attendance.employee,
              startDate: { $lte: holidayDate },
              endDate: { $gte: holidayDate },
              status: "Approved",
              affectedAttendance: attendance._id,
            }).session(session);

            if (leave && employee) {
              const leaveBalance = employee.leaveBalances.find((balance) =>
                balance.leaveTypeId.equals(leave.leaveType)
              );
              if (leaveBalance) {
                leaveBalance.currentBalance -= 1; // Decrease leave balance (undo the increase)
                leave.calculatedDays += 1; // Restore the original calculated days
                leave.holidays = leave.holidays.filter(h => !h.equals(holiday._id)); // Remove holiday ID
                employeesToUpdate.set(employee._id.toString(), employee);
                await leave.save({ session });
              }
            }
          }

          // Revert attendance to previous state
          bulkOps.push({
            updateOne: {
              filter: { _id: attendance._id },
              update: {
                $set: {
                  timeIn: previousAttendance.timeIn,
                  timeOut: previousAttendance.timeOut,
                  status: previousAttendance.status,
                  lateBy: previousAttendance.lateBy,
                  totalHours: previousAttendance.totalHours,
                  leaveConvertedToHolidayCount: previousAttendance.leaveConvertedToHolidayCount,
                  updatedAt: previousAttendance.updatedAt,
                  previousAttendance: attendance.previousAttendance.slice(0, -1), // Remove the popped entry
                },
              },
            },
          });
        } else {
          // Delete attendance if it was created by createHoliday (no previous state)
          bulkOps.push({
            deleteOne: {
              filter: { _id: attendance._id },
            },
          });
        }
      })
    );

    // Apply bulk attendance updates
    if (bulkOps.length > 0) {
      await AttendanceModel.bulkWrite(bulkOps, { session });
    }

    // Save updated employees with reverted leave balances
    for (const employee of employeesToUpdate.values()) {
      await employee.save({ session });
    }

    // Delete the holiday
    const deletedHoliday = await HolidayModel.findByIdAndDelete(_id, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      msg: "Holiday deleted successfully, attendance and leave balances reverted",
      data: deletedHoliday,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting Holiday:", error.message);
    if (error.code === 11000) {
      return res.status(409).json({ err: "Conflict in attendance or holiday data" });
    }
    return res.status(500).json({ err: "Internal Server Error", details: error.message });
  }
};


// const updateHoliday = async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const { name, date, description } = req.body;
//     const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/; // Regex allowing some punctuation

//     // Validate the ID format
//     if (!mongoose.Types.ObjectId.isValid(_id)) {
//       return res.status(400).json({ err: "Invalid Id Format" });
//     }

//     // Validate name and description if provided
//     if (name && !nameRegex.test(name)) {
//       return res.status(400).json({
//         err: "Invalid name. Only letters, numbers, and spaces are allowed.",
//       });
//     }
//     if (description && !nameRegex.test(description)) {
//       return res.status(400).json({
//         err: "Invalid description. Only letters, numbers, spaces, and punctuation are allowed.",
//       });
//     }

//     // Prepare data to update
//     const data = {};
//     if (name) data.name = name;

//     const holiday = await HolidayModel.findById(_id);
//     if (!holiday) {
//       return res.status(404).json({ err: "Holiday Not Found" });
//     }

//     // Normalize dates by zeroing out the time portion
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const newDate = new Date(date);
//     newDate.setHours(0, 0, 0, 0);

//     const holidayDate = new Date(holiday.date);
//     holidayDate.setHours(0, 0, 0, 0);

//     // Ensure holiday date is today or in the future
//     if (newDate < today) {
//       return res.status(400).json({ err: "Holiday date must be today or a future date" });
//     }

//     // Prevent updating past holidays
//     if (holidayDate < today) {
//       return res.status(400).json({ err: "Cannot update past holidays" });
//     }

//     // Check if the date is changed
//     if (newDate.getTime() !== holidayDate.getTime()) {
//       // Check if a holiday already exists for the updated date
//       const existingHoliday = await HolidayModel.findOne({ date: date });
//       if (existingHoliday) {
//         return res.status(400).json({ err: "Holiday for this date already exists" });
//       }

//       // Fetch all attendance records for the old holiday date with status "Holiday"
//       const attendanceRecords = await AttendanceModel.find({
//         attendanceDate: holiday.date,
//         status: "Holiday",
//       });

//       // Use Promise.all() to process all attendance records concurrently
//       await Promise.all(
//         attendanceRecords.map(async (attendance) => {
//           if (attendance.previousAttendance && attendance.previousAttendance.length > 0) {
//             const previousAttendance = attendance.previousAttendance.pop(); // Get the last stored record
//             attendance.timeIn = previousAttendance.timeIn;
//             attendance.timeOut = previousAttendance.timeOut;
//             attendance.status = previousAttendance.status;
//             attendance.lateBy = previousAttendance.lateBy;
//             attendance.totalHours = previousAttendance.totalHours;
//             attendance.leaveConvertedToHolidayCount = previousAttendance.leaveConvertedToHolidayCount;
//             attendance.updatedAt = previousAttendance.updatedAt;

//             // Clear the previousAttendance field after restoring
//             attendance.previousAttendance = [];
//             await attendance.save();
//           } else {
//             await AttendanceModel.findOneAndDelete({
//               attendanceDate: holiday.date,
//               employee: attendance.employee,
//             });
//           }
//         })
//       );
//     }

//     // Fetch all employees
//     const employees = await EmployeeModel.find();

//     // Update or create attendance records for the new holiday date concurrently
//     await Promise.all(
//       employees.map(async (employee) => {
//         let leaveCount = 0;
//         let attendance = await AttendanceModel.findOne({
//           employee: employee._id,
//           attendanceDate: date,
//         });

//         if (attendance) {
//           if (attendance.status === "On Leave") {
//             leaveCount++;
//           }
//           if (!attendance.previousAttendance) {
//             attendance.previousAttendance = [];
//           }
//           holiday.affectedAttendance.push(attendance._id);
//           attendance.previousAttendance.push({
//             timeIn: attendance.timeIn,
//             timeOut: attendance.timeOut,
//             status: attendance.status,
//             lateBy: attendance.lateBy,
//             totalHours: attendance.totalHours,
//             leaveConvertedToHolidayCount: leaveCount,
//             updatedAt: Date.now(),
//           });
//           attendance.status = "Holiday";
//           attendance.timeIn = null;
//           attendance.timeOut = null;
//           attendance.lateBy = 0;
//           attendance.totalHours = 0;
//           await attendance.save();
//         } else {
//           const newAttendance = await AttendanceModel.create({
//             employee: employee._id,
//             attendanceDate: date,
//             status: "Holiday",
//             timeIn: null,
//             timeOut: null,
//             lateBy: 0,
//             totalHours: 0,
//           });
//           holiday.affectedAttendance.push(newAttendance._id);
//         }
//       })
//     );

//     // Update the holiday's fields
//     if (date) data.date = date;
//     if (description) data.description = description;

//     // Update the holiday document and return the updated record
//     const updatedHoliday = await HolidayModel.findByIdAndUpdate(_id, data, {
//       new: true,
//     });
//     if (!updatedHoliday) {
//       return res.status(404).json({ err: "Holiday Not Found" });
//     }

//     return res.status(200).json({ msg: "Holiday Updated Successfully", updatedHoliday });
//   } catch (error) {
//     console.log("Error Updating Holiday", error);
//     return res.status(500).json({ err: "Internal Server Error", error: error.message });
//   }
// };

const updateHoliday = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const _id = req.params.id;
    const { name, date, description } = req.body;
    const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ err: "Invalid Id Format" });
    }

    // Validate name and description
    if (name && !nameRegex.test(name)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ err: "Invalid name..." });
    }
    if (description && !nameRegex.test(description)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ err: "Invalid description..." });
    }

    // Find holiday
    const holiday = await HolidayModel.findById(_id).session(session);
    if (!holiday) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ err: "Holiday Not Found" });
    }

    // Normalize dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    const oldDate = new Date(holiday.date);
    oldDate.setHours(0, 0, 0, 0);

    // Validate dates
    if (newDate < today) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ err: "Holiday date must be today or a future date" });
    }
    if (oldDate < today) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ err: "Cannot update past holidays" });
    }

    // Handle date change
    const employeesToUpdate = new Map();
    if (newDate.getTime() !== oldDate.getTime()) {
      // Check for duplicate holiday
      const existingHoliday = await HolidayModel.findOne({
        date: newDate,
        _id: { $ne: _id },
      }).session(session);
      if (existingHoliday) {
        await session.abortTransaction();
        session.endSession();
        return res.status(409).json({ err: "A holiday already exists on this date" });
      }

      // Revert old date (like deleteHoliday)
      const oldAttendanceRecords = await AttendanceModel.find({
        _id: { $in: holiday.affectedAttendance },
        attendanceDate: oldDate,
        status: "Holiday",
      }).session(session);

      const bulkRevertOps = [];
      await Promise.all(
        oldAttendanceRecords.map(async (attendance) => {
          if (attendance.previousAttendance && attendance.previousAttendance.length > 0) {
            const previousAttendance = attendance.previousAttendance[attendance.previousAttendance.length - 1];
            if (previousAttendance.status === "On Leave") {
              const employee = await EmployeeModel.findById(attendance.employee).session(session);
              const leave = await LeaveModel.findOne({
                employee: attendance.employee,
                startDate: { $lte: oldDate },
                endDate: { $gte: oldDate },
                status: "Approved",
                affectedAttendance: attendance._id,
              }).session(session);
              if (leave && employee) {
                const leaveBalance = employee.leaveBalances.find((balance) =>
                  balance.leaveTypeId.equals(leave.leaveType)
                );
                if (leaveBalance) {
                  leaveBalance.currentBalance -= 1;
                  leave.calculatedDays += 1;
                  leave.holidays = leave.holidays.filter(h => !h.equals(holiday._id));
                  employeesToUpdate.set(employee._id.toString(), employee);
                  await leave.save({ session });
                }
              }
            }
            bulkRevertOps.push({
              updateOne: {
                filter: { _id: attendance._id },
                update: {
                  $set: {
                    timeIn: previousAttendance.timeIn,
                    timeOut: previousAttendance.timeOut,
                    status: previousAttendance.status,
                    lateBy: previousAttendance.lateBy,
                    totalHours: previousAttendance.totalHours,
                    leaveConvertedToHolidayCount: previousAttendance.leaveConvertedToHolidayCount,
                    updatedAt: previousAttendance.updatedAt,
                    previousAttendance: attendance.previousAttendance.slice(0, -1),
                  },
                },
              },
            });
          } else {
            bulkRevertOps.push({
              deleteOne: { filter: { _id: attendance._id } },
            });
          }
        })
      );
      if (bulkRevertOps.length > 0) {
        await AttendanceModel.bulkWrite(bulkRevertOps, { session });
      }

      // Clear affectedAttendance for new date
      holiday.affectedAttendance = [];

      // Apply new date (like createHoliday)
      const employees = await EmployeeModel.find().session(session);
      await Promise.all(
        employees.map(async (employee) => {
          let attendance = await AttendanceModel.findOne({
            employee: employee._id,
            attendanceDate: newDate,
          }).session(session);

          if (attendance) {
            if (attendance.status === "On Leave") {
              const leave = await LeaveModel.findOne({
                employee: employee._id,
                startDate: { $lte: newDate },
                endDate: { $gte: newDate },
                status: "Approved",
                affectedAttendance: attendance._id,
              }).session(session);
              if (leave) {
                const leaveBalance = employee.leaveBalances.find((balance) =>
                  balance.leaveTypeId.equals(leave.leaveType)
                );
                if (leaveBalance) {
                  leaveBalance.currentBalance += 1;
                  await employee.save({ session });
                  if (leave.calculatedDays > 0) {
                    leave.calculatedDays -= 1;
                    if (!leave.holidays.some(h => h.equals(holiday._id))) {
                      leave.holidays.push(holiday._id);
                    }
                    await leave.save({ session });
                  }
                }
              }
            }
            if (!attendance.previousAttendance) attendance.previousAttendance = [];
            attendance.previousAttendance.push({
              timeIn: attendance.timeIn,
              timeOut: attendance.timeOut,
              status: attendance.status,
              lateBy: attendance.lateBy,
              totalHours: attendance.totalHours,
              leaveConvertedToHolidayCount: attendance.status === "On Leave" ? 1 : 0,
              updatedAt: Date.now(),
            });
            attendance.status = "Holiday";
            attendance.timeIn = null;
            attendance.timeOut = null;
            attendance.lateBy = 0;
            attendance.totalHours = 0;
            holiday.affectedAttendance.push(attendance._id);
            await attendance.save({ session });
          } else {
            const newAttendance = await AttendanceModel.create(
              [{
                employee: employee._id,
                employeeModell: "employeeModel",
                attendanceDate: newDate,
                status: "Holiday",
                timeIn: null,
                timeOut: null,
                lateBy: 0,
                totalHours: 0,
                previousAttendance: [],
              }],
              { session }
            ).then((result) => result[0]);
            holiday.affectedAttendance.push(newAttendance._id);
          }
        })
      );
    }

    // Update holiday fields
    if (name) holiday.name = name;
    if (date) holiday.date = newDate;
    if (description) holiday.description = description;
    await holiday.save({ session });

    // Save updated employees
    for (const employee of employeesToUpdate.values()) {
      await employee.save({ session });
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      msg: "Holiday updated successfully",
      data: holiday,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating Holiday:", error);
    return res.status(500).json({ err: "Internal Server Error", details: error.message });
  }
};


module.exports = {
  createHoliday,
  getHolidays,
  deleteHoliday,
  updateHoliday,
  getSingleHoliday,
};
