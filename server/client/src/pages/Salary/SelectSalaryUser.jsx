import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const SalaryUser = () => {
  const [employeeData, setEmployeeData] = useState([]); // Raw employee data
  const [search, setSearch] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]); // Filtered employees
  const [RoleFilter, setRoleFilter] = useState(""); // State to store selected role filter
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" }); // State for salary range filter
  // const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDates, setSelectedDates] = useState({}); // Individual dates

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
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/employee");
        setEmployeeData(res.data);
        setFilteredData(res.data); // Initialize filtered data with all employees
      } catch (error) {
        console.log("Error Fetching Employees Data", error);
      }
    };
    fetchEmployees();
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
    // Filter employees whenever search, RoleFilter, or salaryRange changes
    const filteredEmployees = employeeData.filter((employee) => {
      // Check if the employee matches the search term
      const matchesSearch =
        employee.employeeName
          .toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        employee.employeeEmail
          .toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        employee.employeeId.toLowerCase().includes(search.toLowerCase().trim());

      // Check if the employee matches the role filter (handles role being an array)
      const matchesRole = RoleFilter
        ? employee.employeeRoles?.some((role) =>
            role.roleName.toLowerCase().includes(RoleFilter.toLowerCase())
          )
        : true;

      // Check if the employee matches the salary range
      const matchesSalary =
        (!salaryRange.min ||
          employee.employeeSalary >= parseFloat(salaryRange.min)) &&
        (!salaryRange.max ||
          employee.employeeSalary <= parseFloat(salaryRange.max));

      return matchesSearch && matchesRole && matchesSalary;
    });

    setFilteredData(filteredEmployees); // Set filtered data
  }, [search, RoleFilter, salaryRange, employeeData]); // Run the effect when search, RoleFilter, salaryRange, or employeeData changes

  // Extract all roles from employee data for dropdown
  const allRoles = [
    ...new Set(
      employeeData
        .map((employee) => employee.employeeRoles?.map((role) => role.roleName)) // Extract role names from employeeRole array
        .flat()
    ),
  ];

  const handleDateChange = (id, value) => {
    setSelectedDates((prev) => ({
      ...prev,
      [id]: value,
    }));
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

                  <div className="col-lg-3 col-md-5 col-sm-5 my-2">
                    <select
                      id="inputState"
                      className="form-control"
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option disabled selected>
                        Search By Role
                      </option>
                      <option value={""}>All</option>
                      {allRoles.length > 0 ? (
                        allRoles.map((role, index) => (
                          <option value={role || ""} key={index}>
                            {role || "N/A"}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Roles Available</option>
                      )}
                    </select>
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

        {/* Employee Table */}
        <div className="row mt-2">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Employees List</h4>
                {/* Pagination Controls */}
                {filteredData.length > pageSize && (
                  <div className="mt-5 mb-2 d-flex  justify-content-end ">
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

                <div className="table-responsive table-hover">
                  <table className="table header-border">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Employee Id</th>
                        <th>Employee Name</th>
                        <th>Employee Email</th>
                        <th>Employee Role</th>
                        <th>Employee Salary</th>
                        <th>Employee Allownces</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length > 0 ? (
                        currentData.map((employee, index) => (
                          <tr key={index}>
                            <td>{startIndex + index + 1}</td>{" "}
                            {/* Correct index calculation */}
                            <td>{employee.employeeId || "N/A"}</td>
                            <td>{employee.employeeName || "N/A"}</td>
                            <td>{employee.employeeEmail || "N/A"}</td>
                            <td>
                              {employee.employeeRoles
                                ?.map((role) => role.roleName)
                                .join(", ") || "N/A"}
                            </td>
                            <td>{employee.employeeSalary || "N/A"}</td>
                            <td>
                              {employee.employeeallowances
                                ?.map(
                                  (allowance) =>
                                    `${allowance.name}: ${allowance.amount}`
                                )
                                .join(", ") || "No Allowances"}
                            </td>
                            <td className="">
                              <span>
                                <div className="my-2">
                                  <label>Select Month</label>
                                  {/* <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="form-control"
                      /> */}
                                  <input
                                    type="month"
                                    value={selectedDates[employee._id] || ""}
                                    onChange={(e) =>
                                      handleDateChange(
                                        employee._id,
                                        e.target.value
                                      )
                                    }
                                    className="form-control"
                                  />
                                </div>
                                <Link
                                  className=" btn btn-primary my-2"
                                  style={{ width: "100%" }}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Edit"
                                  to={`/addSalary/${
                                    selectedDates[employee._id] || ""
                                  }/${employee._id}`}
                                >
                                  <i className="fa fa-pencil color-muted mx-2"></i>{" "}
                                  Pay Salary
                                </Link>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No employees found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                {filteredData.length > pageSize && (
                  <div className="mt-5 mb-2 d-flex  justify-content-end">
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

export default SalaryUser;
