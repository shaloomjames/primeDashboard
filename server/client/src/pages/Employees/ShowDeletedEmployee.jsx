import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ShowDeletedEmployee = () => {
  const [deletedEmployeeData, setDeletedEmployeeData] = useState([]); // Raw deleted employee data
  const [search, setSearch] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]); // Filtered deleted employees
  const [RoleFilter, setRoleFilter] = useState(""); // State to store selected role filter
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" }); // State for salary range filter

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
        const userRole = decodedToken.userrole; // Get the user role(s)

        // Redirect to login if the user is not an Admin
        if (
          !(Array.isArray(userRole) && userRole.includes("Admin")) && // Array case
          userRole !== "Admin" // String case
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

  useEffect(() => {
    const fetchDeletedEmployees = async () => {
      try {
        const res = await axios.get("/api/employee/deletedemployee/d");
        setDeletedEmployeeData(res.data);
        setFilteredData(res.data); // Initialize filtered data with all deleted employees
      } catch (error) {
        console.log("Error Fetching Deleted Employees Data", error);
      }
    };
    fetchDeletedEmployees();
  }, []);

  // Handle pagination logic on changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / pageSize));
  }, [filteredData, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    // Filter deleted employees whenever search, RoleFilter, or salaryRange changes
    const filteredEmployees = deletedEmployeeData.filter((employee) => {
      // Check if the employee matches the search term
      const matchesSearch =
        employee?.employeeName
          .toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        employee?.employeeEmail
          .toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        employee?.employeeId
          .toLowerCase()
          .includes(search.toLowerCase().trim());

      // Check if the employee matches the role filter (handles role being an array)
      const matchesRole = RoleFilter
        ? employee.employeeRoles?.some((role) =>
            role?.roleName.toLowerCase().includes(RoleFilter.toLowerCase())
          )
        : true;

      // Check if the employee matches the salary range
      const matchesSalary =
        (!salaryRange?.min ||
          employee?.employeeSalary >= parseFloat(salaryRange?.min)) &&
        (!salaryRange?.max ||
          employee?.employeeSalary <= parseFloat(salaryRange?.max));

      return matchesSearch && matchesRole && matchesSalary;
    });

    setFilteredData(filteredEmployees); // Set filtered data
  }, [search, RoleFilter, salaryRange, deletedEmployeeData]); // Run the effect when search, RoleFilter, salaryRange, or deletedEmployeeData changes

  // Extract all roles from deleted employee data for dropdown
  const allRoles = [
    ...new Set(
      deletedEmployeeData
        .map((employee) =>
          employee?.employeeRoles?.map((role) => role.roleName)
        ) // Extract role names from employeeRole array
        .flat()
    ),
  ];

  const restoreEmployee = async (employeeid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to restore this employee!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, restore it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `/api/employee/deletedemployee/restoreemployee/${employeeid}`
          );
          setDeletedEmployeeData(
            deletedEmployeeData.filter(
              (employee) => employee._id !== employeeid
            )
          );
          setFilteredData(
            filteredData.filter((employee) => employee._id !== employeeid)
          );
          Swal.fire("Restored!", response.data.msg, "success");
        } catch (error) {
          Swal.fire(
            "Error",
            error?.response?.data?.err ||
              "An unexpected error occurred. Please try again.",
            "error"
          );
          console.error("Error restoring employee:", error);
        }
      }
    });
  };
  const deleteEmployeePermanently = async (employeeid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete this employee's record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `/api/employee/deletedemployee/delete/${employeeid}`
          );
          setDeletedEmployeeData(
            deletedEmployeeData.filter(
              (employee) => employee._id !== employeeid
            )
          );
          setFilteredData(
            filteredData.filter((employee) => employee._id !== employeeid)
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

  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <>
      <div className="container-fluid mb-5">
        {/* Search and Filters */}
        <div className="row mt-1">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="row mt-2">
                  <div className="col-lg-4 col-md-5 col-sm-6 my-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Name, Email, or ID"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)} // Update search query
                    />
                  </div>

                  {/* Salary Range Filter */}
                  <div className="col-lg-5 col-md-10 col-sm-11 d-flex align-items-center my-2">
                    <input
                      min={1}
                      className="form-control"
                      type="number"
                      placeholder="Min Salary"
                      value={salaryRange.min}
                      onChange={(e) =>
                        setSalaryRange((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                    />
                    <span className="mx-2">to</span>
                    <input
                      min={1}
                      className="form-control"
                      type="number"
                      placeholder="Max Salary"
                      value={salaryRange.max}
                      onChange={(e) =>
                        setSalaryRange((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="btn btn-primary mx-3"
                      onClick={() => setSalaryRange({ min: "", max: "" })} // Reset salary range
                    >
                      Clear Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deleted Employee Table */}
        <div className="row mt-2">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Deleted Employees</h4>
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
                  <table className="table header-border">
                    <thead>
                      <tr>
                        <th>Employee Id</th>
                        <th>Employee Name</th>
                        <th>Employee Email</th>
                        <th>Employee Role</th>
                        <th>Employee Salary</th>
                        <th>Employee Allowances</th>{" "}
                        {/* New column for allowances */}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((employee, index) => (
                          <tr key={index}>
                            <td>{employee?.employeeId || "N/A"}</td>
                            <td>{employee?.employeeName || "N/A"}</td>
                            <td>{employee?.employeeEmail || "N/A"}</td>
                            <td>
                              {employee.employeeRoles
                                ?.map((role) => role?.roleName || "N/A")
                                .join(", ") || "N/A"}
                            </td>
                            <td>{employee?.employeeSalary || "N/A"}</td>
                            <td>
                              {/* Show allowances if available */}
                              {employee?.employeeallowances &&
                              employee?.employeeallowances.length > 0
                                ? employee.employeeallowances
                                    .map(
                                      (allowance, idx) =>
                                        `${allowance?.name || "N/A"}: $${
                                          allowance?.amount || "N/A"
                                        }`
                                    )
                                    .join(", ")
                                : "No Allowances"}
                            </td>
                            <td
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>
                                <span>
                                  <button
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Restore"
                                    className="btn btn-success btn-sm mt-1 mx-1"
                                    onClick={() =>
                                      restoreEmployee(employee._id)
                                    }
                                  >
                                    <i className="fa fa-undo"></i>
                                  </button>
                                </span>
                                <span>
                                  <button
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="delete permanently"
                                    className="btn btn-danger btn-sm mt-1 mx-1"
                                    onClick={() =>
                                      deleteEmployeePermanently(employee._id)
                                    }
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </span>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No Deleted Employees
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                {filteredData.length > pageSize && (
                  <div className=" d-flex  justify-content-end">
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
        <center className=" card py-5" style={{ visibility: "hidden" }}>
          <div className="row"></div>
        </center>
      </div>
    </>
  );
};

export default ShowDeletedEmployee;
