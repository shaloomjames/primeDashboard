import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ShowEmployee = () => {
  const [employeeData, setEmployeeData] = useState([]); // Raw employee data
  const [search, setSearch] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]); // Filtered employees
  const [RoleFilter, setRoleFilter] = useState(""); // State to store selected role filter
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" }); // State for salary range filter

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

  useEffect(() => {
    // Filter employees whenever search, RoleFilter, or salaryRange changes
    const filteredEmployees = employeeData.filter((employee) => {
      // Check if the employee matches the search term
      const matchesSearch =
        employee.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        employee.employeeEmail.toLowerCase().includes(search.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(search.toLowerCase());

      // Check if the employee matches the role filter (handles role being an array)
      const matchesRole = RoleFilter
        ? employee.employeeRoles?.some((role) =>
            role.roleName.toLowerCase().includes(RoleFilter.toLowerCase())
          )
        : true;

      // Check if the employee matches the salary range
      const matchesSalary =
        (!salaryRange.min || employee.employeeSalary >= parseFloat(salaryRange.min)) &&
        (!salaryRange.max || employee.employeeSalary <= parseFloat(salaryRange.max));

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

  const deleteEmployee = async (employeeid) => {
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
          const response = await axios.delete(`/api/employee/${employeeid}`);
          setEmployeeData(employeeData.filter((employee) => employee._id !== employeeid));
          setFilteredData(filteredData.filter((employee) => employee._id !== employeeid));
          Swal.fire("Deleted!", response.data.msg, "success");
        } catch (error) {
          Swal.fire(
            "Error",
            error?.response?.data?.err || "An unexpected error occurred. Please try again.",
            "error"
          );
          console.error("Error deleting employee:", error);
        }
      }
    });
  };

  return (
    <>
      <div className="container-fluid mb-5">
        <div className="row" style={{display:"flex",justifyContent:"flex-end" ,marginRight:"3%"}}>
        <Link type="button" className="btn mb-1 btn-primary" to="/addemployee" >
          Add Employee
          <span className="btn-icon-right">
            <i className="fa-solid fa-user-plus"></i>
          </span>
        </Link>
        </div>

        {/* Search and Filters */}
        <div className="row mt-3">
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
            <input  min={1} className="form-control"
              type="number"

              placeholder="Min Salary"
              value={salaryRange.min}
              onChange={(e) =>
                setSalaryRange((prev) => ({ ...prev, min: e.target.value }))
              }
            />
            <span className="mx-2">to</span>
            <input min={1} className="form-control"
              type="number"
              
              placeholder="Max Salary"
              value={salaryRange.max}
              onChange={(e) =>
                setSalaryRange((prev) => ({ ...prev, max: e.target.value }))
              }
            />
             <button className="btn btn-secondary mx-3"
      onClick={() => setSalaryRange({ min: "", max: "" })} // Reset salary range
    >
      Clear Filter
    </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="row mt-5">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Employee</h4>
                <div className="table-responsive">
                  <table className="table header-border">
                    <thead>
                      <tr>
                        <th>Employee Id</th>
                        <th>Employee Name</th>
                        <th>Employee Email</th>
                        <th>Employee Role</th>
                        <th>Employee Salary</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((employee, index) => (
                          <tr key={index}>
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
                              <span>
                                <Link
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Edit"
                                  to={`/updateemployee/${employee._id}`}
                                >
                                  <button className="btn btn-primary btn-sm">
                                    <i className="fa fa-pencil color-muted mx-2"></i> Edit
                                  </button>
                                </Link>
                                <button
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Delete"
                                  className="btn btn-danger btn-sm mx-1 my-2"
                                  onClick={() => deleteEmployee(employee._id)}
                                >
                                  <i className="fa fa-trash"></i> Delete
                                </button>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowEmployee;
