const mongoose = require("mongoose");
const SalaryModel = require("../models/SalaryModel");
const Employee = require("../models/EmployeeModel");
const AttendanceModel = require("../models/AttendanceModel");
const { SendMail } = require("../helpers/SendMail");

// @Request   GET
// @Route     http://localhost:5000/api/salary
// @Access    Private
const getsalary = async (req, res) => {
  try {
    const Salaries = await SalaryModel.find().populate("employeeId");

    if (!Salaries) return res.status(400).json({ err: "No Salaries Data Found" });

    return res.status(200).json(Salaries)
  } catch (error) {
    console.log("Error Reading Salaries", error);
    return res.status(500).json({ err: "Internal Server Error", error })
  }
}

// @Request   GET
// @Route     http://localhost:5000/api/salary/:id
// @Access    Private
const getsingleUserSalary = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ err: "Invalid Id Format" });

    // Fetch salaries for the given employee ID
    const Salaries = await SalaryModel.find({ employeeId: id }).populate("employeeId");

    // Check if salaries exist
    if (!Salaries || Salaries.length === 0)
      return res.status(400).json({ err: "No Salaries Data Found" });

    // Always return the data as an array (even if a single object is found)
    return res.status(200).json(Salaries);

  } catch (error) {
    console.log("Error Reading Single Salary", error);
    return res.status(500).json({ err: "Internal Server Error", error });
  }
};


// // @Request   CREATE
// // @Route     http://localhost:5000/api/salary
// // @Access    Private
// const createSalary = async (req, res) => {
//   try {
//     const { selectedMonth, employeeId, employeeEmail, monthtotalDays, totalWorkingDays, daysOnTime, daysLate, daysLateLeft, absentDays, effectiveAbsentDays, totalAbsentDays, basicSalary, salaryPerDay, salarySubtotal, netSalary, allowances, totalAllowanceAmount, deductions, totalDeduction, remarks } = req.body;

//     // Validation
//     const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
//     const numberRegex = /^\d+$/; // Only digits
//     const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;  // Validate date in 'YYYY-MM' format

//     // Validation
//     if (!selectedMonth || !dateRegex.test(selectedMonth) || !employeeId) {
//       return res.status(400).json({ err: "Month and Employee ID are required." });
//     }

//     if (!basicSalary || basicSalary <= 0) {
//       return res.status(400).json({ err: "Basic Salary must be greater than zero." });
//     }

//     if (totalAllowanceAmount < 0) {
//       return res.status(400).json({ err: "Total Allowance Amount must be a positive number." });
//     }

//     //   remarks
//     if (totalDeduction < 0) {
//       return res.status(400).json({ err: "Total Deduction must be a positive number." });
//     }

//     if (!netSalary || netSalary < 0) {
//       return res.status(400).json({ err: "Net Salary must be a positive number." });
//     }

//     // Check if employee exists
//     const employee = await Employee.findOne({ employeeEmail });
//     if (!employee) return res.status(400).json({ err: "Employee not found" })

//     // Check if the salary for this employeeId and month already exists
//     const existingSalary = await SalaryModel.findOne({ selectedMonth, employeeId });

//     if (existingSalary) {
//       return res.status(400).json({ err: 'Salary for this employee for this month is already paid' });
//     }

//     // Step 1: Parse the selected month and calculate days
//     const [year, month] = selectedMonth.split("-").map(Number); // e.g., "2025-03" -> [2025, 3]
//     const startDate = new Date(year, month - 1, 1); // First day of the month
//     const endDate = new Date(year, month, 0); // Last day of the month
//     const totalDaysInMonth = endDate.getDate(); // Total days in the month (e.g., 31 for March)



//     // Step 2: Fetch attendance records for the employee for the selected month
//     const attendanceRecords = await AttendanceModel.find({
//       employeeId,
//       date: {
//         $gte: startDate,
//         $lte: endDate,
//       },
//     });

