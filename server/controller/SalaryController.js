const mongoose = require("mongoose");
const SalaryModel = require("../models/SalaryModel");
const Employee = require("../models/EmployeeModel");


const getsalary = async(req,res)=>{
    try {
        const Salaries = await SalaryModel.find().populate("employeeId");

        if(!Salaries) return res.status(400).json({err:"No Salaries Data Found"});

        return res.status(200).json(Salaries)
    } catch (error) {
        console.log("Error Reading Salaries",error);
        return res.status(500).json({err:"Internal Server Error",error})
    }
}

// const getsingleUserSalary = async(req,res)=>{
//     try {
//         const id = req.params.id;

//         if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({err:"Invalid Id Format"});

//         const Salary = await SalaryModel.find({ employeeId:id }).populate("employeeId");

//         if(!Salary) return res.status(400).json({err:"No Salaries Data Found"});

        

//         return res.status(200).json([Salary])

//     } catch (error) {
//         console.log("Error Reading Single Expance",error);
//         return res.status(500).json({err:"Internal Server Error",error})
//     }
// }
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
  

    const createSalary = async(req,res)=>{
        try {
            const {selectedMonth,employeeId,monthtotalDays,totalWorkingDays,daysOnTime,daysLate,daysLateLeft,absentDays,effectiveAbsentDays,totalAbsentDays,basicSalary,salaryPerDay,salarySubtotal,netSalary,allowances,totalAllowanceAmount,deductions,totalDeduction,remarks} = req.body;

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
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ err: "Employee not found." });
        }

        // Check if the salary for this employeeId and month already exists
      const existingSalary = await SalaryModel.findOne({ selectedMonth,employeeId });

      if (existingSalary) {
        return res.status(400).json({ err: 'Salary for this employee for this month is already paid' });
      }

      // Create the salary record
      const salary = await SalaryModel .create({
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
            console.log("Error Creating Salary",error);
            return res.status(500).json({err:"Internal Server Error",error})
        }
    }


module.exports =  {getsalary,getsingleUserSalary,createSalary}