import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ShowAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); //2024-12
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
    new Date(date).toLocaleTimeString("en-GB", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });

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
        formatDate(record?.attendanceDate).startsWith(selectedMonth)
      );
    }

    if (search) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(
        (record) =>
          record?.employee?.employeeName.toLowerCase().includes(searchLower) ||
          record?.employee?.employeeEmail.toLowerCase().includes(searchLower) ||
          record?.employee?.employeeId.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRecords(filtered);

    // Determine if a unique user is selected
    if (
      filtered.length > 0 &&
      filtered.every(
        (record) =>
          record?.employee?.employeeId === filtered[0]?.employee?.employeeId &&
          formatDate(record?.attendanceDate).startsWith(
            formatDate(filtered[0]?.attendanceDate).slice(0, 7) // Compare by "YYYY-MM"
          )
      )
    ) {
      setId(filtered[0]?.employee?._id);
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
      <div className="row mt-1">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row d-flex justify-content-between align-items-center mx-3 mt-2">
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
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Report Details */}
      {attendanceReport && (
        <div className="row ">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
              <div className="d-flex justify-content-end">
                <button 
              className="btn btn-sm btn-danger"
              onClick={() => setAttendanceReport(null)}
              title="Close report"
            >
              <i className="fa fa-times"></i>
            </button>
                </div>
                <div className="table-responsive">
                  <h4>
                    Attendance Summary for{" "}
                    {attendanceReport?.reportMonth || "N/A"}
                  </h4>
                  <table className="table header-border  ">
                    <thead>
                      <tr>
                        <th>Total Days In Month</th>
                        <th>Total Weekends in Month</th>
                        <th>Working Days (Excluding Sundays)</th>
                        <th>Days On Time</th>
                        <th>Days Late</th>
                        <th>On Holiday</th>
                        <th>On Leave</th>
                        <th>Absent Days (Excluding Sundays)</th>
                        <th>Effective Absents (Conversion from lates)</th>
                        <th>
                          Effective Lates left (after conversion to absent)
                        </th>
                        <th>Total Absents</th>
                        <th>Total Logged Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{attendanceReport.totalDays || 0}</td>
                        <td>{attendanceReport.totalWeekends || 0}</td>
                        <td>{attendanceReport.workingDays || 0}</td>
                        <td>{attendanceReport.daysOnTime || 0}</td>
                        <td>{attendanceReport.daysLate || 0}</td>
                        <td>{attendanceReport.Holiday || 0}</td>
                        <td>{attendanceReport.OnLeave || 0}</td>
                        <td>{attendanceReport.absentDays || 0}</td>
                        <td>{attendanceReport.effectiveAbsentDays || 0}</td>
                        <td>{attendanceReport.remainingLates || 0}</td>
                        <td>{attendanceReport.totalAbsentDays || 0}</td>
                        <td>{attendanceReport.totalAttendanceRecordDays || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Records */}
      <div className="row ">
        <div className="col-lg-12 mb-5">
          <div className="card">
            <div className="card-body">
              <h4>Attendance Records</h4>
              {/* Pagination Controls */}
              {filteredRecords.length > pageSize && (
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
                        const timeIn = record?.timeIn
                          ? new Date(record.timeIn)
                          : null;
                        const timeOut = record?.timeOut
                          ? new Date(record.timeOut)
                          : null;

                        return (
                          <tr key={index}>
                            <td>{startIndex + index + 1}</td>{" "}
                            {/* Correct index calculation */}
                            <td>{record?.employee?.employeeId || "N/A"}</td>
                            <td>{record?.employee?.employeeName || "N/A"}</td>
                            <td>{record?.employee?.employeeEmail || "N/A"}</td>
                            <td>
                              {record?.attendanceDate
                                ? new Date(
                                    record?.attendanceDate
                                  ).toLocaleDateString("en-GB")
                                : "-"}
                            </td>
                            <td>{timeIn ? formatTime(timeIn) : "-"}</td>
                            <td>{timeOut ? formatTime(timeOut) : "-"}</td>
                            <td>
                              {" "}
                              <i
                                className={`fa fa-circle-o text-${
                                  record?.status === "Late"
                                    ? "warning"
                                    : "success"
                                }  mr-2`}
                              ></i>
                              {record?.status || "N/A"}
                            </td>
                            <td>{record?.lateBy || 0}</td>
                            <td>{record?.totalHours.toFixed(2) || 0}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          {selectedMonth === ""
                            ? // If no month is selected
                              search === ""
                              ? `No Attendance Found. Please select a Month and/or search for a user.`
                              : `No Attendance Found For the Search Term "${search}". Please select a Month.`
                            : // If a month is selected
                            search === ""
                            ? `No Attendance Found For the Selected Month ${new Date(
                                `${selectedMonth}-01`
                              ).toLocaleString("default", {
                                month: "long",
                                year: "numeric",
                              })}`
                            : `No Attendance Found For the Search Term "${search}" in the Selected Month ${new Date(
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
              {filteredRecords.length > pageSize && (
                <div className="d-flex  justify-content-end">
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
      </div>
      <center style={{ visibility: "hidden", height: "255px" }}>
        <div className="row"></div>
      </center>
    </div>
  );
};

export default ShowAttendance;
