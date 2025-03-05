const HolidayModel = require("../models/HolidayModel");
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


// Get Holidays
const getHolidays = async (req, res) => {
  try {
    const holidays = await HolidayModel.find()
      .populate("createdBy")
      .populate("affectedAttendance");
      
    if (!holidays) return res.status(404).json({ err: "NO Holidays Found" });

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
    
    if (!holiday) return res.status(404).json({ err: "Holiday Not Found" });
    
    return res.status(200).json(holiday);
  } catch (error) {
    console.log("Error Fetching Single Holiday", error);
    return res
    .status(500)
    .json({ err: "Internal Server Error", error: error.message });
  }
};

// Create Holiday
const createHoliday = async (req, res) => {
  try {
    const { name, date, description, createdBy } = req.body;

    const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/; // Regex allowing some punctuation

    // Validate name and description
    if (!nameRegex.test(name)) {
      return res
        .status(400)
        .json({
          err: "Invalid name. Only letters, numbers, and spaces are allowed.",
        });
    }
    if (!nameRegex.test(description)) {
      return res
        .status(400)
        .json({ 
          err: "Invalid description. Only letters, numbers, spaces, and punctuation are allowed.",
        });
    }

    // Check if holiday already exists
    const existingHoliday = await HolidayModel.findOne({ date: date });
    if (existingHoliday) {
      return res
        .status(409)
        .json({ err: "Holiday already exists for this date" });
    }

    // Ensure holiday is created only for today or future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time from today

    if (date < today) {
      return res
        .status(400)
        .json({ err: "Holiday date must be today or a future date" });
    }

    // Create holiday record
    const holiday = await HolidayModel.create({
      name,
      date,
      description,
      createdBy,
      affectedAttendance: [], // Initialize affectedAttendance as an empty array
    });

    // Fetch all employees from the employee model
    const employees = await EmployeeModel.find();

    // Loop through each employee and update attendance
    for (let employee of employees) {
      let leaveCount = 0;
      // Find attendance record for this employee on the holiday date
      let attendance = await AttendanceModel.findOne({
        employee: employee._id,
        attendanceDate: date,
      });

      // If attendance exists, update previousAttendance and change the status to Holiday
      if (attendance) {
        if (attendance.status === "On Leave") {
          leaveCount++;
        }

        // Save the current attendance record in the previousAttendance field
        if (!attendance.previousAttendance) {
          attendance.previousAttendance = [];
        }
        holiday.affectedAttendance.push(attendance._id);
        attendance.previousAttendance.push({
          timeIn: attendance.timeIn,
          timeOut: attendance.timeOut,
          status: attendance.status,
          lateBy: attendance.lateBy,
          totalHours: attendance.totalHours,
          leaveConvertedToHolidayCount: leaveCount, // Store the leave count here
          updatedAt: Date.now(),
        });

        // Update the attendance status to Holiday
        attendance.status = "Holiday";
        attendance.timeIn = null;
        attendance.timeOut = null;
        attendance.lateBy = 0;
        attendance.totalHours = 0;

        // Save the updated attendance
        await attendance.save();
      } else {
        // If no attendance exists for this date, create a new attendance record for the holiday
        const newAttendance = await AttendanceModel.create({
          employee: employee._id,
          attendanceDate: date,
          status: "Holiday",
          timeIn: null,
          timeOut: null,
          lateBy: 0,
          totalHours: 0,
        });
        // Push the newly created attendance ID to the holiday
        holiday.affectedAttendance.push(newAttendance._id);
      }
    }
    // Save the holiday with updated affected attendance list
    await holiday.save();
    return res.status(201).json({ msg: "Holiday created successfully", data: holiday });
  } catch (error) {
    console.error("Holiday creation error:", error);
    return res.status(500).json({ err: "Internal Server Error", error: error.message });
  }
};
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

