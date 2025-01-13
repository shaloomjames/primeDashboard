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
      <div className="row mb-5">
        <div className="col-lg-12">
          <div className="card p-4 mb-5">
            {/* Month Picker & Generate Report Button */}
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
            {/* Attendance Report Details */}
            {attendanceReport && (
              <div className="mt-4">
                   <h4>Report for {attendanceReport.reportMonth}</h4>
                <p>
                  <strong>Total Days in Month:</strong> {attendanceReport.totalDays}
                </p>
                <p>
                  <strong>Total Sundays:</strong> {attendanceReport.totalSundays}
                </p>
                <p>
                  <strong>Working Days (Excluding Sundays):</strong> {attendanceReport.workingDays}
                </p>
                <p>
                  <strong>Days On Time:</strong> {attendanceReport.daysOnTime}
                </p>
                <p>
                  <strong>Days Late:</strong> {attendanceReport.daysLate}
                </p>
                <p>
                  <strong>Absent Days (Excluding Sundays):</strong> {attendanceReport.absentDays}
                </p>
                <p>
                  <strong>Effective Absents (Conversion from lates):</strong> {attendanceReport.effectiveAbsentDays || 0}
                </p>
                <p>
                  <strong>Effective Lates left (after conversion to absent):</strong> {attendanceReport.remainingLates || 0}
                </p>
                <p>
                  <strong>Total Absents:</strong> {attendanceReport.totalAbsentDays || 0}
                </p>
              </div>
            )}

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
                        <td>{record.status || "N/A"}</td>
                        <td>{record.lateBy || 0}</td>
                        <td>{record.totalHours.toFixed(2) || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <center className="my-5"><p>No attendance records found for the selected month {new Date(`${selectedMonth}-01`).toLocaleString("default", { month: "long", year: "numeric" })}.</p></center>
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
