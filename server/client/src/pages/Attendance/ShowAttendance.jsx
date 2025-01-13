// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';

// const ShowAttendance = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [Id, setId] = useState(null);
//   const [search, setSearch] = useState("");
//   const [attendanceReport, setAttendanceReport] = useState(null);


//   // Pagination states
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);


  // // Format helpers
  // const formatDate = (date) => new Date(date).toISOString().split("T")[0];
  // const formatTime = (date) =>
  //   new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });


//       const navigate = useNavigate();

//   useEffect(() => {
//     const userToken = Cookies.get("UserAuthToken");

//     if (userToken) {
//       try {
//         const decodedToken = jwtDecode(userToken); // Decode the JWT token
//         const userRole = decodedToken.userrole;   // Get the user role(s)

//         // Redirect to login if the user is not an Admin
//         if (
//           !(Array.isArray(userRole) && userRole.includes("Admin")) && // Array case
//           userRole !== "Admin"                                       // String case
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

//   // Fetch attendance data from the API
//   useEffect(() => {
//     const fetchAttendanceData = async () => {
//       try {
//         const response = await axios.get("/api/attendance");
//         setAttendanceData(response.data); // Set fetched data
//         setFilteredRecords(response.data); // Default to all records
//       } catch (error) {
//         console.error("Error fetching attendance data from API:", error);
//       }
//     };
//     fetchAttendanceData();
//   }, []);


//   // Handle pagination logic on changes
//   useEffect(() => {
//     setTotalPages(Math.ceil(filteredRecords.length / pageSize));
//   }, [filteredRecords, pageSize]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };


//   // Update filtered records based on search input and selected month
// useEffect(() => {
//   let filteredRecords = attendanceData;

//   // Filter by the selected month
//   if (selectedMonth) {
//     filteredRecords = filteredRecords.filter((record) =>
//       formatDate(record.attendanceDate).startsWith(selectedMonth)
//     );
//   }

//   // Further filter by search input
//   if (search) {
//     const searchLower = search.toLowerCase();
//     filteredRecords = filteredRecords.filter(
//       (record) =>
//         record?.employee.employeeName.toLowerCase().includes(searchLower) ||
//         record?.employee.employeeEmail.toLowerCase().includes(searchLower) ||
//         record?.employee.employeeId.toLowerCase().includes(searchLower)
//     );
//   }

//   // Update the filtered records
//   setFilteredRecords(filteredRecords);

//   // Update ID state if filtered records belong to the same user
//   if (
//     filteredRecords.length > 0 &&
//     filteredRecords.every(
//       (record) => record.employee.employeeId === filteredRecords[0].employee.employeeId
//     )
//   ) {
//     setId(filteredRecords[0].employee._id);
//   } else {
//     setId(null); // Reset ID if no unique user is found
//   }
// }, [search, selectedMonth, attendanceData]);


//   // Filter attendance records based on the selected month
//   useEffect(() => {
//     const filteredRecords = attendanceData.filter((record) =>
//       formatDate(record.attendanceDate).startsWith(selectedMonth)
//     );
//     setFilteredRecords(filteredRecords);
//   }, [attendanceData, selectedMonth]);


//   // Fetch attendance report when Generate Report is clicked
//   const fetchAttendanceReport = async () => {
//     try {
//       if (!Id) return;
//       const response = await axios.get(`/api/attendance/report/${Id}/${selectedMonth}`
//       );
//       setAttendanceReport(response.data); // Update attendance report details
//     } catch (error) {
//       console.error("Error fetching attendance report:", error);
//     }
//   };


//   // Pagination slice
//   const startIndex = (page - 1) * pageSize;
//   const endIndex = page * pageSize;
//   const currentData = filteredRecords.slice(startIndex, endIndex);