//     // Step 3: Check if attendance is logged for all days
//     const loggedDays = attendanceRecords.length; // Number of days with attendance records
//     if (loggedDays < totalDaysInMonth) {
//       return res.status(400).json({
//         // err: `Attendance is not fully logged for ${selectedMonth}. Only ${loggedDays} out of ${totalDaysInMonth} days are recorded.`,
//         err: `Attendance is not fully logged for ${selectedMonth}. Only ${loggedDays} out of ${totalWorkingDays} working days are recorded. Please mark attendance for the days that don't have logs to proceed.`,
//       });
//     }
// // Validate attendance data against request body
// if (loggedDays < totalWorkingDays) {
//   return res.status(400).json({
//     err: `Logged attendance days (${loggedDays}) are less than the provided total working days (${totalWorkingDays}) for ${selectedMonth}.`,
//   });
// }
//     // Use a transaction for email and salary creation
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       const emailHTML = `
        
//       <table role="presentation" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; color: #333333;">
//           <tr>
//               <td style="padding: 0;">
//                   <table role="presentation" style="max-width: 700px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);">
//                       <!-- Header Section -->
//                       <tr>
//                           <td style="background-color: #003366; padding: 20px 0; text-align: center;">
//                               <!-- Company Logo -->
//                               <img src="https://primevertexsoftwares.com/wp-content/uploads/2020/06/Primevertex-Logo-01.png" alt="Company Logo" style="height: auto; max-width: 150px;">
//                           </td>
//                       </tr>
//                       <!-- Greeting Section -->
//                       <tr>
//                           <td style="padding: 30px;">
//                               <h1 style="color: #004080; font-size: 26px; margin-bottom: 10px;">Monthly Salary Statement</h1>
//                               <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Dear ${employee.employeeName},</p>
//                               <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
//                                   We are pleased to provide you with a detailed breakdown of your salary for the month of <strong>${selectedMonth}</strong>. Below are the relevant details:
//                               </p>
//                           </td>
//                       </tr>
//                       <!-- Salary Details -->
//                       <tr>
//                           <td style="padding: 20px 30px;">
//                               <table role="presentation" style="width: 100%; border-collapse: collapse; border-spacing: 0; font-size: 14px;">
//                                   <!-- Header Row -->
//                                   <thead>
//                                       <tr style="background-color: #f4f6f8; border-bottom: 2px solid #004080;">
//                                           <th style="text-align: left; padding: 8px; font-weight: bold;">Description</th>
//                                           <th style="text-align: left; padding: 8px; font-weight: bold;">Details</th>
//                                       </tr>
//                                   </thead>
//                                   <!-- Body Rows -->
//                                   <tbody>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Employee ID</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${employee.employeeId}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Days in Month</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${monthtotalDays}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Working Days</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${totalWorkingDays}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">On-Time Days</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${daysOnTime}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Days Late</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${daysLate}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Absent Days</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${absentDays}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Effective Absent Days</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${effectiveAbsentDays}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Absent Days</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${totalAbsentDays}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Basic Salary</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${basicSalary}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Salary per Day</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(salaryPerDay).toFixed(2)}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Allowances</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${allowances.map((allowance) => `${allowance.name}: ${allowance.amount}`).join(",  ")}</td>
//                                       </tr>
//                                                                             <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Allowances</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(totalAllowanceAmount).toFixed(2)}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Deductions</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${deductions.map((deduction) => `${deduction.name}: ${Number(deduction.amount).toFixed(2)}`).join(",  ")}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Deduction Amount</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(totalDeduction).toFixed(2)}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="padding: 8px; border-bottom: 1px solid #004080; font-weight: bold;">Net Salary</td>
//                                           <td style="padding: 8px; border-bottom: 1px solid #004080; color: #28a745; font-weight: bold;">${Number(netSalary).toFixed(2)}</td>
//                                       </tr>
//                                   </tbody>
//                               </table>
//                           </td>
//                       </tr>
//                       <!-- Closing Remarks -->
//                       <tr>
//                           <td style="padding: 30px;">
//                               <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
//                                   If you have any questions or concerns regarding this statement, please feel free to reach out to our HR department at 
//                                   <a href="mailto:hr@example.com" style="color: #004080; text-decoration: none;">hr@example.com</a>.
//                               </p>
//                               <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
//                                   Thank you for your dedication and valuable contributions to the organization.
//                               </p>
//                               <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
//                                   Regards, <br>
//                                   <strong>Human Resources</strong><br>
//                                   [Your Company Name]
//                               </p>
//                           </td>
//                       </tr>
//                   </table>
//               </td>
//           </tr>
//       </table>
//           `;

