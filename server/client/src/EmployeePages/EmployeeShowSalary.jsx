// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode';
// import Cookies from "js-cookie";
// import { Link, useNavigate } from 'react-router-dom';
// import Swal from "sweetalert2";


// const ShowSalary = () => {
//   const [filteredData, setFilteredData] = useState([]); // Filtered employees
//   const [RoleFilter, setRoleFilter] = useState(""); // State to store selected role filter
//   const [salaryData, setsalaryData] = useState([]); // Raw salary data
//   const [selectedMonth, setSelectedMonth] = useState(""); // State for the selected month
//   const [Id, setId] = useState(''); // State for selected user ID
//   const [loading, setLoading] = useState(false); // Added for loading feedback
  

//     // Pagination states
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [totalPages, setTotalPages] = useState(0);
  

//   const navigate = useNavigate();

//     // Handle showing errors
//     const showErrorAlert = (message) => {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: message,
//       });
//     };

//   // Protect page and ensure only employees can access this component
//   useEffect(() => {
//     const userToken = Cookies.get("UserAuthToken");

//     if (userToken) {
//       try {
//         const decodedToken = jwtDecode(userToken); // Decode the JWT token
//         const userRole = decodedToken.userrole;   // Get the user role(s)
//         const userid = decodedToken.userid;      // Get the user ID

//         setId(userid); // Set user ID in state

//         // Redirect to login if the user is not an "Employee"
//         if (
//           !(Array.isArray(userRole) && userRole.includes("Employee")) && // For array case
//           userRole !== "Employee"                                       // For string case
//         ) {
//           navigate("/login");
//         }
//       } catch (error) {
//         console.error("Token decoding failed:", error);
//         navigate("/login");
//       }
//     } else {
//       navigate("/login");
//     }
//   }, [navigate]);

//   // Fetch salary data based on user ID
//   useEffect(() => {
//     const fetchSalary = async () => {
//       setLoading(true);
//       try {
//         if (Id) {
//           const res = await axios.get(`/api/salary/${Id}`); // Ensure backticks for template literals
//           setsalaryData(res.data); // Set the fetched salary data
//         }
//       } catch (error) {
//         console.error("Error Fetching Salary Data", error);
//         showErrorAlert(
//           error.response?.data?.err || "Error Fetching Attendance Records"
//         );
//       }finally {
//         setLoading(false);
//       }
//     };
//     fetchSalary();
//   }, [Id]);

//     // Handle pagination logic on changes
//       useEffect(() => {
//         setTotalPages(Math.ceil(filteredData.length / pageSize));
//       }, [filteredData, pageSize]);
    
//       const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//           setPage(newPage);
//         }
//       };
  


//   // Filter salary records based on the selected month
//   useEffect(() => {
//     const filteredRecords = salaryData.filter((record) =>
//       record.selectedMonth.startsWith(selectedMonth)
//     );
//     setFilteredData(filteredRecords);
//   }, [salaryData, selectedMonth]);

//   // Handle Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//      // Pagination slice
//      const startIndex = (page - 1) * pageSize;
//      const endIndex = page * pageSize;
//      const currentData = filteredData.slice(startIndex, endIndex);
   

//   return (
//     <div className="container-fluid">
//       {/* Filter Section */}
//       {/* <div className="row d-flex justify-content-between align-items-center mx-3 my-5">
        
//       </div> */}

//       <div className="row my-1">
//             <div className="col-lg-12">
//               <div className="card">
//                 <div className="card-body">
//                 <div className="col-lg-3 col-md-4">
//           <label>Select Month</label>
//           <input
//             type="month"
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//             className="form-control"
//           />
//         </div>       
//                 </div>
//               </div>
//             </div>
//           </div>