//   return (
//     <div className="container-fluid">
//       {/* Controls */}
//       <div className="row d-flex justify-content-between align-items-center mx-3 my-5">
//         <div className="col-lg-3 col-md-4">
//           <label>Select Month</label>
//           <input
//             type="month"
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//             className="form-control"
//           />
//         </div>
//         <div className="col-lg-4 col-md-5 col-sm-10">
//           <label>Search User</label>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search by Name, Email, or ID"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <div className="col-lg-2 col-md-3">
//           <button
//             onClick={fetchAttendanceReport}
//             className="btn btn-primary mt-3 py-2"
//             disabled={!Id}
//           >
//             Generate Report
//           </button>
//         </div>
//       </div>

//       {/* Attendance Records */}
//       <div className="row mt-5">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="card-body">
//               {/* Attendance Report */}
//               {attendanceReport && (
//                 <div className="mt-4 mb-4">
//                   <h4>Report for {attendanceReport.reportMonth}</h4>
//                   <p><strong style={{ marginRight: "400px" }}>Employee ID:</strong> {attendanceReport?.employee?.employeeId || 'N/A'}</p>
//                   <p>
//                     <strong>Total Days in Month:</strong> {attendanceReport.totalDays}
//                   </p>
//                   <p>
//                     <strong>Total Sundays:</strong> {attendanceReport.totalSundays}
//                   </p>
//                   <p>
//                     <strong>Working Days (Excluding Sundays):</strong>{" "}
//                     {attendanceReport.workingDays}
//                   </p>
//                   <p>
//                     <strong>Days On Time:</strong> {attendanceReport.daysOnTime}
//                   </p>
//                   <p>
//                     <strong>Days Late:</strong> {attendanceReport.daysLate}
//                   </p>
//                   <p>
//                     <strong>Absent Days (Excluding Sundays):</strong> {attendanceReport.absentDays}
//                   </p>
//                   <p>
//                     <strong>Effective Absents (Conversion from lates):</strong> {attendanceReport.effectiveAbsentDays || 0}
//                   </p>
//                   <p>
//                     <strong>Effective Lates left (after conversion to absent):</strong> {attendanceReport.remainingLates || 0}
//                   </p>
//                   <p>
//                     <strong>Total Absents:</strong> {attendanceReport.totalAbsentDays || 0}
//                   </p>
//                 </div>
//               )}
//               <h4>Attendance Records</h4>
              // {/* Pagination Controls */}
              // {filteredRecords.length > pageSize && (<div className="mt-5 mb2">
              //   <button className='btn btn-sm mx-2' onClick={() => handlePageChange(1)} disabled={page <= 1}>
              //     First
              //   </button>
              //   <button className='btn btn-sm' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
              //     Prev
              //   </button>
              //   <span className='mx-2'>
              //     Page {page} of {totalPages}
              //   </span>
              //   <button className='btn btn-sm' onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
              //     Next
              //   </button>
              //   <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}>
              //     Last
              //   </button>
              // </div>)}

