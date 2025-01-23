import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import "./employee.css";
import { useNavigate } from "react-router-dom";

const EmployeeShowAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7); // Format as YYYY-MM
    return currentMonth;
  });
  const [Id, setId] = useState("");
  const [attendanceReport, setAttendanceReport] = useState(null);


  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);



  const navigate = useNavigate();

// secure page
  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");

    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken); // Decode the JWT token
        const userRole = decodedToken.userrole;   // Get the user role(s)
        setId(decodedToken.userid)
        // Redirect to login if the user is not an Admin
        if (
          !(Array.isArray(userRole) && userRole.includes("Employee")) && // Array case
          userRole !== "Employee"                                       // String case
        ) {
          navigate("/login");
        }
      } catch (error) {
        // Handle token decoding failure
        console.error("Token decoding failed:", error);
        navigate("/login");
      }
    } else {
      // Redirect if no token is found
      navigate("/login");
    }
  }, [navigate]);


  // Helper function to format dates
  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  // Fetch attendance records for the employee
  useEffect(() => {
    if (Id) {
      const fetchAttendanceData = async () => {
        try {
          const response = await axios.get(`/api/attendance/${Id}`);
          setAttendanceData(response.data);
        } catch (error) {
          console.error("Error fetching attendance data:", error);
        }
      };
      fetchAttendanceData();
    }
  }, [Id]);

  // Handle pagination logic on changes
  useEffect(() => {
    setTotalPages(Math.ceil(attendanceRecords.length / pageSize));
  }, [attendanceRecords, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };



  // Filter attendance records based on the selected month
  useEffect(() => {
    const filteredRecords = attendanceData.filter((record) =>
      formatDate(record.attendanceDate).startsWith(selectedMonth)
    );
    setAttendanceRecords(filteredRecords);
  }, [attendanceData, selectedMonth]);

  // Fetch attendance report when clicked
  const fetchAttendanceReport = async () => {
    if (!Id || !selectedMonth) return;

    try {
      const response = await axios.get(`/api/attendance/report/${Id}/${selectedMonth}`);
      setAttendanceReport(response.data);
    } catch (error) {
      console.error("Error fetching attendance report:", error.message);
    }
  };

  // Reset attendance report when the selected month changes
  useEffect(() => {
    setAttendanceReport(null);
  }, [selectedMonth]);


  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = attendanceRecords.slice(startIndex, endIndex);


  return (
    <div className="container-fluid mt-3">
      {/* Month Picker & Generate Report Button */}
      <div className="row my-1">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row filters">
                <div className="col-lg-3">
                  <label>Select Month</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-lg-2 d-flex align-items-end">
                  <button
                    style={{
                      whiteSpace: "normal",
                      textAlign: "center",
                      wordWrap: "break-word",
                    }}
                    onClick={fetchAttendanceReport}
                    className="btn btn-primary mt-3 w-100"
                    disabled={attendanceRecords.length === 0}
                  >
                    Generate Report
                  </button>
                </div>
                {/* <div className="col-lg-2 col-md-4 text-end mt-4">
                <button className="btn btn-secondary" onClick={()=> window.print()}>
                  Print Attendance
                </button>
              </div> */}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Report Details */}
      {attendanceReport && (
        <div className="row my-1">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <h4>Attendance Summary for {attendanceReport?.reportMonth || 'N/A'}</h4>
                  <table className="table header-border  ">
                    <thead>
                      <tr>
                        <th>Total Days In Month</th>
                        <th>Total SunDays in Month</th>
                        <th>Working Days (Excluding Sundays)</th>
                        <th>Days On Time</th>
                        <th>Days Late</th>
                        <th>Absent Days (Excluding Sundays)</th>
                        <th>Effective Absents (Conversion from lates)</th>
                        <th>Effective Lates left (after conversion to absent)</th>
                        <th>Total Absents</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr >
                        <td>{attendanceReport.totalDays || 0}</td>
                        <td>{attendanceReport.totalSundays || 0}</td>
                        <td>{attendanceReport.workingDays || 0}</td>
                        <td>{attendanceReport.daysOnTime || 0}</td>
                        <td>{attendanceReport.daysLate || 0}</td>
                        <td>{attendanceReport.absentDays || 0}</td>
                        <td>{attendanceReport.effectiveAbsentDays || 0}</td>
                        <td>{attendanceReport.remainingLates || 0}</td>
                        <td>{attendanceReport.totalAbsentDays || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>)}

      <div className="row mb-5">
        <div className="col-lg-12">
          <div className="card p-4 mb-5">

            {/* Attendance Records Display */}
            <div className="mt-4">
              <h3>Attendance Records</h3>
              {/* Pagination Controls */}
              {attendanceRecords.length > pageSize && (<div className="mt-5 mb-2 d-flex  justify-content-end">
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
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Date</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Status</th>
                    <th>Late By (minutes)</th>
                    <th>Total Hours Worked</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{record.employee.employeeName || "N/A"}</td>
                        <td>{formatDate(record.attendanceDate)}</td>
                        <td>{record.timeIn ? new Date(record.timeIn).toLocaleTimeString() : "-"}</td>
                        <td>{record.timeOut ? new Date(record.timeOut).toLocaleTimeString() : "-"}</td>
                        <td><i className={`fa fa-circle-o text-${record?.status === "Late" ? "warning" : "success"}  mr-2`}></i>{record.status || "N/A"}</td>
                        <td>{record.lateBy || 0}</td>
                        <td>{record.totalHours.toFixed(2) || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                        <td><center> No attendance records found for the selected month {new Date(`${selectedMonth}-01`).toLocaleString("default", { month: "long", year: "numeric" })}.</center></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            {attendanceRecords.length > pageSize && (<div className='d-flex  justify-content-end'>
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
  );
};

export default EmployeeShowAttendance;