//       await SendMail(
//         employeeEmail,
//         `Salary Statement for ${selectedMonth}`,
//         `Dear ${employee.employeeName}, find your detailed salary breakdown enclosed.`,
//         emailHTML
//       );
//     } catch (err) {
//       console.error("Failed to send welcome email:", err);
//     }finally {
//       session.endSession();
//     }



//     // Create the salary record
//     const salary = await SalaryModel.create({
//       selectedMonth,
//       employeeId,
//       monthtotalDays,
//       totalWorkingDays,
//       daysOnTime,
//       daysLate,
//       daysLateLeft,
//       absentDays,
//       effectiveAbsentDays,
//       totalAbsentDays,
//       basicSalary,
//       salaryPerDay,
//       salarySubtotal,
//       netSalary,
//       allowances,
//       totalAllowanceAmount,
//       deductions,
//       totalDeduction,
//       remarks,
//     },
//     { session }
//   );
//   await session.commitTransaction();
//     // Return success response
//     res.status(201).json({ msg: 'Salary added successfully!', salary });
//   } catch (error) {
//     await session.abortTransaction();
//     console.log("Error Creating Salary", error);
//     return res.status(500).json({ err: "Internal Server Error", error })
//   }
// }

// // @Request   CREATE
// // @Route     http://localhost:5000/api/salary
// // @Access    Private
// const createSalary = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       selectedMonth,
//       employeeId,
//       employeeEmail,
//       monthtotalDays,
//       totalWorkingDays,
//       daysOnTime,
//       daysLate,
//       daysLateLeft,
//       absentDays,
//       effectiveAbsentDays,
//       totalAbsentDays,
//       basicSalary,
//       salaryPerDay,
//       salarySubtotal,
//       netSalary,
//       allowances,
//       totalAllowanceAmount,
//       deductions,
//       totalDeduction,
//       remarks,
//     } = req.body;

//     // Validation
//     const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/; // Validate date in 'YYYY-MM' format

//     if (!selectedMonth || !dateRegex.test(selectedMonth) || !employeeId) {
//       return res.status(400).json({ err: "Month and Employee ID are required." });
//     }

//     if (!mongoose.Types.ObjectId.isValid(employeeId)) {
//       return res.status(400).json({ err: "Invalid Employee ID format." });
//     }

//     if (!basicSalary || Number(basicSalary) <= 0) {
//       return res.status(400).json({ err: "Basic Salary must be greater than zero." });
//     }

//     if (Number(totalAllowanceAmount) < 0) {
//       return res.status(400).json({ err: "Total Allowance Amount must be a positive number." });
//     }

//     if (Number(totalDeduction) < 0) {
//       return res.status(400).json({ err: "Total Deduction must be a positive number." });
//     }

//     if (!netSalary || Number(netSalary) < 0) {
//       return res.status(400).json({ err: "Net Salary must be a positive number." });
//     }

//     if (!totalWorkingDays || Number(totalWorkingDays) <= 0) {
//       return res.status(400).json({ err: "Total Working Days must be greater than zero." });
//     }

//     // Check if employee exists
//     const employee = await Employee.findOne({ employeeEmail });
//     if (!employee) return res.status(404).json({ err: "Employee not found" });

//     // Check if the salary for this employeeId and month already exists
//     const existingSalary = await SalaryModel.findOne({ selectedMonth, employeeId });
//     if (existingSalary) {
//       return res.status(400).json({ err: "Salary for this employee for this month is already paid" });
//     }

//     // Step 1: Parse the selected month and calculate days
//     const [year, month] = selectedMonth.split("-").map(Number); // e.g., "2025-03" -> [2025, 3]
//     const startDate = new Date(year, month - 1, 1); // First day of the month
//     const endDate = new Date(year, month, 0); // Last day of the month
//     const totalDaysInMonth = endDate.getDate(); // Total days in the month (e.g., 31 for March)

//     // Step 2: Fetch attendance records for the employee for the selected month
//     const attendanceRecords = await AttendanceModel.find({
//       employeeId,
//       attendanceDate: {
//         $gte: startDate,
//         $lte: endDate,
//       },
//     });

//     // Step 3: Check if attendance is logged for all working days
//     const loggedDays = attendanceRecords.length; // Number of days with attendance records
//     if (loggedDays < Number(totalWorkingDays)) {
//       return res.status(400).json({
//         err: `Attendance is not fully logged for ${selectedMonth}. Only ${loggedDays} out of ${totalWorkingDays} working days are recorded. Please mark attendance for the days that don't have logs to proceed.`,
//       });
//     }

//     // Transaction block for email and salary creation
//     const emailHTML = `
//       <table role="presentation" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; color: #333333;">
//         <tr>
//           <td style="padding: 0;">
//             <table role="presentation" style="max-width: 700px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);">
//               <tr>
//                 <td style="background-color: #003366; padding: 20px 0; text-align: center;">
//                   <img src="https://primevertexsoftwares.com/wp-content/uploads/2020/06/Primevertex-Logo-01.png" alt="Company Logo" style="height: auto; max-width: 150px;">
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 30px;">
//                   <h1 style="color: #004080; font-size: 26px; margin-bottom: 10px;">Monthly Salary Statement</h1>
//                   <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Dear ${employee.employeeName},</p>
//                   <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
//                     We are pleased to provide you with a detailed breakdown of your salary for the month of <strong>${selectedMonth}</strong>. Below are the relevant details:
//                   </p>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 20px 30px;">
//                   <table role="presentation" style="width: 100%; border-collapse: collapse; border-spacing: 0; font-size: 14px;">
//                     <thead>
//                       <tr style="background-color: #f4f6f8; border-bottom: 2px solid #004080;">
//                         <th style="text-align: left; padding: 8px; font-weight: bold;">Description</th>
//                         <th style="text-align: left; padding: 8px; font-weight: bold;">Details</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Employee ID</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${employee.employeeId}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Days in Month</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${monthtotalDays}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Working Days</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${totalWorkingDays}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">On-Time Days</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${daysOnTime}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Days Late</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${daysLate}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Absent Days</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${absentDays}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Effective Absent Days</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${effectiveAbsentDays}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Absent Days</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${totalAbsentDays}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Basic Salary</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(basicSalary).toFixed(2)}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Salary per Day</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(salaryPerDay).toFixed(2)}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Allowances</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${allowances.map((allowance) => `${allowance.name}: ${Number(allowance.amount).toFixed(2)}`).join(", ")}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Allowance Amount</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(totalAllowanceAmount).toFixed(2)}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Deductions</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${deductions.map((deduction) => `${deduction.name}: ${Number(deduction.amount).toFixed(2)}`).join(", ")}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Deduction Amount</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(totalDeduction).toFixed(2)}</td>
//                       </tr>
//                       <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #004080; font-weight: bold;">Net Salary</td>
//                         <td style="padding: 8px; border-bottom: 1px solid #004080; color: #28a745; font-weight: bold;">${Number(netSalary).toFixed(2)}</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 30px;">
//                   <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
//                     If you have any questions or concerns regarding this statement, please feel free to reach out to our HR department at 
//                     <a href="mailto:hr@example.com" style="color: #004080; text-decoration: none;">hr@example.com</a>.
//                   </p>
//                   <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
//                     Thank you for your dedication and valuable contributions to the organization.
//                   </p>
//                   <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
//                     Regards, <br>
//                     <strong>Human Resources</strong><br>
//                     [Your Company Name]
//                   </p>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>
//     `;

//     await SendMail(
//       employeeEmail,
//       `Salary Statement for ${selectedMonth}`,
//       `Dear ${employee.employeeName}, find your detailed salary breakdown enclosed.`,
//       emailHTML
//     );

//     // Create the salary record
//     const salary = await SalaryModel.create(
//       {
//         selectedMonth,
//         employeeId,
//         monthtotalDays,
//         totalWorkingDays,
//         daysOnTime,
//         daysLate,
//         daysLateLeft,
//         absentDays,
//         effectiveAbsentDays,
//         totalAbsentDays,
//         basicSalary: Number(basicSalary),
//         salaryPerDay: Number(salaryPerDay),
//         salarySubtotal: Number(salarySubtotal),
//         netSalary: Number(netSalary),
//         allowances,
//         totalAllowanceAmount: Number(totalAllowanceAmount),
//         deductions,
//         totalDeduction: Number(totalDeduction),
//         remarks,
//       },
//       { session }
//     );

//     await session.commitTransaction();
//     res.status(201).json({ msg: "Salary added successfully!", salary });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Error creating salary:", error);
//     return res.status(500).json({ err: "Internal Server Error", details: error.message });
//   } finally {
//     session.endSession();
//   }
// };