//               <div className="table-responsive">
                // <table className="table">
                //   <thead>
                //     <tr>
                //       <th>#</th>
                //       <th>Employee Id</th>
                //       <th>Employee Name</th>
                //       <th>Employee Email</th>
                //       <th>Date</th>
                //       <th>Time In</th>
                //       <th>Time Out</th>
                //       <th>Status</th>
                //       <th>Late By (minutes)</th>
                //       <th>Total Hours</th>
                //     </tr>
                //   </thead>
                //   <tbody>
                //     {currentData.length > 0 ? (
                //       currentData.map((record, index) => {
                //         const timeIn = record?.timeIn ? new Date(record.timeIn) : null;
                //         const timeOut = record?.timeOut
                //           ? new Date(record.timeOut)
                //           : null;

                //         return (
                //           <tr key={index}>
                //             <td>{startIndex + index + 1}</td> {/* Correct index calculation */}
                //             <td>{record?.employee.employeeId || "N/A"}</td>
                //             <td>{record?.employee.employeeName || "N/A"}</td>
                //             <td>{record?.employee.employeeEmail || "N/A"}</td>
                //             <td>
                //               {record?.attendanceDate
                //                 ? formatDate(record.attendanceDate)
                //                 : "-"}
                //             </td>
                //             <td>{timeIn ? formatTime(timeIn) : "-"}</td>
                //             <td>{timeOut ? formatTime(timeOut) : "-"}</td>
                //             <td
                //               className={
                //                 record?.status === "Late" ? "text-warning" : "text-success"
                //               }
                //             >
                //               {record?.status || "N/A"}
                //             </td>
                //             <td>{record.lateBy || 0}</td>
                //             <td>{record.totalHours || 0}</td>
                //           </tr>
                //         );
                //       })
                //     ) : (
                //       <tr>
                //         <td colSpan="9" className="text-center">
                //           {selectedMonth === "" ? (
                //             // If no month is selected
                //             search === "" ? (
                //               `No Attendance Found. Please select a Month and/or search for a user.`
                //             ) : (
                //               `No Attendance Found For the Search Term "${search}". Please select a Month.`
                //             )
                //           ) : (
                //             // If a month is selected
                //             search === "" ? (
                //               `No Attendance Found For the Selected Month ${new Date(
                //                 `${selectedMonth}-01`
                //               ).toLocaleString("default", { month: "long", year: "numeric" })}`
                //             ) : (
                //               `No Attendance Found For the Search Term "${search}" in the Selected Month ${new Date(
                //                 `${selectedMonth}-01`
                //               ).toLocaleString("default", { month: "long", year: "numeric" })}`
                //             )
                //           )}
                //         </td>
                //       </tr>

                //     )}
                //   </tbody>
                // </table>
//               </div>
              // {/* Pagination Controls */}
              // {filteredRecords.length > pageSize && (<div>
              //   <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(1)} disabled={page <= 1}>
              //     First
              //   </button>
              //   <button className='btn btn-sm' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
              //     Prev
              //   </button>
              //   <span className='mx-2'>
              //     Page {page} of {totalPages}
              //   </span>
              //   <button className='btn btn-sm' onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
              //     Next
              //   </button>
              //   <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}>
              //     Last
              //   </button>
              // </div>)}

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShowAttendance;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

const ShowAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [Id, setId] = useState(null);
  const [search, setSearch] = useState("");
  const [attendanceReport, setAttendanceReport] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Helper to format date
    // Format helpers
    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    const formatTime = (date) =>
      new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  
  

  const navigate = useNavigate();

  // Verify token and role
  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");

    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        const userRole = decodedToken.userrole;

        if (
          !(Array.isArray(userRole) && userRole.includes("Admin")) &&
          userRole !== "Admin"
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

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get("/api/attendance");
        setAttendanceData(response.data);
        setFilteredRecords(response.data); // Initially, all records are shown
      } catch (error) {
        console.error("Error fetching attendance data from API:", error);
      }
    };
    fetchAttendanceData();
  }, []);

  // Handle pagination updates
  useEffect(() => {
    setTotalPages(Math.ceil(filteredRecords.length / pageSize));
  }, [filteredRecords, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Update filtered records
  useEffect(() => {
    let filtered = attendanceData;

    if (selectedMonth) {
      filtered = filtered.filter((record) =>
        formatDate(record.attendanceDate).startsWith(selectedMonth)
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record?.employee.employeeName.toLowerCase().includes(searchLower) ||
          record?.employee.employeeEmail.toLowerCase().includes(searchLower) ||
          record?.employee.employeeId.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRecords(filtered);

    // Determine if a unique user is selected
    if (
      filtered.length > 0 &&
      filtered.every(
        (record) =>
          record.employee.employeeId === filtered[0].employee.employeeId
      )
    ) {
      setId(filtered[0].employee._id);
    } else {
      setId(null);
    }
  }, [search, selectedMonth, attendanceData]);

  // Fetch attendance report
  const fetchAttendanceReport = async () => {
    try {
      if (!Id) return;
      const response = await axios.get(
        `/api/attendance/report/${Id}/${selectedMonth}`
      );
      setAttendanceReport(response.data);
    } catch (error) {
      console.error("Error fetching attendance report:", error);
    }
  };

  // Pagination calculations
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = filteredRecords.slice(startIndex, endIndex);

  return (
    <div className="container-fluid">
      {/* Filters */}
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
        <div className="col-lg-4 col-md-5 col-sm-10">
          <label>Search User</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name, Email, or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-lg-2 col-md-3">
          <button
            onClick={fetchAttendanceReport}
            className="btn btn-primary mt-3 py-2"
            disabled={!Id}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Attendance Report */}
      {attendanceReport && (
        <div className="mt-4">
          <h4>Report for {attendanceReport.reportMonth}</h4>
          {/* Report details */}
        </div>
      )}

      {/* Attendance Records */}
      <div className="row mt-5">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4>Attendance Records</h4>
                            {/* Pagination Controls */}
                            {filteredRecords.length > pageSize && (<div className="mt-5 mb-2 d-flex  justify-content-end">
                
                <button className='btn btn-sm mx-2' onClick={() => handlePageChange(1)} disabled={page <= 1}>
                  First
                </button>
                <button className='btn btn-sm' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                  Prev
                </button>
                <span className='mx-2'>
                  Page {page} of {totalPages}
                </span>
                <button className='btn btn-sm' onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                  Next
                </button>
                <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}>
                  Last
                </button>
              </div>
            )}

              <div className="table-responsive">
                                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee Id</th>
                      <th>Employee Name</th>
                      <th>Employee Email</th>
                      <th>Date</th>
                      <th>Time In</th>
                      <th>Time Out</th>
                      <th>Status</th>
                      <th>Late By (minutes)</th>
                      <th>Total Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((record, index) => {
                        const timeIn = record?.timeIn ? new Date(record.timeIn) : null;
                        const timeOut = record?.timeOut
                          ? new Date(record.timeOut)
                          : null;

                        return (
                          <tr key={index}>
                            <td>{startIndex + index + 1}</td> {/* Correct index calculation */}
                            <td>{record?.employee.employeeId || "N/A"}</td>
                            <td>{record?.employee.employeeName || "N/A"}</td>
                            <td>{record?.employee.employeeEmail || "N/A"}</td>
                            <td>
                              {record?.attendanceDate
                                ? formatDate(record.attendanceDate)
                                : "-"}
                            </td>
                            <td>{timeIn ? formatTime(timeIn) : "-"}</td>
                            <td>{timeOut ? formatTime(timeOut) : "-"}</td>
                            <td
                              className={
                                record?.status === "Late" ? "text-warning" : "text-success"
                              }
                            >
                              {record?.status || "N/A"}
                            </td>
                            <td>{record.lateBy || 0}</td>
                            <td>{record.totalHours || 0}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          {selectedMonth === "" ? (
                            // If no month is selected
                            search === "" ? (
                              `No Attendance Found. Please select a Month and/or search for a user.`
                            ) : (
                              `No Attendance Found For the Search Term "${search}". Please select a Month.`
                            )
                          ) : (
                            // If a month is selected
                            search === "" ? (
                              `No Attendance Found For the Selected Month ${new Date(
                                `${selectedMonth}-01`
                              ).toLocaleString("default", { month: "long", year: "numeric" })}`
                            ) : (
                              `No Attendance Found For the Search Term "${search}" in the Selected Month ${new Date(
                                `${selectedMonth}-01`
                              ).toLocaleString("default", { month: "long", year: "numeric" })}`
                            )
                          )}
                        </td>
                      </tr>

                    )}
                  </tbody>
                </table>
              </div>

                {/* Pagination Controls */}
                {filteredRecords.length > pageSize && (<div className="d-flex  justify-content-end">
                <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(1)} disabled={page <= 1}>
                  First
                </button>
                <button className='btn btn-sm' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                  Prev
                </button>
                <span className='mx-2'>
                  Page {page} of {totalPages}
                </span>
                <button className='btn btn-sm' onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                  Next
                </button>
                <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}>
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

export default ShowAttendance;
