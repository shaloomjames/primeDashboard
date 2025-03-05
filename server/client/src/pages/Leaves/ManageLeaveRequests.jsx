// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2"; // Import SweetAlert2
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// const ManageLeaveRequests = () => {
//   const [LeaveData, setLeaveData] = useState([]); // Raw employee data
//   const [search, setSearch] = useState(""); // State for search query
//   const [filteredData, setFilteredData] = useState([]); // Filtered employees
//   // const [salaryRange, setSalaryRange] = useState({ min: "", max: "" }); // State for salary range filter
//   // State to track sorting direction: 'asc' for ascending, 'desc' for descending, and 'none' for no sort
//   const [sortDirection, setSortDirection] = useState("none");

//   // Pagination states
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const userToken = Cookies.get("UserAuthToken");

//     if (userToken) {
//       try {
//         const decodedToken = jwtDecode(userToken); // Decode the JWT token
//         const userRole = decodedToken.userrole; // Get the user role(s)

//         // Redirect to login if the user is not an Admin
//         if (
//           !(Array.isArray(userRole) && userRole.includes("Admin")) && // Array case
//           userRole !== "Admin" // String case
//         ) {
//           navigate("/login");
//         }
//       } catch (error) {
//         // Handle token decoding failure
//         console.error("Token decoding failed:", error);
//         navigate("/login");
//       }
//     } else {
//       // Redirect if no token is found
//       navigate("/login");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get("/api/leave");
//         setLeaveData(res.data);
//         setFilteredData(res.data); // Initialize filtered data with all employees
//       } catch (error) {
//         console.log("Error Fetching Employees Data", error);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // Handle pagination logic on changes
//   useEffect(() => {
//     setTotalPages(Math.ceil(filteredData.length / pageSize));
//   }, [filteredData, pageSize]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   // useEffect(() => {
//   //   // Filter employees whenever search, RoleFilter, or salaryRange changes
//   //   const filteredEmployees = LeaveData.filter((employee) => {
//   //     // Check if the employee matches the search term
//   //     const matchesSearch =
//   //       employee?.employeeName
//   //         .toLowerCase()
//   //         .includes(search.toLowerCase().trim()) ||
//   //       employee?.employeeEmail
//   //         .toLowerCase()
//   //         .includes(search.toLowerCase().trim()) ||
//   //       employee?.employeeId
//   //         .toLowerCase()
//   //         .includes(search.toLowerCase().trim());

//   //     // Check if the employee matches the salary range
//   //     const matchesSalary =
//   //       (!salaryRange.min ||
//   //         employee?.employeeSalary >= parseFloat(salaryRange.min)) &&
//   //       (!salaryRange.max ||
//   //         employee?.employeeSalary <= parseFloat(salaryRange.max));

//   //     return matchesSearch  && matchesSalary;
//   //   });

//   //   setFilteredData(filteredEmployees); // Set filtered data
//   // }, [search, salaryRange, LeaveData]); // Run the effect when search, RoleFilter, salaryRange, or employeeData changes

//   // Extract all roles from employee data for dropdown
//   const allRoles = [
//     ...new Set(
//       LeaveData
//         .map((employee) => employee.employeeRoles?.map((role) => role.roleName)) // Extract role names from employeeRole array
//         .flat()
//     ),
//   ];

//   const deleteEmployee = async (employeeid) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to undo this action!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const response = await axios.delete(`/api/leave/${employeeid}`);
//           setLeaveData(
//             LeaveData.filter((employee) => employee._id !== employeeid)
//           );
//           setFilteredData(
//             filteredData.filter((employee) => employee._id !== employeeid)
//           );
//           Swal.fire("Deleted!", response.data.msg, "success");
//         } catch (error) {
//           Swal.fire(
//             "Error",
//             error?.response?.data?.err ||
//               "An unexpected error occurred. Please try again.",
//             "error"
//           );
//           console.error("Error deleting employee:", error);
//         }
//       }
//     });
//   };

//   // Pagination slice
//   const startIndex = (page - 1) * pageSize;
//   const endIndex = page * pageSize;
//   const currentData = filteredData.slice(startIndex, endIndex);

//   // Sort function based on employeeId
//   const handleSort = () => {
//     if (sortDirection === "none" || sortDirection === "desc") {
//       setSortDirection("asc");
//     } else {
//       setSortDirection("desc");
//     }
//   };