//       {/* Salary Table */}
//       <div className="row mt-1">
//         <div className="col-lg-12">
//           <div className="card p-4">
//             <div className="card-body">
//               <h4 className="card-title">Salary</h4>
//                  {/* Pagination Controls */}
//                  {currentData.length > 10 && (    <div className="mt-5 mb-2 d-flex  justify-content-end">
//         <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(1)} disabled={page <= 1}>
//           First
//         </button>
//         <button  className='btn btn-sm' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
//           Prev
//         </button>
//         <span className='mx-2'>
//           Page {page} of {totalPages}
//         </span>
//         <button  className='btn btn-sm' onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
//           Next
//         </button>
//         <button  className='btn mx-2 btn-sm' onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}>
//           Last
//         </button>
//       </div>)}
//               <div className="table-responsive">
//                 <table className="table header-border">
//                   <thead>
//                     <tr>
//                       <th>Employee ID</th>
//                       <th>Employee Name</th>
//                       <th>Employee Email</th>
//                       <th>Salary Month</th>
//                       <th>Month Total Days</th>
//                       <th>Month Working Days</th>
//                       <th>Days Late</th>
//                       <th>Days On Time</th>
//                       <th>Absent Days</th>
//                       <th>Effective Absent Days</th>
//                       <th>Total Absent</th>
//                       <th>Days Late Left</th>
//                       <th>Basic Salary</th>
//                       <th>Salary Per Day</th>
//                       <th>Allowances</th>
//                       <th>Total Allowance Amount</th>
//                       <th>Salary Subtotal</th>
//                       <th>Deductions</th>
//                       <th>Total Deduction</th>
//                       <th>Net Salary</th>
//                       <th>Remarks</th>
//                       {/* <th>Actions</th> */}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredData.length > 0 ? (
//                       filteredData.map((salary, index) => (
//                         <tr key={index}>
//                           <td>{salary?.employeeId?.employeeId || "N/A"}</td>
//                           <td>{salary?.employeeId?.employeeName || "N/A"}</td>
//                           <td>{salary?.employeeId?.employeeEmail || "N/A"}</td>
//                           <td>
//                             {new Date(salary?.selectedMonth).toLocaleDateString('en-GB', {
//                               year: 'numeric',
//                               month: '2-digit',
//                             }) || "N/A"}
//                           </td>
//                           <td>{salary?.monthTotalDays|| "N/A"}</td>
//                           <td>{salary?.totalWorkingDays|| "N/A"}</td>
//                           <td>{salary?.daysLate|| "N/A"}</td>
//                           <td>{salary?.daysOnTime|| "N/A"}</td>
//                           <td>{salary?.absentDays|| "N/A"}</td>
//                           <td>{salary?.effectiveAbsentDays|| "N/A"}</td>
//                           <td>{salary?.totalAbsentDays|| "N/A"}</td>
//                           <td>{salary?.daysLateLeft|| "N/A"}</td>
//                           <td>{salary?.basicSalary|| "N/A"}</td>
//                           <td>{Number(salary.salaryPerDay|| "N/A").toFixed(2)}</td>
//                           <td>
//                             {salary.allowances?.length > 0
//                               ? salary.allowances
//                                   .map((allowance) => `${allowance?.name || "N/A"}: ${allowance?.amount|| "N/A"}`)
//                                   .join(", ")
//                               : "No Allowances"}
//                           </td>
//                           <td>{salary?.totalAllowanceAmount || "N/A"}</td>
//                           <td>{salary?.salarySubtotal|| "N/A"}</td>
//                           <td>
//                             {salary?.deductions?.length > 0
//                               ? salary.deductions
//                                   .map((deduction) => `${deduction?.name|| "N/A"}: ${Number(deduction?.amount|| "N/A").toFixed(2)}`)
//                                   .join(", ")
//                               : "No Deductions"}
//                           </td>
//                           <td>{Number(salary?.totalDeduction|| "N/A").toFixed(2)}</td>
//                           <td>{Number(salary?.netSalary|| "N/A").toFixed(2)}</td>
//                           <td>{salary?.remarks|| "N/A"}</td>
//                           {/* <td>
//                             <span>
//                               <Link data-toggle="tooltip" data-placement="top" title="Edit">
//                                 <i className="fa fa-pencil color-muted mx-2"></i>
//                               </Link>
//                             </span>
//                           </td> */}
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td></td>
//                         <td></td>
//                         <td colSpan="20">
//                           {selectedMonth === "" ? (
//                             "No Salary records found to display."
//                           ) : (
//                             `No Salary records found for the selected month ${new Date(
//                               `${selectedMonth}-01`
//                             ).toLocaleString("default", { month: "long", year: "numeric" })}. Please check the selected month or try a different one.`
//                           )}
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               {/* <button className="btn btn-primary mt-3" onClick={handlePrint}>
//                 Print Salary Records
//               </button> */}
//                 {/* Pagination Controls */}
//                 {currentData.length > 10 && ( <div className='d-flex  justify-content-end'>
//         <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(1)} disabled={page <= 1}>
//           First
//         </button>
//         <button  className='btn btn-sm' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
//           Prev
//         </button>
//         <span className='mx-2'>
//           Page {page} of {totalPages}
//         </span>
//         <button  className='btn btn-sm' onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
//           Next
//         </button>
//         <button  className='btn mx-2 btn-sm' onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}>
//           Last
//         </button>
//       </div>)}
//             </div>
//           </div>
//         </div>
//       </div>
//       <center className=" card py-5" style={{visibility:"hidden"}}>
//         <div className="row">
//         </div ></center>
//     </div>
//   );
// };