// @Request   CREATE
// @Route     http://localhost:5000/api/salary
// @Access    Private
const createSalary = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      selectedMonth,
      employeeId,
      employeeEmail,
      monthtotalDays,
      totalWorkingDays,
      daysOnTime,
      daysLate,
      daysLateLeft,
      absentDays,
      effectiveAbsentDays,
      totalAbsentDays,
      basicSalary,
      salaryPerDay,
      salarySubtotal,
      netSalary,
      allowances,
      totalAllowanceAmount,
      deductions,
      totalDeduction,
      remarks,
    } = req.body;

    // Validation
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/; // Validate date in 'YYYY-MM' format
    if (!selectedMonth || !dateRegex.test(selectedMonth) || !employeeId) {
      return res.status(400).json({ err: "Month and Employee ID are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ err: "Invalid Employee ID format." });
    }

    if (!basicSalary || Number(basicSalary) <= 0) {
      return res.status(400).json({ err: "Basic Salary must be greater than zero." });
    }

    if (Number(totalAllowanceAmount) < 0) {
      return res.status(400).json({ err: "Total Allowance Amount must be a positive number." });
    }

    if (Number(totalDeduction) < 0) {
      return res.status(400).json({ err: "Total Deduction must be a positive number." });
    }

    if (!netSalary || Number(netSalary) < 0) {
      return res.status(400).json({ err: "Net Salary must be a positive number." });
    }

    if (!totalWorkingDays || Number(totalWorkingDays) <= 0) {
      return res.status(400).json({ err: "Total Working Days must be greater than zero." });
    }

    // Validate allowances and deductions arrays
    if (allowances && !Array.isArray(allowances)) {
      return res.status(400).json({ err: "Allowances must be an array." });
    }
    if (allowances) {
      for (const allowance of allowances) {
        if (!allowance.name || typeof allowance.amount !== "number") {
          return res.status(400).json({ err: "Each allowance must have a name and a numeric amount." });
        }
      }
    }

    if (deductions && !Array.isArray(deductions)) {
      return res.status(400).json({ err: "Deductions must be an array." });
    }
    if (deductions) {
      for (const deduction of deductions) {
        if (!deduction.name || typeof deduction.amount !== "number") {
          return res.status(400).json({ err: "Each deduction must have a name and a numeric amount." });
        }
      }
    }

    // Check if employee exists
    const employee = await Employee.findOne({ employeeEmail });
    if (!employee) return res.status(404).json({ err: "Employee not found" });

    // Check if the salary for this employeeId and month already exists
    const existingSalary = await SalaryModel.findOne({ selectedMonth: new Date(selectedMonth), employeeId });
    if (existingSalary) {
      return res.status(400).json({ err: "Salary for this employee for this month is already paid" });
    }

    // Step 1: Parse the selected month and calculate days
    const [year, month] = selectedMonth.split("-").map(Number); // e.g., "2025-03" -> [2025, 3]
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the month
    const totalDaysInMonthCalculated = endDate.getDate(); // Total days in the month (e.g., 31 for March)

    if (Number(monthtotalDays) !== totalDaysInMonthCalculated) {
      return res.status(400).json({ err: `Provided monthtotalDays (${monthtotalDays}) does not match calculated total days (${totalDaysInMonthCalculated}) for ${selectedMonth}.` });
    }

    // Step 2: Fetch attendance records for the employee for the selected month
    const attendanceRecords = await AttendanceModel.find({
      employee: employeeId, // Changed to match schema
      attendanceDate: { // Fixed field name from dateattendanceDate
        $gte: startDate,
        $lte: endDate,
      },
    });

    // Step 3: Check if attendance is logged for all working days
    const loggedDays = attendanceRecords.length;
    if (loggedDays < Number(totalWorkingDays)) {
      return res.status(400).json({
        err: `Attendance is not fully logged for ${selectedMonth}. Only ${loggedDays} out of ${totalWorkingDays} working days are recorded. Please mark attendance for the days that don't have logs to proceed.`,
      });
    }

    // Optional: Validate attendance data against request body
    const onTimeDays = attendanceRecords.filter(record => record.status === "On Time").length;
    const lateDays = attendanceRecords.filter(record => record.status === "Late").length;
    const absentDaysFromAttendance = attendanceRecords.filter(record => record.status === "Absence").length;

    if (Number(daysOnTime) !== onTimeDays || Number(daysLate) !== lateDays || Number(absentDays) !== absentDaysFromAttendance) {
      return res.status(400).json({
        err: `Attendance data mismatch: daysOnTime (${daysOnTime} vs ${onTimeDays}), daysLate (${daysLate} vs ${lateDays}), absentDays (${absentDays} vs ${absentDaysFromAttendance}) do not match recorded attendance.`,
      });
    }

    // Transaction block for email and salary creation
    const emailHTML = `
      <table role="presentation" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; color: #333333;">
        <tr>
          <td style="padding: 0;">
            <table role="presentation" style="max-width: 700px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);">
              <tr>
                <td style="background-color: #003366; padding: 20px 0; text-align: center;">
                  <img src="https://primevertexsoftwares.com/wp-content/uploads/2020/06/Primevertex-Logo-01.png" alt="Company Logo" style="height: auto; max-width: 150px;">
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <h1 style="color: #004080; font-size: 26px; margin-bottom: 10px;">Monthly Salary Statement</h1>
                  <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Dear ${employee.employeeName},</p>
                  <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                    We are pleased to provide you with a detailed breakdown of your salary for the month of <strong>${selectedMonth}</strong>. Below are the relevant details:
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 30px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; border-spacing: 0; font-size: 14px;">
                    <thead>
                      <tr style="background-color: #f4f6f8; border-bottom: 2px solid #004080;">
                        <th style="text-align: left; padding: 8px; font-weight: bold;">Description</th>
                        <th style="text-align: left; padding: 8px; font-weight: bold;">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Employee ID</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${employee.employeeId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Days in Month</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${monthtotalDays}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Working Days</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${totalWorkingDays}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">On-Time Days</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${daysOnTime}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Days Late</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${daysLate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Absent Days</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${absentDays}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Effective Absent Days</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${effectiveAbsentDays}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Absent Days</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${totalAbsentDays}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Basic Salary</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(basicSalary).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Salary per Day</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(salaryPerDay).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Allowances</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${allowances.map((allowance) => `${allowance.name}: ${Number(allowance.amount).toFixed(2)}`).join(", ")}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Allowance Amount</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(totalAllowanceAmount).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Deductions</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${deductions.map((deduction) => `${deduction.name}: ${Number(deduction.amount).toFixed(2)}`).join(", ")}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Total Deduction Amount</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(totalDeduction).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #004080; font-weight: bold;">Net Salary</td>
                        <td style="padding: 8px; border-bottom: 1px solid #004080; color: #28a745; font-weight: bold;">${Number(netSalary).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                    If you have any questions or concerns regarding this statement, please feel free to reach out to our HR department at 
                    <a href="mailto:hr@example.com" style="color: #004080; text-decoration: none;">hr@example.com</a>.
                  </p>
                  <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
                    Thank you for your dedication and valuable contributions to the organization.
                  </p>
                  <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
                    Regards, <br>
                    <strong>Human Resources</strong><br>
                    [Your Company Name]
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    await SendMail(
      employeeEmail,
      `Salary Statement for ${selectedMonth}`,
      `Dear ${employee.employeeName}, find your detailed salary breakdown enclosed.`,
      emailHTML
    );

    // Create the salary record
    const salary = await SalaryModel.create(
      {
        selectedMonth: new Date(year, month - 1, 1), // Convert to Date object for schema
        employeeId,
        monthtotalDays: Number(monthtotalDays),
        totalWorkingDays: Number(totalWorkingDays),
        daysOnTime: Number(daysOnTime),
        daysLate: Number(daysLate),
        daysLateLeft: Number(daysLateLeft),
        absentDays: Number(absentDays),
        effectiveAbsentDays: Number(effectiveAbsentDays),
        totalAbsentDays: Number(totalAbsentDays),
        basicSalary: Number(basicSalary),
        salaryPerDay: Number(salaryPerDay),
        salarySubtotal: Number(salarySubtotal),
        netSalary: Number(netSalary),
        allowances,
        totalAllowanceAmount: Number(totalAllowanceAmount),
        deductions,
        totalDeduction: Number(totalDeduction),
        remarks,
        totalAttendanceRecordDays: loggedDays, // Optional: Store actual logged days
      },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ msg: "Salary added successfully!", salary });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating salary:", error);
    return res.status(500).json({ err: "Internal Server Error", details: error.message });
  } finally {
    session.endSession();
  }
};



module.exports = { getsalary, getsingleUserSalary, createSalary }