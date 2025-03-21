
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./employee.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LeaveHistory = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date();
    return currentDate.toISOString().slice(0, 7); // YYYY-MM
  });
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false); // Added for loading feedback

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
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

  // Secure page
  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");
    if (!userToken) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(userToken);
      const userRole = decodedToken.userrole;
      setEmployeeId(decodedToken.userid);
      console.log("EmployeeId from token ", decodedToken.userid);
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

  // Fetch leave records for the employee
  useEffect(() => {
    if (!employeeId) return;

    const fetchLeaveData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/leave/${employeeId}`
        );
        setLeaveData(response.data);
        setLeaveRecords(response.data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
        showErrorAlert(
          error.response?.data?.err || "Error Fetching Leave Records"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveData();
  }, [employeeId]); // Changed from [Id] to [employeeId]

  // Filter leave records based on the selected month
  useEffect(() => {
    const filteredRecords = leaveData.filter((record) =>
      new Date(record.createdAt).toISOString().slice(0, 7) === selectedMonth
    );
    setLeaveRecords(filteredRecords);
    setPage(1); // Reset to first page
  }, [leaveData, selectedMonth]);

  // Handle pagination logic
  useEffect(() => {
    const newTotal = Math.ceil(leaveRecords.length / pageSize) || 1; // Minimum 1 page
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

  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = leaveRecords.slice(startIndex, endIndex);

  const statusColors = {
    Pending: "warning",
    Approved: "success",
    Rejected: "danger",
  };

  return (
    <div className="container-fluid mt-3">
      {/* Month Picker */}
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

      {/* Leave Records */}
      <div className="row mb-5">
        <div className="col-lg-12">
          <div className="card p-4 mb-5">
            <div className="mt-4">
              <h3>Leave Records</h3>
              {loading && <p className="text-center">Loading...</p>}
              {!loading && (
                <>
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
                          <th>#</th>
                          <th>Leave Created At</th>
                          <th>Employee Name</th>
                          <th>Leave Type</th>
                          <th>Leave Start Date</th>
                          <th>Leave End Date</th>
                          <th>Total Days of Leave</th>
                          <th>Leave Days (Excl. Holidays & Weekends)</th>
                          <th>Leave Reason</th>
                          <th>Leave Status</th>
                          <th>Leave Approved By</th>
                          <th>Skipped Overlapped Dates</th>
                          <th>Weekends During Leave</th>
                          <th>Holidays During Leave</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.length > 0 ? (
                          currentData.map((record, index) => (
                            <tr key={record._id}>
                              <td>{startIndex + index + 1}</td>
                              <td>
                                {record?.createdAt
                                  ? new Date(
                                      record.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td>
                                {record?.employee?.employeeName || "N/A"}
                              </td>
                              <td>
                                {record?.leaveType?.leaveTypeName || "N/A"}
                              </td>
                              <td>
                                {record?.startDate
                                  ? new Date(
                                      record.startDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td>
                                {record?.endDate
                                  ? new Date(
                                      record.endDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td>
                                {record?.totalDaysOfLeavePeriod || "N/A"}
                              </td>
                              <td>{record?.calculatedDays || "N/A"}</td>
                              <td>{record?.reason || "N/A"}</td>
                              <td>
                                <i
                                  className={`fa fa-circle-o text-${
                                    statusColors[record?.status] || "secondary"
                                  } me-2`}
                                ></i>
                                <span>{record?.status || "N/A"}</span>
                              </td>
                              <td>
                                {record.status === "Pending" ? (
                                  <span className="text-muted">
                                    Pending Approval
                                  </span>
                                ) : (
                                  record?.approvedBy?.employeeName ||
                                  "System/Admin"
                                )}
                              </td>
                              <td>
                                {record?.skippedDates?.length > 0
                                  ? record.skippedDates.map(
                                      (skippedDate, idx) => (
                                        <div key={idx}>
                                          {new Date(
                                            skippedDate
                                          ).toLocaleDateString()}
                                        </div>
                                      )
                                    )
                                  : "No skipped dates"}
                              </td>
                              <td>
                                {record?.weekends?.length > 0
                                  ? record.weekends.map((weekendDate, idx) => (
                                      <div key={idx}>
                                        {new Date(
                                          weekendDate
                                        ).toLocaleDateString()}
                                      </div>
                                    ))
                                  : "No weekends"}
                              </td>
                              {/* <td>
                                {record?.holidays?.length > 0
                                  ? record.holidays.map((holiday, idx) => (
                                      <div key={idx}>
                                        {holiday.name}:
                                        {new Date(
                                          holiday.date
                                        ).toLocaleDateString()}
                                      </div>
                                    ))
                                  : "No holidays"}
                              </td> */}
                              <td>
                                {record?.holidays?.length > 0
                                  ? record.holidays.map((holiday, idx) => (
                                      <div key={idx}>
                                        {holiday.name}:{" "}
                                        {new Date(
                                          holiday.date
                                        ).toLocaleDateString()}
                                      </div>
                                    ))
                                  : "No holidays"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="14" className="text-center">
                              No leave records found for{" "}
                              {new Date(`${selectedMonth}-01`).toLocaleString(
                                "default",
                                { month: "long", year: "numeric" }
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination Controls */}
                  {leaveRecords.length > pageSize && (
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

export default LeaveHistory;