//   const sortedData = [...filteredData].sort((a, b) => {
//     const numA = parseInt(a.employeeId.substring(5), 10);
//     const numB = parseInt(b.employeeId.substring(5), 10);

//     if (sortDirection === "asc") {
//       return numA - numB; // ascending
//     } else if (sortDirection === "desc") {
//       return numB - numA; // descending
//     }
//     return 0; // no sort
//   });

//   return (
//     <>
//       <div className="container-fluid mb-5">
//         {/* Search and Filters */}
//         <div className="row mt-1">
//           <div className="col-lg-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="row mt-2">
//                   <div className="col-lg-4 col-md-5 col-sm-6 my-2">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Search by Name, Email, or ID"
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)} // Update search query
//                     />
//                   </div>

//                   <div className="col-lg-3 col-md-5 col-sm-5 my-2">
//                     <select
//                       id="inputState"
//                       className="form-control"
//                       // onChange={(e) => setRoleFilter(e.target.value)}
//                     >
//                       <option disabled selected>
//                         Search By Status
//                       </option>
//                       <option value={""}>All</option>
//                       {allRoles.length > 0 ? (
//                         allRoles.map((role, index) => (
//                           <option value={role || ""} key={index}>
//                             {role || "N/A"}
//                           </option>
//                         ))
//                       ) : (
//                         <option disabled>No Roles Available</option>
//                       )}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Employee Table */}
//         <div className="row mt-2">
//           <div className="col-lg-12">
//             <div className="card">
//               <div className="card-body">
//                 <h4 className="card-title">Manage Leave Request</h4>
// {/* Pagination Controls */}
// {filteredData.length > pageSize && (
//   <div className="mt-5 mb-2 d-flex  justify-content-end">
//     <button
//       className="btn btn-sm mx-2"
//       onClick={() => handlePageChange(1)}
//       disabled={page <= 1}
//     >
//       First
//     </button>
//     <button
//       className="btn btn-sm"
//       onClick={() => handlePageChange(page - 1)}
//       disabled={page <= 1}
//     >
//       Prev
//     </button>
//     <span className="mx-2">
//       Page {page} of {totalPages}
//     </span>
//     <button
//       className="btn btn-sm"
//       onClick={() => handlePageChange(page + 1)}
//       disabled={page >= totalPages}
//     >
//       Next
//     </button>
//     <button
//       className="btn mx-2 btn-sm"
//       onClick={() => handlePageChange(totalPages)}
//       disabled={page >= totalPages}
//     >
//       Last
//     </button>
//   </div>
// )}
//                 <div className="table-responsive">
//                   <table className="table header-border">
//                     <thead>
//                       <tr>
//                         <th>#</th>
//                         <th onClick={handleSort} style={{ cursor: "pointer" }}>
//                           Leave Employee Id{" "}
//                           {sortDirection === "asc"
//                             ? "↑"
//                             : sortDirection === "desc"
//                             ? "↓"
//                             : ""}
//                         </th>
//                         <th>Leave Dates</th>
//                         <th>Leave Types</th>
//                         <th>Leave Status</th> {/* New column for allowances */}
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {sortedData.length > 0 ? (
//                         sortedData.map((employee, index) => (
//                           <tr key={index}>
//                             <td>{startIndex + index + 1 || 0}</td>{" "}
//                             {/* Correct index calculation */}
//                             <td>{employee?.employeeId || "N/A"}</td>
//                             <td>{employee?.employeeId || "N/A"}</td>
//                             <td>{employee?.employeeId || "N/A"}</td>
//                             <td>
//                               {employee.employeeRoles?.length > 0
//                                 ? employee.employeeRoles.map((role, index) => (
//                                     <span key={role.roleName}>
//                                       {role?.roleName || "N/A"}
//                                       <br />
//                                     </span>
//                                   ))
//                                 : "N/A"}
//                             </td>
// <td>
//   <span>
//     <Link
//       data-toggle="tooltip"
//       data-placement="top"
//       title="Edit"
//       to={`/updateemployee/${employee._id}`}
//     >
//       <button className="btn btn-primary btn-sm">
//         {" "}
//         Approve
//       </button>
//     </Link>
//     <button
//       data-toggle="tooltip"
//       data-placement="top"
//       title="Delete"
//       className="btn btn-danger btn-sm mx-1 my-2"
//       onClick={() => deleteEmployee(employee._id)}
//     >
//       Reject
//     </button>
//   </span>
// </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="6" className="text-center">
//                             No employees found.
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//                 {/* Pagination Controls */}
//                 {filteredData.length > pageSize && (
//                   <div className=" d-flex mt-3  justify-content-end">
//                     <button
//                       className="btn btn-sm mx-2"
//                       onClick={() => handlePageChange(1)}
//                       disabled={page <= 1}
//                     >
//                       First
//                     </button>
//                     <button
//                       className="btn btn-sm"
//                       onClick={() => handlePageChange(page - 1)}
//                       disabled={page <= 1}
//                     >
//                       Prev
//                     </button>
//                     <span className="mx-2">
//                       Page {page} of {totalPages}
//                     </span>
//                     <button
//                       className="btn btn-sm"
//                       onClick={() => handlePageChange(page + 1)}
//                       disabled={page >= totalPages}
//                     >
//                       Next
//                     </button>
//                     <button
//                       className="btn mx-2 btn-sm"
//                       onClick={() => handlePageChange(totalPages)}
//                       disabled={page >= totalPages}
//                     >
//                       Last
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <center className=" card py-5" style={{ visibility: "hidden" }}>
//           <div className="row"></div>
//         </center>
//       </div>
//     </>
//   );
// };

// export default ManageLeaveRequests;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ManageLeaveRequests = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [search, setSearch] = useState("");
  const [Id, setId] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "none",
  });

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");
    if (!userToken) navigate("/login");
    try {
      const decodedToken = jwtDecode(userToken);
      setId(decodedToken.userid || "");
      if (!decodedToken.userrole?.includes("Admin")) navigate("/login");
    } catch (error) {
      console.error("Token decoding failed:", error);
      navigate("/login");
    }
  }, [navigate]);

  // Fetch leave requests
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get("/api/leave");
        setLeaveData(res.data);
        setFilteredData(res.data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };
    fetchLeaves();
  }, []);

  // Filter and sort data
  useEffect(() => {
    let filtered = leaveData.filter((leave) => {
      const matchesSearch =
        leave.employee?.employeeName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        leave.employee?.employeeId
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || leave.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sorting
    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  }, [search, statusFilter, sortConfig, leaveData, pageSize]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "none";
      key = null;
    }
    setSortConfig({ key, direction });
  };

  const handleStatusUpdate = async (id, newStatus, employeeId) => {
    try {
      await axios.put(`/api/leave/${id}`, {
        status: newStatus,
        approvedBy: employeeId,
      });
      setLeaveData((prev) =>
        prev.map((leave) =>
          leave._id === id ? { ...leave, status: newStatus } : leave
        )
      );
      Swal.fire(
        "Success!",
        `Leave ${newStatus.toLowerCase()} successfully`,
        "success"
      );
    } catch (error) {
      Swal.fire("Error", error.response?.data?.err || "Update failed", "error");
    }
  };

  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const startIndex = (page - 1) * pageSize;
  const currentData = filteredData.slice(startIndex, startIndex + pageSize);

  const statusOptions = ["all", "Pending", "Approved", "Rejected"];
  const statusColors = {
    Pending: "warning",
    Approved: "success",
    Rejected: "danger",
  };

  return (
    <div className="container-fluid mb-5">
      {/* Filters */}
      <div className="row mt-1">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Name or ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <select
                    className="form-control"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="row mt-2">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Manage Leave Requests</h4>
              {/* Pagination Controls */}
              {filteredData.length > pageSize && (
                <div className="mt-5 mb-2 d-flex  justify-content-end">
                  <button
                    className="btn btn-sm mx-2"
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
              <div className="table-responsive table-hover">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th> {/* Leave ID or Serial Number */}
                      <th>Leave Created At</th>
                      <th
                        onClick={() => handleSort("employee.employeeName")}
                        style={{ cursor: "pointer" }}
                      >
                        Employee Name
                        {sortConfig.key === "employee.employeeName" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th>Leave Type</th> {/* Leave Type */}
                      <th>Leave Start Date</th> {/* Leave Start Date */}
                      <th>Leave End Date</th> {/* Leave End Date */}
                      <th>Total Days of Leave</th> {/* Total Days */}
                      {/* <th>Leave Days for Approval</th> */}
                      <th>Leave Days (Excluding Holidays & Weekends)</th>
                      <th>Leave Reason</th> {/* Reason */}
                      <th>Leave Status</th> {/* Status */}
                      <th>Leave Approved By</th> {/* Approved By */}
                      <th>Skipped Dates</th> {/* Skipped Dates */}
                      <th>Weekends During Leave</th> {/* Weekends */}
                      <th>Holidays During Leave</th> {/* Holidays */}
                      <th>Actions</th> {/* Actions like Approve/Reject */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((leave, index) => (
                      <tr key={leave._id}>
                        <td>{startIndex + index + 1}</td>{" "}
                        {/* Leave ID or Serial Number */}
                        <td>
                          {leave?.createdAt
                            ? new Date(leave.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>{leave.employee?.employeeName || "N/A"}</td>{" "}
                        {/* Employee Name */}
                        <td>{leave.leaveType?.leaveTypeName || "N/A"}</td>{" "}
                        {/* Leave Type */}
                        <td>
                          {new Date(leave.startDate).toLocaleDateString()}
                        </td>{" "}
                        {/* Start Date */}
                        <td>
                          {new Date(leave.endDate).toLocaleDateString()}
                        </td>{" "}
                        {/* End Date */}
                        <td>{leave?.totalDaysOfLeavePeriod || "N/A"}</td>{" "}
                        <td>{leave?.calculatedDays || "N/A"}</td>{" "}
                        {/* Total Days of Leave */}
                        <td>{leave.reason}</td> {/* Leave Reason */}
                        <td>
                          <i
                            className={`fa fa-circle-o text-${
                              statusColors[leave.status]
                            } mr-2`}
                          ></i>
                          <span>{leave?.status || "N/A"}</span>
                        </td>{" "}
                        {/* Leave Status */}
                        <td>
                          {leave.status === "Pending" ? (
                            <span className="text-muted">Pending Approval</span>
                          ) : (
                            leave?.approvedBy?.employeeName || "System/Admin"
                          )}
                        </td>{" "}
                        {/* Approved By */}
                        <td>
                          {leave?.skippedDates && leave?.skippedDates.length > 0
                            ? leave?.skippedDates.map((skippedDate, index) => {
                                const dayOfWeek = new Date(
                                  skippedDate
                                ).toLocaleString("default", {
                                  weekday: "long",
                                });
                                return (
                                  <div key={index}>
                                    {dayOfWeek}:{" "}
                                    {new Date(skippedDate).toLocaleDateString()}
                                  </div>
                                );
                              })
                            : "No skipped dates during leave"}
                        </td>{" "}
                        {/* Skipped Dates */}
                        <td>
                          {leave?.weekends && leave?.weekends.length > 0
                            ? leave?.weekends.map((weekendDate, index) => {
                                const dayOfWeek = new Date(
                                  weekendDate
                                ).toLocaleString("default", {
                                  weekday: "long",
                                });
                                return (
                                  <div key={index}>
                                    {dayOfWeek}:{" "}
                                    {new Date(weekendDate).toLocaleDateString()}
                                  </div>
                                );
                              })
                            : "No weekends during leave"}
                        </td>{" "}
                        {/* Weekends During Leave */}
                        <td>
                          {leave?.holidays && leave?.holidays.length > 0
                            ? leave?.holidays.map((holiday) => (
                                <div key={holiday._id}>
                                  {holiday.name}:{" "}
                                  {new Date(holiday.date).toLocaleDateString()}
                                </div>
                              ))
                            : "No holidays during leave"}
                        </td>{" "}
                        {/* Holidays During Leave */}
                        <td>
                          <button
                            className="btn btn-success btn-sm me-2"
                            disabled={leave.status === "Approved"}
                            onClick={() =>
                              handleStatusUpdate(leave._id, "Approved", Id)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm my-2"
                            disabled={leave.status === "Rejected"}
                            onClick={() =>
                              handleStatusUpdate(leave._id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </td>{" "}
                        {/* Actions */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredData.length > pageSize && (
                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn btn-sm mx-2"
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                  >
                    First
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Prev
                  </button>
                  <span className="mx-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                  <button
                    className="btn btn-sm mx-2"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages}
                  >
                    Last
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageLeaveRequests;