const deleteHoliday = async (req, res) => {
  try {
    const _id = req.params.id;

    // Validate the holiday ID
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(400).json({ err: "Invalid Id Format" });

      // Fetch the holiday record
      const holiday = await HolidayModel.findById(_id);
      if (!holiday) return res.status(404).json({ err: "Holiday Not Found" });

      // Ensure the holiday date is not in the past
      if (holiday.date < new Date()) {
        return res.status(400).json({
          err: "Holiday date is in the past. Deletion is not allowed.",
        });
      }

      // Find all attendance records for the holiday date marked as "Holiday"
      const attendanceRecords = await AttendanceModel.find({
        attendanceDate: holiday.date,
        status: "Holiday", // Only find records that are marked as Holiday
      });

      // Bulk update or delete attendance records
      const bulkOps = attendanceRecords.map(attendance => {
        if (attendance.previousAttendance && attendance.previousAttendance.length > 0) {
          const previousAttendance = attendance.previousAttendance.pop(); // Get the last stored record
          return {
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
                },
                $set: { previousAttendance: [] }, // Clear the previousAttendance field
              },
            },
          };
        } else {
          // Delete the attendance record if no previous attendance exists
          return {
            deleteOne: {
              filter: { _id: attendance._id },
            },
          };
        }
      });

      // Perform the bulk operations in a single query
      if (bulkOps.length > 0) {
        await AttendanceModel.bulkWrite(bulkOps);
      }

    // Delete the holiday record
    const deletedHoliday = await HolidayModel.findByIdAndDelete(_id);
    return res.status(200).json({
      msg: "Holiday deleted successfully",
      data: deletedHoliday,
    });
  } catch (error) {
    console.error("Error deleting Holiday", error.message);
    return res.status(500).json({
      err: "Internal Server Error",
      error: error.message,
    });
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

const updateHoliday = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, date, description } = req.body;
    const nameRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/; // Regex allowing some punctuation

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ err: "Invalid Id Format" });
    }

    // Validate name and description if provided
    if (name && !nameRegex.test(name)) {
      return res.status(400).json({
        err: "Invalid name. Only letters, numbers, and spaces are allowed.",
      });
    }
    if (description && !nameRegex.test(description)) {
      return res.status(400).json({
        err: "Invalid description. Only letters, numbers, spaces, and punctuation are allowed.",
      });
    }

    // Prepare data to update
    const data = {};
    if (name) data.name = name;

    const holiday = await HolidayModel.findById(_id);
    if (!holiday) {
      return res.status(404).json({ err: "Holiday Not Found" });
    }

    // Normalize dates by zeroing out the time portion
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);

    const holidayDate = new Date(holiday.date);
    holidayDate.setHours(0, 0, 0, 0);

    // Ensure holiday date is today or in the future
    if (newDate < today) {
      return res.status(400).json({ err: "Holiday date must be today or a future date" });
    }

    // Prevent updating past holidays
    if (holidayDate < today) {
      return res.status(400).json({ err: "Cannot update past holidays" });
    }

    // Check if the date is changed
    if (newDate.getTime() !== holidayDate.getTime()) {
      // Check if a holiday already exists for the updated date
      const existingHoliday = await HolidayModel.findOne({ date: date });
      if (existingHoliday) {
        return res.status(400).json({ err: "Holiday for this date already exists" });
      }

      // Fetch all attendance records for the old holiday date with status "Holiday"
      const attendanceRecords = await AttendanceModel.find({
        attendanceDate: holiday.date,
        status: "Holiday",
      });

      // Use Promise.all() to process all attendance records concurrently
      await Promise.all(
        attendanceRecords.map(async (attendance) => {
          if (attendance.previousAttendance && attendance.previousAttendance.length > 0) {
            const previousAttendance = attendance.previousAttendance.pop(); // Get the last stored record
            attendance.timeIn = previousAttendance.timeIn;
            attendance.timeOut = previousAttendance.timeOut;
            attendance.status = previousAttendance.status;
            attendance.lateBy = previousAttendance.lateBy;
            attendance.totalHours = previousAttendance.totalHours;
            attendance.leaveConvertedToHolidayCount = previousAttendance.leaveConvertedToHolidayCount;
            attendance.updatedAt = previousAttendance.updatedAt;

            // Clear the previousAttendance field after restoring
            attendance.previousAttendance = [];
            await attendance.save();
          } else {
            await AttendanceModel.findOneAndDelete({
              attendanceDate: holiday.date,
              employee: attendance.employee,
            });
          }
        })
      );
    }

    // Fetch all employees
    const employees = await EmployeeModel.find();

    // Update or create attendance records for the new holiday date concurrently
    await Promise.all(
      employees.map(async (employee) => {
        let leaveCount = 0;
        let attendance = await AttendanceModel.findOne({
          employee: employee._id,
          attendanceDate: date,
        });

        if (attendance) {
          if (attendance.status === "On Leave") {
            leaveCount++;
          }
          if (!attendance.previousAttendance) {
            attendance.previousAttendance = [];
          }
          holiday.affectedAttendance.push(attendance._id);
          attendance.previousAttendance.push({
            timeIn: attendance.timeIn,
            timeOut: attendance.timeOut,
            status: attendance.status,
            lateBy: attendance.lateBy,
            totalHours: attendance.totalHours,
            leaveConvertedToHolidayCount: leaveCount,
            updatedAt: Date.now(),
          });
          attendance.status = "Holiday";
          attendance.timeIn = null;
          attendance.timeOut = null;
          attendance.lateBy = 0;
          attendance.totalHours = 0;
          await attendance.save();
        } else {
          const newAttendance = await AttendanceModel.create({
            employee: employee._id,
            attendanceDate: date,
            status: "Holiday",
            timeIn: null,
            timeOut: null,
            lateBy: 0,
            totalHours: 0,
          });
          holiday.affectedAttendance.push(newAttendance._id);
        }
      })
    );

    // Update the holiday's fields
    if (date) data.date = date;
    if (description) data.description = description;

    // Update the holiday document and return the updated record
    const updatedHoliday = await HolidayModel.findByIdAndUpdate(_id, data, {
      new: true,
    });
    if (!updatedHoliday) {
      return res.status(404).json({ err: "Holiday Not Found" });
    }

    return res.status(200).json({ msg: "Holiday Updated Successfully", updatedHoliday });
  } catch (error) {
    console.log("Error Updating Holiday", error);
    return res.status(500).json({ err: "Internal Server Error", error: error.message });
  }
};



module.exports = {
  createHoliday,
  getHolidays,
  deleteHoliday,
  updateHoliday,
  getSingleHoliday,
};
