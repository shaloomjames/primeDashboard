import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Cookies from "js-cookie";
import { Link, useNavigate } from 'react-router-dom';

const ShowSalary = () => {
  const [filteredData, setFilteredData] = useState([]); // Filtered employees
  const [RoleFilter, setRoleFilter] = useState(""); // State to store selected role filter
  const [salaryData, setsalaryData] = useState([]); // Raw salary data
  const [selectedMonth, setSelectedMonth] = useState(""); // State for the selected month
  const [Id, setId] = useState(''); // State for selected user ID


    // Pagination states
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
  

  const navigate = useNavigate();

  // Protect page and ensure only employees can access this component
  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");

    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken); // Decode the JWT token
        const userRole = decodedToken.userrole;   // Get the user role(s)
        const userid = decodedToken.userid;      // Get the user ID

        setId(userid); // Set user ID in state

        // Redirect to login if the user is not an "Employee"
        if (
          !(Array.isArray(userRole) && userRole.includes("Employee")) && // For array case
          userRole !== "Employee"                                       // For string case
        ) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch salary data based on user ID
  useEffect(() => {
    const fetchSalary = async () => {
      try {
        if (Id) {
          const res = await axios.get(`/api/salary/${Id}`); // Ensure backticks for template literals
          setsalaryData(res.data); // Set the fetched salary data
        }
      } catch (error) {
        console.error("Error Fetching Salary Data", error);
      }
    };
    fetchSalary();
  }, [Id]);

    // Handle pagination logic on changes
      useEffect(() => {
        setTotalPages(Math.ceil(filteredData.length / pageSize));
      }, [filteredData, pageSize]);
    
      const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
          setPage(newPage);
        }
      };
  


  // Filter salary records based on the selected month
  useEffect(() => {
    const filteredRecords = salaryData.filter((record) =>
      record.selectedMonth.startsWith(selectedMonth)
    );
    setFilteredData(filteredRecords);
  }, [salaryData, selectedMonth]);

  // Handle Print functionality
  const handlePrint = () => {
    window.print();
  };

     // Pagination slice
     const startIndex = (page - 1) * pageSize;
     const endIndex = page * pageSize;
     const currentData = filteredData.slice(startIndex, endIndex);
   

  return (
    <div className="container-fluid">
      {/* Filter Section */}
      <div className="row d-flex justify-content-between align-items-center mx-3 my-5">
        <div className="col-lg-3 col-md-4">
          <label>Select Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      {/* Salary Table */}
      <div className="row mt-5">
        <div className="col-lg-12">
          <div className="card p-4">
            <div className="card-body">
              <h4 className="card-title">Salary</h4>
                 {/* Pagination Controls */}
                 {currentData.length > 10 && (    <div className="mt-5 mb-2 d-flex  justify-content-end">
        <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(1)} disabled={page <= 1}>
          First
        </button>
        <button  className='btn btn-sm' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        <span className='mx-2'>
          Page {page} of {totalPages}
        </span>
        <button  className='btn btn-sm' onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
        <button  className='btn mx-2 btn-sm' onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}>
          Last
        </button>
      </div>)}
              <div className="table-responsive">
                <table className="table header-border">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Employee Name</th>
                      <th>Employee Email</th>
                      <th>Salary Month</th>
                      <th>Month Total Days</th>
                      <th>Month Working Days</th>
                      <th>Days Late</th>
                      <th>Days On Time</th>
                      <th>Absent Days</th>
                      <th>Effective Absent Days</th>
                      <th>Total Absent</th>
                      <th>Days Late Left</th>
                      <th>Basic Salary</th>
                      <th>Salary Per Day</th>
                      <th>Allowances</th>
                      <th>Total Allowance Amount</th>
                      <th>Salary Subtotal</th>
                      <th>Deductions</th>
                      <th>Total Deduction</th>
                      <th>Net Salary</th>
                      <th>Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((salary, index) => (
                        <tr key={index}>
                          <td>{salary.employeeId.employeeId}</td>
                          <td>{salary.employeeId.employeeName}</td>
                          <td>{salary.employeeId.employeeEmail}</td>
                          <td>
                            {new Date(salary.selectedMonth).toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: '2-digit',
                            })}
                          </td>
                          <td>{salary.monthTotalDays}</td>
                          <td>{salary.totalWorkingDays}</td>
                          <td>{salary.daysLate}</td>
                          <td>{salary.daysOnTime}</td>
                          <td>{salary.absentDays}</td>
                          <td>{salary.effectiveAbsentDays}</td>
                          <td>{salary.totalAbsentDays}</td>
                          <td>{salary.daysLateLeft}</td>
                          <td>{salary.basicSalary}</td>
                          <td>{Number(salary.salaryPerDay).toFixed(2)}</td>
                          <td>
                            {salary.allowances?.length > 0
                              ? salary.allowances
                                  .map((allowance) => `${allowance.name}: ${allowance.amount}`)
                                  .join(", ")
                              : "No Allowances"}
                          </td>
                          <td>{salary.totalAllowanceAmount}</td>
                          <td>{salary.salarySubtotal}</td>
                          <td>
                            {salary.deductions?.length > 0
                              ? salary.deductions
                                  .map((deduction) => `${deduction.name}: ${Number(deduction.amount).toFixed(2)}`)
                                  .join(", ")
                              : "No Deductions"}
                          </td>
                          <td>{Number(salary.totalDeduction).toFixed(2)}</td>
                          <td>{Number(salary.netSalary).toFixed(2)}</td>
                          <td>{salary.remarks}</td>
                          <td>
                            <span>
                              <Link data-toggle="tooltip" data-placement="top" title="Edit">
                                <i className="fa fa-pencil color-muted mx-2"></i>
                              </Link>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="22" className="text-center">
                          {selectedMonth === "" ? (
                            "No Salary records found to display."
                          ) : (
                            `No Salary records found for the selected month ${new Date(
                              `${selectedMonth}-01`
                            ).toLocaleString("default", { month: "long", year: "numeric" })}. Please check the selected month or try a different one.`
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* <button className="btn btn-primary mt-3" onClick={handlePrint}>
                Print Salary Records
              </button> */}
                {/* Pagination Controls */}
                {currentData.length > 10 && ( <div className='d-flex  justify-content-end'>
        <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(1)} disabled={page <= 1}>
          First
        </button>
        <button  className='btn btn-sm' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        <span className='mx-2'>
          Page {page} of {totalPages}
        </span>
        <button  className='btn btn-sm' onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
        <button  className='btn mx-2 btn-sm' onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}>
          Last
        </button>
      </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowSalary;