// export default ShowSalary;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ShowSalary = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [salaryData, setSalaryData] = useState([]); // Fixed naming
  const [selectedMonth, setSelectedMonth] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Removed setPageSize
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // Handle showing errors
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    });
  };

  // Protect page for employees only
  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");
    if (!userToken) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(userToken);
      const userRole = decodedToken.userrole;
      setId(decodedToken.userid);
      if (
        !(Array.isArray(userRole) && userRole.includes("Employee")) &&
        userRole !== "Employee"
      ) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
      navigate("/login");
    }
  }, [navigate]);

  // Fetch salary data
  useEffect(() => {
    if (!id) return;

    const fetchSalary = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/salary/${id}`);
        setSalaryData(res.data);
        setFilteredData(res.data); // Set both for immediate render
      } catch (error) {
        console.error("Error Fetching Salary Data:", error);
        showErrorAlert(error.response?.data?.err || "Error Fetching Salary Data");
      } finally {
        setLoading(false);
      }
    };
    fetchSalary();
  }, [id]);

  // Filter salary records by month
  useEffect(() => {
    const filteredRecords = salaryData.filter((record) =>
      new Date(record.selectedMonth).toISOString().slice(0, 7) === selectedMonth
    );
    setFilteredData(filteredRecords);
    setPage(1); // Reset to first page
  }, [salaryData, selectedMonth]);

  // Update pagination
  useEffect(() => {
    const newTotal = Math.ceil(filteredData.length / pageSize) || 1; // Minimum 1 page
    setTotalPages(newTotal);
    if (page > newTotal) setPage(newTotal);
  }, [filteredData, pageSize, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="container-fluid">
      {/* Filter Section */}
      <div className="row my-1">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
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
          </div>
        </div>
      </div>

      {/* Salary Table */}
      <div className="row mt-1">
        <div className="col-lg-12">
          <div className="card p-4">
            <div className="card-body">
              <h4 className="card-title">Salary</h4>
              {loading ? (
                <p className="text-center">Loading salary records...</p>
              ) : (
                <>
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
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.length > 0 ? (
                          currentData.map((salary) => (
                            <tr key={salary._id}>
                              <td>{salary?.employeeId?.employeeId || "N/A"}</td>
                              <td>{salary?.employeeId?.employeeName || "N/A"}</td>
                              <td>{salary?.employeeId?.employeeEmail || "N/A"}</td>
                              <td>
                                {salary?.selectedMonth
                                  ? new Date(salary.selectedMonth).toLocaleDateString("en-GB", {
                                      year: "numeric",
                                      month: "2-digit",
                                    })
                                  : "N/A"}
                              </td>
                              <td>{salary?.monthTotalDays || "N/A"}</td>
                              <td>{salary?.totalWorkingDays || "N/A"}</td>
                              <td>{salary?.daysLate || "N/A"}</td>
                              <td>{salary?.daysOnTime || "N/A"}</td>
                              <td>{salary?.absentDays || "N/A"}</td>
                              <td>{salary?.effectiveAbsentDays || "N/A"}</td>
                              <td>{salary?.totalAbsentDays || "N/A"}</td>
                              <td>{salary?.daysLateLeft || "N/A"}</td>
                              <td>{salary?.basicSalary || "N/A"}</td>
                              <td>{Number(salary?.salaryPerDay || 0).toFixed(2)}</td>
                              <td>
                                {salary.allowances?.length > 0
                                  ? salary.allowances
                                      .map((allowance) => `${allowance?.name || "N/A"}: ${allowance?.amount || "N/A"}`)
                                      .join(", ")
                                  : "No Allowances"}
                              </td>
                              <td>{salary?.totalAllowanceAmount || "N/A"}</td>
                              <td>{salary?.salarySubtotal || "N/A"}</td>
                              <td>
                                {salary?.deductions?.length > 0
                                  ? salary.deductions
                                      .map((deduction) => `${deduction?.name || "N/A"}: ${Number(deduction?.amount || 0).toFixed(2)}`)
                                      .join(", ")
                                  : "No Deductions"}
                              </td>
                              <td>{Number(salary?.totalDeduction || 0).toFixed(2)}</td>
                              <td>{Number(salary?.netSalary || 0).toFixed(2)}</td>
                              <td>{salary?.remarks || "N/A"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="21" className="text-center">
                              {selectedMonth === ""
                                ? "No Salary records found to display."
                                : `No Salary records found for ${new Date(
                                    `${selectedMonth}-01`
                                  ).toLocaleString("default", {
                                    month: "long",
                                    year: "numeric",
                                  })}`}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination Controls */}
                  {filteredData.length > pageSize && (
                    <div className="d-flex justify-content-end mt-3">
                      <button
                        className="btn mx-2 btn-sm"
                        onClick={() => handlePageChange(1)}
                        disabled={page <= 1}
                      >
                        First
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                      >
                        Prev
                      </button>
                      <span className="mx-2">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        className="btn btn-sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                      >
                        Next
                      </button>
                      <button
                        className="btn mx-2 btn-sm"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={page >= totalPages}
                      >
                        Last
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowSalary;