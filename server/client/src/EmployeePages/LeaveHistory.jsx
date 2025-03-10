import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import "./employee.css";
import { useNavigate } from "react-router-dom";

const LeaveHistory = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date();
    return currentDate.toISOString().slice(0, 7); // Format as YYYY-MM
  });
  const [Id, setId] = useState("");
  const [attendanceReport, setAttendanceReport] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // Secure page
  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");

    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken); // Decode the JWT token
        const userRole = decodedToken.userrole; // Get the user role(s)
        setId(decodedToken.userid);
        // Redirect to login if the user is not an Employee
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
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Helper function to format dates
  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "N/A" : parsedDate.toISOString().split("T")[0];
  };

  // Fetch leave records for the employee
  useEffect(() => {
    if (Id) {
      const fetchAttendanceData = async () => {
        try {
          const response = await axios.get(`/api/leave`);
          setLeaveData(response.data);
          setLeaveRecords(response.data);
        } catch (error) {
          console.error("Error fetching attendance data:", error);
        }
      };
      fetchAttendanceData();
    }
  }, [Id]);

  // Filter leave records based on the selected month
  useEffect(() => {
    const filteredRecords = leaveData.filter((record) =>
      formatDate(record.createdAt).startsWith(selectedMonth)
    );
    setLeaveRecords(filteredRecords);
    // Reset page to 1 if the filtered records count is less than the current page
    setPage(1);
  }, [leaveData, selectedMonth]);

  // Handle pagination logic on changes
  useEffect(() => {
    const newTotal = Math.ceil(leaveRecords.length / pageSize);
    setTotalPages(newTotal);
    if (page > newTotal) {
      setPage(newTotal);
    }
  }, [leaveRecords, pageSize, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Reset attendance report when the selected month changes
  useEffect(() => {
    setAttendanceReport(null);
  }, [selectedMonth]);

  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = leaveRecords.slice(startIndex, endIndex);

  const statusOptions = ["all", "Pending", "Approved", "Rejected"];
  const statusColors = {
    Pending: "warning",
    Approved: "success",
    Rejected: "danger",
  };

  return (
    <>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Report Details */}
        <div className="row mb-5">
          <div className="col-lg-12">
            <div className="card p-4 mb-5">
              {/* Leave Records Display */}
              <div className="mt-4">
                <h3>Leave Records</h3>
                {/* Pagination Controls */}
                {leaveRecords.length > pageSize && (
                  <div className="mt-5 mb-2 d-flex justify-content-end">
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
                 <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      {/* <th>Leave Created At</th>
                      <th>Employee Name</th>
                      <th>Leave Type</th>
                      <th>Leave Start Date</th>
                      <th>Leave End Date</th>
                      <th>Leave Status</th>

                      <th>Leave calculatedDays</th>
                      
                      <th>Admin Feedback</th>
                      <th>Leave Effected Attendance</th>
                      
                      <th>Leave Reason</th>
                      <th>Leave Approved By</th>
                      
                      <th>Skipped Dates</th> {/* Skipped Dates 
                      <th>weekends during Leave</th>
                      <th>holidays during Leave</th>
                      */}
                      
                      <th>#</th> {/* Leave ID or Serial Number */}
                      <th>Leave Created At</th>
                      <th>
                        Employee Name
                      </th>
                      <th>Leave Type</th> {/* Leave Type */}
                      <th>Leave Start Date</th> {/* Leave Start Date */}
                      <th>Leave End Date</th> {/* Leave End Date */}

                      <th>Total Days of Leave</th> {/* Total Days */}
                      <th>Leave Days (Excluding Holidays & Weekends)</th>
                      <th>Leave Reason</th> {/* Reason */}
                      <th>Leave Status</th> {/* Status */}
                      <th>Leave Approved By</th> {/* Approved By */}
                      <th>Skipped Overlaped Dates</th> {/* Skipped Dates */}
                      <th>Weekends During Leave</th> {/* Weekends */}
                      <th>Holidays During Leave</th> {/* Holidays */}
                      {/* <th>Actions</th> Actions like Approve/Reject */}

                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((record, index) => (
                        <tr key={index}>
                          <td>{startIndex + index + 1}</td>{" "}
                          <td>
                            {record?.createdAt
                              ? new Date(record.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>

                          <td>{record?.employee?.employeeName || "N/A"}</td>
                          <td>{record?.leaveType?.leaveTypeName || "N/A"}</td>
                          <td>
                            {record?.startDate
                              ? new Date(record.startDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            {record?.endDate
                              ? new Date(record.endDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>{record?.totalDaysOfLeavePeriod || "N/A"}</td>{" "}
                          <td>{record?.calculatedDays || "N/A"}</td>{" "}
                          <td>{record?.reason || "N/A"}</td>
                          <td>
                          <i
                            className={`fa fa-circle-o text-${
                              statusColors[record?.status]
                            } mr-2`}
                          ></i>
                          <span>{record?.status || "N/A"}</span>
                        </td>{" "}
                          <td>
                          {record.status === "Pending" ? (
                            <span className="text-muted">Pending Approval</span>
                          ) : (
                            record?.approvedBy?.employeeName || "System/Admin"
                          )}
                        </td>{" "}
                          {/* <td>{record?.status || "N/A"}</td> */}
                          {/* <td>{record?.calculatedDays || "N/A"}</td> */}
                          <td>
                          {record?.skippedDates && record?.skippedDates.length > 0
                            ? record?.skippedDates.map((skippedDate, index) => {
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

                          {/* <td>
                            
                          {" "}
                          {record?.weekends && record?.weekends.length > 0
                            ? record?.weekends.map((weekendDate, index) => {
                                // Get the name of the day of the week (e.g., "Monday")
                                const dayOfWeek = new Date(
                                  weekendDate
                                ).toLocaleString("default", {
                                  weekday: "long",
                                });

                                return (
                                  <div key={index}>
                                    {dayOfWeek} :{" "}
                                    {new Date(weekendDate).toLocaleDateString()}
                                  </div>
                                );
                              })
                            : "No weekends during leave"}
                        </td>
                          <td>
                            {record?.holidays && record?.holidays.length > 0
                              ? record?.holidays.map((holiday) => (
                                  <div>
                                    {holiday.name} :{" "}
                                    {new Date(
                                      holiday.date
                                    ).toLocaleDateString()}
                                  </div>
                                ))
                              : "No Holiday During leave"}
                          </td> */}
                                                  <td>
                          {record?.weekends && record?.weekends.length > 0
                            ? record?.weekends.map((weekendDate, index) => {
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
                          {record?.holidays && record?.holidays.length > 0
                            ? record?.holidays.map((holiday) => (
                                <div key={holiday._id}>
                                  {holiday.name}:{" "}
                                  {new Date(holiday.date).toLocaleDateString()}
                                </div>
                              ))
                            : "No holidays during leave"}
                        </td>{" "}

                          {/* <td>{record?.adminReason || "N/A"}</td> */}
                          {/* <td>{record?.affectedAttendance?.length || "N/A"}</td>                      */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No attendance records found for{" "}
                          {new Date(`${selectedMonth}-01`).toLocaleString(
                            "default",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )}
                          .
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              </div>
              {/* Pagination Controls */}
              {leaveRecords.length > pageSize && (
                <div className="d-flex justify-content-end">
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
            </div>
          </div>
        </div>
        <center className="card py-5" style={{ visibility: "hidden" }}>
          <div className="row"></div>
        </center>
      </div>
    </>
  );
};

export default LeaveHistory;
