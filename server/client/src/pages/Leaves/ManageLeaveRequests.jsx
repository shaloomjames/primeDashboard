// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// const ManageLeaveRequests = () => {
//   const [leaveData, setLeaveData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [Id, setId] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "none",
//   });
  
//       const [isSubmitting, setIsSubmitting] = useState(false);

//   // Pagination states
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);

//   const navigate = useNavigate();

//   // Authentication check
//   useEffect(() => {
//     const userToken = Cookies.get("UserAuthToken");
//     if (!userToken) navigate("/login");
//     try {
//       const decodedToken = jwtDecode(userToken);
//       setId(decodedToken.userid || "");
//       if (!decodedToken.userrole?.includes("Admin")) navigate("/login");
//     } catch (error) {
//       console.error("Token decoding failed:", error);
//       navigate("/login");
//     }
//   }, [navigate]);

//   // Fetch leave requests
//   useEffect(() => {
//     const fetchLeaves = async () => {
//       try {
//         const res = await axios.get("/api/leave");
//         setLeaveData(res.data);
//         setFilteredData(res.data);
//       } catch (error) {
//         console.error("Error fetching leave data:", error);
//       }
//     };
//     fetchLeaves();
//   }, []);

//   // Filter and sort data
//   useEffect(() => {
//     let filtered = leaveData.filter((leave) => {
//       const matchesSearch =
//         leave.employee?.employeeName
//           ?.toLowerCase()
//           .includes(search.toLowerCase()) ||
//         leave.employee?.employeeId
//           ?.toLowerCase()
//           .includes(search.toLowerCase());

//       const matchesStatus =
//         statusFilter === "all" || leave.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });

//     // Sorting
//     if (sortConfig.key) {
//       filtered = filtered.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key])
//           return sortConfig.direction === "asc" ? -1 : 1;
//         if (a[sortConfig.key] > b[sortConfig.key])
//           return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     setFilteredData(filtered);
//     setTotalPages(Math.ceil(filtered.length / pageSize));
//   }, [search, statusFilter, sortConfig, leaveData, pageSize]);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     } else if (sortConfig.key === key && sortConfig.direction === "desc") {
//       direction = "none";
//       key = null;
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleStatusUpdate = async (id, newStatus, employeeId) => {
//      // Check submission status first
//                     if (isSubmitting) {
//                         Swal.fire({
//                             icon: 'warning',
//                             title: 'Request Already Sent',
//                             text: 'Please wait while we process your previous request',
//                             timer: 2000,
//                             showConfirmButton: false
//                         });
//                         return;
//                     }
            
//                     setIsSubmitting(true);
    
//     try {
//       await axios.put(`/api/leave/${id}`, {
//         status: newStatus,
//         approvedBy: employeeId,
//       });
//       setLeaveData((prev) =>
//         prev.map((leave) =>
//           leave._id === id ? { ...leave, status: newStatus } : leave
//         )
//       );
//       Swal.fire(
//         "Success!",
//         `Leave ${newStatus.toLowerCase()} successfully`,
//         "success"
//       );
//     } catch (error) {
//       Swal.fire("Error", error.response?.data?.err || "Update failed", "error");
//     }finally {
//       setIsSubmitting(false);
//   }
//   };

//   // Pagination controls
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
//   };

//   const startIndex = (page - 1) * pageSize;
//   const currentData = filteredData.slice(startIndex, startIndex + pageSize);

//   const statusOptions = ["all", "Pending", "Approved", "Rejected"];
//   const statusColors = {
//     Pending: "warning",
//     Approved: "success",
//     Rejected: "danger",
//   };

//   return (
//     <div className="container-fluid mb-5">
//       {/* Filters */}
//       <div className="row mt-1">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="card-body">
//               <div className="row g-3">
//                 <div className="col-md-4">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Search by Name or ID"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />
//                 </div>

//                 <div className="col-md-4">
//                   <select
//                     className="form-control"
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                   >
//                     {statusOptions.map((option) => (
//                       <option key={option} value={option}>
//                         {option.charAt(0).toUpperCase() + option.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Leave Requests Table */}
//       <div className="row mt-2">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="card-body">
//               <h4 className="card-title">Manage Leave Requests</h4>
//               {/* Pagination Controls */}
//               {filteredData.length > pageSize && (
//                 <div className="mt-5 mb-2 d-flex  justify-content-end">
//                   <button
//                     className="btn btn-sm mx-2"
//                     onClick={() => handlePageChange(1)}
//                     disabled={page <= 1}
//                   >
//                     First
//                   </button>
//                   <button
//                     className="btn btn-sm"
//                     onClick={() => handlePageChange(page - 1)}
//                     disabled={page <= 1}
//                   >
//                     Prev
//                   </button>
//                   <span className="mx-2">
//                     Page {page} of {totalPages}
//                   </span>
//                   <button
//                     className="btn btn-sm"
//                     onClick={() => handlePageChange(page + 1)}
//                     disabled={page >= totalPages}
//                   >
//                     Next
//                   </button>
//                   <button
//                     className="btn mx-2 btn-sm"
//                     onClick={() => handlePageChange(totalPages)}
//                     disabled={page >= totalPages}
//                   >
//                     Last
//                   </button>
//                 </div>
//               )}
//               <div className="table-responsive table-hover">
//                 <table className="table table-hover">
//                   <thead>
//                     <tr>
//                       <th>#</th> {/* Leave ID or Serial Number */}
//                       <th>Leave Created At</th>
//                       <th
//                         onClick={() => handleSort("employee.employeeName")}
//                         style={{ cursor: "pointer" }}
//                       >
//                         Employee Name
//                         {sortConfig.key === "employee.employeeName" &&
//                           (sortConfig.direction === "asc" ? "↑" : "↓")}
//                       </th>
//                       <th>Leave Type</th> {/* Leave Type */}
//                       <th>Leave Start Date</th> {/* Leave Start Date */}
//                       <th>Leave End Date</th> {/* Leave End Date */}
//                       <th>Total Days of Leave</th> {/* Total Days */}
//                       {/* <th>Leave Days for Approval</th> */}
//                       <th>Leave Days (Excluding Holidays & Weekends)</th>
//                       <th>Leave Reason</th> {/* Reason */}
//                       <th>Leave Status</th> {/* Status */}
//                       <th>Leave Approved By</th> {/* Approved By */}
//                       <th>Skipped Overlaped Dates </th> {/* Skipped Dates */}
//                       <th>Weekends During Leave</th> {/* Weekends */}
//                       <th>Holidays During Leave</th> {/* Holidays */}
//                       <th>Actions</th> {/* Actions like Approve/Reject */}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentData.length >0 ?
//                     currentData.map((leave, index) => (
//                       <tr key={leave._id}>
//                         <td>{startIndex + index + 1}</td>{" "}
//                         {/* Leave ID or Serial Number */}
//                         <td>
//                           {leave?.createdAt
//                             ? new Date(leave.createdAt).toLocaleDateString()
//                             : "N/A"}
//                         </td>
//                         <td>{leave.employee?.employeeName || "N/A"}</td>{" "}
//                         {/* Employee Name */}
//                         <td>{leave.leaveType?.leaveTypeName || leave?.leaveTypeName || "N/A"}</td>
//                         {/* Leave Type */}
//                         <td>
//                           {new Date(leave.startDate).toLocaleDateString()}
//                         </td>{" "}
//                         {/* Start Date */}
//                         <td>
//                           {new Date(leave.endDate).toLocaleDateString()}
//                         </td>{" "}
//                         {/* End Date */}
//                         <td>{leave?.totalDaysOfLeavePeriod || "N/A"}</td>{" "}
//                         <td>{leave?.calculatedDays || "N/A"}</td>{" "}
//                         {/* Total Days of Leave */}
//                         <td>{leave.reason}</td> {/* Leave Reason */}
//                         <td>
//                           <i
//                             className={`fa fa-circle-o text-${
//                               statusColors[leave.status]
//                             } mr-2`}
//                           ></i>
//                           <span>{leave?.status || "N/A"}</span>
//                         </td>{" "}
//                         {/* Leave Status */}
//                         <td>
//                           {leave.status === "Pending" ? (
//                             <span className="text-muted">Pending Approval</span>
//                           ) : (
//                             leave?.approvedBy?.employeeName || "System/Admin"
//                           )}
//                         </td>{" "}
//                         {/* Approved By */}
//                         <td>
//                           {leave?.skippedDates && leave?.skippedDates.length > 0
//                             ? leave?.skippedDates.map((skippedDate, index) => {
//                                 const dayOfWeek = new Date(
//                                   skippedDate
//                                 ).toLocaleString("default", {
//                                   weekday: "long",
//                                 });
//                                 return (
//                                   <div key={index}>
//                                     {dayOfWeek}:{" "}
//                                     {new Date(skippedDate).toLocaleDateString()}
//                                   </div>
//                                 );
//                               })
//                             : "No skipped dates during leave"}
//                         </td>{" "}
//                         {/* Skipped Dates */}
//                         <td>
//                           {leave?.weekends && leave?.weekends.length > 0
//                             ? leave?.weekends.map((weekendDate, index) => {
//                                 const dayOfWeek = new Date(
//                                   weekendDate
//                                 ).toLocaleString("default", {
//                                   weekday: "long",
//                                 });
//                                 return (
//                                   <div key={index}>
//                                     {dayOfWeek}:{" "}
//                                     {new Date(weekendDate).toLocaleDateString()}
//                                   </div>
//                                 );
//                               })
//                             : "No weekends during leave"}
//                         </td>{" "}
//                         {/* Weekends During Leave */}
//                         <td>
//                           {leave?.holidays && leave?.holidays.length > 0
//                             ? leave?.holidays.map((holiday) => (
//                                 <div key={holiday._id}>
//                                   {holiday.name}:{" "}
//                                   {new Date(holiday.date).toLocaleDateString()}
//                                 </div>
//                               ))
//                             : "No holidays during leave"}
//                         </td>{" "}
//                         {/* Holidays During Leave */}
//                         <td>
//                           <button
//                             className="btn btn-success btn-sm me-2"
//                             disabled={leave.status === "Approved"  || isSubmitting }
//                             onClick={() =>
//                               handleStatusUpdate(leave._id, "Approved", Id)
//                             }
//                           >
//                             {/* Approve */}
//                             {isSubmitting ? "Approving Leave..." : "Approve Leave"}
//                           </button>
//                           <button
//                             className="btn btn-danger btn-sm my-2"
//                             disabled={leave.status === "Rejected" || leave.status === "Pending" || isSubmitting }
//                             onClick={() =>
//                               handleStatusUpdate(leave._id, "Rejected")
//                             }
//                           >
//                             {/* Reject */}
//                             {isSubmitting ? "Rejecting Leave..." : "Reject Leave"}
//                           </button>
//                         </td>{" "}
//                         {/* Actions */}
//                       </tr>
//                     )):(
//                       <tr>
//                       <td colSpan="9" className="text-center">
//                         {statusFilter === ""
//                           ? search === ""
//                             ? "No Leaves Found. Please select a Status."
//                             : `No Leaves Found For the Search Term "${search}". Please select a Status.`
//                           : search === ""
//                           ? `No Leaves Found For the Selected Status "${statusFilter}" `
//                           : `No Leaves Found For the Search Term "${search}" in the Selected Status "${statusFilter}" `}
//                       </td>
//                     </tr>
//                     ) }
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {filteredData.length > pageSize && (
//                 <div className="d-flex justify-content-end mt-3">
//                   <button
//                     className="btn btn-sm mx-2"
//                     onClick={() => handlePageChange(1)}
//                     disabled={page === 1}
//                   >
//                     First
//                   </button>
//                   <button
//                     className="btn btn-sm"
//                     onClick={() => handlePageChange(page - 1)}
//                     disabled={page === 1}
//                   >
//                     Prev
//                   </button>
//                   <span className="mx-2">
//                     Page {page} of {totalPages}
//                   </span>
//                   <button
//                     className="btn btn-sm"
//                     onClick={() => handlePageChange(page + 1)}
//                     disabled={page === totalPages}
//                   >
//                     Next
//                   </button>
//                   <button
//                     className="btn btn-sm mx-2"
//                     onClick={() => handlePageChange(totalPages)}
//                     disabled={page === totalPages}
//                   >
//                     Last
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageLeaveRequests;
import axios from "axios";
import React, { useEffect, useState } from "react";
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
  // Replace single isSubmitting with an object to track per-button state
  const [submittingStates, setSubmittingStates] = useState({});

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
    // Check if this specific button is already submitting
    if (submittingStates[`${id}-${newStatus}`]) {
      Swal.fire({
        icon: "warning",
        title: "Request Already Sent",
        text: "Please wait while we process your request",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    // Set submitting state for this specific button
    setSubmittingStates((prev) => ({
      ...prev,
      [`${id}-${newStatus}`]: true,
    }));

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
    } finally {
      // Reset submitting state for this specific button
      setSubmittingStates((prev) => ({
        ...prev,
        [`${id}-${newStatus}`]: false,
      }));
    }
  };

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
                <div className="mt-5 mb-2 d-flex justify-content-end">
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
                      <th>#</th>
                      <th>Leave Created At</th>
                      <th
                        onClick={() => handleSort("employee.employeeName")}
                        style={{ cursor: "pointer" }}
                      >
                        Employee Name
                        {sortConfig.key === "employee.employeeName" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th>Leave Type</th>
                      <th>Leave Start Date</th>
                      <th>Leave End Date</th>
                      <th>Total Days of Leave</th>
                      <th>Leave Days (Excluding Holidays & Weekends)</th>
                      <th>Leave Reason</th>
                      <th>Leave Status</th>
                      <th>Leave Approved By</th>
                      <th>Skipped Overlapped Dates</th>
                      <th>Weekends During Leave</th>
                      <th>Holidays During Leave</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((leave, index) => (
                        <tr key={leave._id}>
                          <td>{startIndex + index + 1}</td>
                          <td>
                            {leave?.createdAt
                              ? new Date(leave.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>{leave.employee?.employeeName || "N/A"}</td>
                          <td>
                            {leave.leaveType?.leaveTypeName ||
                              leave?.leaveTypeName ||
                              "N/A"}
                          </td>
                          <td>
                            {new Date(leave.startDate).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(leave.endDate).toLocaleDateString()}
                          </td>
                          <td>{leave?.totalDaysOfLeavePeriod || "N/A"}</td>
                          <td>{leave?.calculatedDays || "N/A"}</td>
                          <td>{leave.reason}</td>
                          <td>
                            <i
                              className={`fa fa-circle-o text-${
                                statusColors[leave.status]
                              } mr-2`}
                            ></i>
                            <span>{leave?.status || "N/A"}</span>
                          </td>
                          <td>
                            {leave.status === "Pending" ? (
                              <span className="text-muted">
                                Pending Approval
                              </span>
                            ) : (
                              leave?.approvedBy?.employeeName || "System/Admin"
                            )}
                          </td>
                          <td>
                            {leave?.skippedDates && leave?.skippedDates.length > 0
                              ? leave.skippedDates.map((skippedDate, index) => {
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
                          </td>
                          <td>
                            {leave?.weekends && leave?.weekends.length > 0
                              ? leave.weekends.map((weekendDate, index) => {
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
                          </td>
                          <td>
                            {leave?.holidays && leave?.holidays.length > 0
                              ? leave.holidays.map((holiday) => (
                                  <div key={holiday._id}>
                                    {holiday.name}:{" "}
                                    {new Date(holiday.date).toLocaleDateString()}
                                  </div>
                                ))
                              : "No holidays during leave"}
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm me-2"
                              disabled={
                                leave.status === "Approved" ||
                                submittingStates[`${leave._id}-Approved`]
                              }
                              onClick={() =>
                                handleStatusUpdate(leave._id, "Approved", Id)
                              }
                            >
                              {submittingStates[`${leave._id}-Approved`]
                                ? "Approving Leave..."
                                : "Approve Leave"}
                            </button>
                            <button
                              className="btn btn-danger btn-sm my-2"
                              disabled={
                                leave.status === "Rejected" ||
                                submittingStates[`${leave._id}-Rejected`]
                              }
                              onClick={() =>
                                handleStatusUpdate(leave._id, "Rejected", Id)
                              }
                            >
                              {submittingStates[`${leave._id}-Rejected`]
                                ? "Rejecting Leave..."
                                : "Reject Leave"}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="15" className="text-center">
                          {statusFilter === ""
                            ? search === ""
                              ? "No Leaves Found. Please select a Status."
                              : `No Leaves Found For the Search Term "${search}". Please select a Status.`
                            : search === ""
                            ? `No Leaves Found For the Selected Status "${statusFilter}" `
                            : `No Leaves Found For the Search Term "${search}" in the Selected Status "${statusFilter}" `}
                        </td>
                      </tr>
                    )}
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