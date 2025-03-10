import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ShowLeaveType = () => {
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const [search, setSearch] = useState("");
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
        const res = await axios.get("/api/leaveType");
        console.log(res.data);
        setLeaveTypeData(res.data);
        setFilteredData(res.data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };
    fetchLeaves();
  }, []);

  // Filter and sort data
  // useEffect(() => {
  //   let filtered = leaveTypeData.filter(leave => {
  //     const matchesSearch = leave.employee?.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
  //                           leave.employee?.employeeId?.toLowerCase().includes(search.toLowerCase());

  //     const matchesStatus = statusFilter === "all" || leave.status === statusFilter;

  //     return matchesSearch && matchesStatus;
  //   });

  //   // Sorting
  //   if (sortConfig.key) {
  //     filtered = filtered.sort((a, b) => {
  //       if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
  //       if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
  //       return 0;
  //     });
  //   }

  //   setFilteredData(filtered);
  //   setTotalPages(Math.ceil(filtered.length / pageSize));
  // }, [search, statusFilter, sortConfig, leaveTypeData, pageSize]);

  const statusOptions = ["all", "active", "inactive"];
  const statusColors = {
    active: "success",
    inactive: "danger",
  };
  // Updated filter logic
  useEffect(() => {
    let filtered = leaveTypeData.filter((leave) => {
      const matchesSearch = leave.leaveTypeName
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || leave.leaveTypeStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sorting remains the same
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
  }, [search, statusFilter, sortConfig, leaveTypeData, pageSize]);

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

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`/api/leave/${id}`, { status: newStatus });
      setLeaveTypeData((prev) =>
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

  const deleteleavetype = async (leaveTypeid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/api/leaveType/${leaveTypeid}`);
          setLeaveTypeData(
            leaveTypeData.filter((leaveType) => leaveType._id !== leaveTypeid)
          );
          setFilteredData(
            filteredData.filter((leaveType) => leaveType._id !== leaveTypeid)
          );
          Swal.fire("Deleted!", response.data.msg, "success");
        } catch (error) {
          Swal.fire(
            "Error",
            error?.response?.data?.err ||
              "An unexpected error occurred. Please try again.",
            "error"
          );
          console.error("Error deleting employee:", error);
        }
      }
    });
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
              <h4 className="card-title">Show Leave Type</h4>
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
                  {/* <thead>
                    <tr>
                      <th>#</th>
                      <th onClick={() => handleSort('leaveTypeName')} style={{ cursor: 'pointer' }}>
                      Leave Type Name {sortConfig.key === 'leaveTypeName' && (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        )}
                      </th>
                      <th>Leave Type Number</th>
                      <th>Leave Type Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((leavetype, index) => (
                      <tr key={leavetype._id}>
                        <td>{startIndex + index + 1}</td>
                        <td>
                          {leavetype?.leaveTypeName || "N/A"}
                        </td>
                        <td>{leavetype?.allowedLeaves}</td>
                        <td>
                        <i className={`fa fa-circle-o text-${statusColors[leavetype?.leaveTypeStatus]}  mr-2`}></i>
                          <span >
                            {leavetype?.leaveTypeStatus || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody> */}
                  <thead>
                    <tr>
                      <th>#</th>
                      <th
                        onClick={() => handleSort("leaveTypeName")}
                        style={{ cursor: "pointer" }}
                      >
                        Leave Type Name{" "}
                        {sortConfig.key === "leaveTypeName" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("allowedLeaves")}
                        style={{ cursor: "pointer" }}
                      >
                        Allowed Leaves{" "}
                        {sortConfig.key === "allowedLeaves" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  {/* // Updated table body */}
                  <tbody>
                    {
                      currentData.length > 0 ?
                    currentData.map((leavetype, index) => (
                      <tr key={leavetype._id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{leavetype.leaveTypeName}</td>
                        <td>{leavetype.allowedLeaves}</td>
                        <td>
                          <i
                            className={`fa fa-circle-o text-${
                              statusColors[leavetype.leaveTypeStatus]
                            } mr-2`}
                          ></i>
                          {leavetype.leaveTypeStatus}
                        </td>
                        <td>
                          <span>
                            <Link
                              data-toggle="tooltip"
                              data-placement="top"
                              title="Edit"
                              to={`/update-leavetype/${leavetype._id}`}
                            >
                              <button className="btn btn-primary btn-sm">
                                <i className="fa fa-pencil color-muted mx-2"></i>{" "}
                                Edit
                              </button>
                            </Link>
                            <button
                              data-toggle="tooltip"
                              data-placement="top"
                              title="Delete"
                              className="btn btn-danger btn-sm mx-1 my-2"
                              onClick={() => deleteleavetype(leavetype._id)}
                            >
                              <i className="fa fa-trash"></i> Delete
                            </button>
                          </span>
                        </td>
                      </tr>
                    )):(
                      <tr>
                      <td colSpan="9" className="text-center">
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

export default ShowLeaveType;
