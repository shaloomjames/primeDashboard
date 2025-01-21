const mongoose = require("mongoose");
const SalaryModel = require("../models/SalaryModel");
const Employee = require("../models/EmployeeModel");
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


// @Request   CREATE
// @Route     http://localhost:5000/api/salary
// @Access    Private
const createSalary = async (req, res) => {
  try {
    const { selectedMonth, employeeId, employeeEmail, monthtotalDays, totalWorkingDays, daysOnTime, daysLate, daysLateLeft, absentDays, effectiveAbsentDays, totalAbsentDays, basicSalary, salaryPerDay, salarySubtotal, netSalary, allowances, totalAllowanceAmount, deductions, totalDeduction, remarks } = req.body;

    // Validation
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
    const numberRegex = /^\d+$/; // Only digits
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;  // Validate date in 'YYYY-MM' format

    // Validation
    if (!selectedMonth || !dateRegex.test(selectedMonth) || !employeeId) {
      return res.status(400).json({ err: "Month and Employee ID are required." });
    }

    if (!basicSalary || basicSalary <= 0) {
      return res.status(400).json({ err: "Basic Salary must be greater than zero." });
    }

    if (totalAllowanceAmount < 0) {
      return res.status(400).json({ err: "Total Allowance Amount must be a positive number." });
    }

    //   remarks
    if (totalDeduction < 0) {
      return res.status(400).json({ err: "Total Deduction must be a positive number." });
    }

    if (!netSalary || netSalary < 0) {
      return res.status(400).json({ err: "Net Salary must be a positive number." });
    }

    // Check if employee exists
    const employee = await Employee.findOne({ employeeEmail });
    if (!employee) return res.status(400).json({ err: "Employee not found" })

    // Check if the salary for this employeeId and month already exists
    const existingSalary = await SalaryModel.findOne({ selectedMonth, employeeId });

    if (existingSalary) {
      return res.status(400).json({ err: 'Salary for this employee for this month is already paid' });
    }


    try {
      const emailHTML = `
        
      <table role="presentation" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; color: #333333;">
          <tr>
              <td style="padding: 0;">
                  <table role="presentation" style="max-width: 700px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);">
                      <!-- Header Section -->
                      <tr>
                          <td style="background-color: #003366; padding: 20px 0; text-align: center;">
                              <!-- Company Logo -->
                              <img src="https://primevertexsoftwares.com/wp-content/uploads/2020/06/Primevertex-Logo-01.png" alt="Company Logo" style="height: auto; max-width: 150px;">
                          </td>
                      </tr>
                      <!-- Greeting Section -->
                      <tr>
                          <td style="padding: 30px;">
                              <h1 style="color: #004080; font-size: 26px; margin-bottom: 10px;">Monthly Salary Statement</h1>
                              <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Dear ${employee.employeeName},</p>
                              <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                                  We are pleased to provide you with a detailed breakdown of your salary for the month of <strong>${selectedMonth}</strong>. Below are the relevant details:
                              </p>
                          </td>
                      </tr>
                      <!-- Salary Details -->
                      <tr>
                          <td style="padding: 20px 30px;">
                              <table role="presentation" style="width: 100%; border-collapse: collapse; border-spacing: 0; font-size: 14px;">
                                  <!-- Header Row -->
                                  <thead>
                                      <tr style="background-color: #f4f6f8; border-bottom: 2px solid #004080;">
                                          <th style="text-align: left; padding: 8px; font-weight: bold;">Description</th>
                                          <th style="text-align: left; padding: 8px; font-weight: bold;">Details</th>
                                      </tr>
                                  </thead>
                                  <!-- Body Rows -->
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
                                          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${basicSalary}</td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Salary per Day</td>
                                          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(salaryPerDay).toFixed(2)}</td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Allowances</td>
                                          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${allowances.map((allowance) => `${allowance.name}: ${allowance.amount}`).join(",  ")}</td>
                                      </tr>
                                                                            <tr>
                                          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Allowances</td>
                                          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${Number(totalAllowanceAmount).toFixed(2)}</td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">Deductions</td>
                                          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${deductions.map((deduction) => `${deduction.name}: ${Number(deduction.amount).toFixed(2)}`).join(",  ")}</td>
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
                      <!-- Closing Remarks -->
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
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }


    // Create the salary record
    const salary = await SalaryModel.create({
      selectedMonth,
      employeeId,
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
    });

    // Return success response
    res.status(201).json({ msg: 'Salary added successfully!', salary });
  } catch (error) {
    console.log("Error Creating Salary", error);
    return res.status(500).json({ err: "Internal Server Error", error })
  }
}


module.exports = { getsalary, getsingleUserSalary, createSalary }