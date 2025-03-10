// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// const MarkAttendanceMonth = () => {
//   const [employeeData, setEmployeeData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [Id, setId] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [RoleFilter, setRoleFilter] = useState("");
//   const [salaryRange, setSalaryRange] = useState({ min: "", max: "" });
//   const [selectedDates, setSelectedDates] = useState({}); // Individual months for each employee
  

//   // Pagination states
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);

//   const navigate = useNavigate();

//   // Admin authentication check
//   useEffect(() => {
//     const userToken = Cookies.get("UserAuthToken");
//     if (userToken) {
//       try {
//         const decodedToken = jwtDecode(userToken);
//         const userRole = decodedToken.userrole;
//         if (
//           !(Array.isArray(userRole) && userRole.includes("Admin")) &&
//           userRole !== "Admin"
//         ) {
//           navigate("/login");
//         }
//       } catch (error) {
//         console.error("Token decoding failed:", error);
//         navigate("/login");
//       }
//     } else {
//       navigate("/login");
//     }
//   }, [navigate]);

//   // Fetch employee data
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get("/api/employee");
//         setEmployeeData(res.data);
//         setFilteredData(res.data);
//       } catch (error) {
//         console.log("Error Fetching Employees Data", error);
//         Swal.fire("Error", "Failed to fetch employees", "error");
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // Update pagination
//   useEffect(() => {
//     setTotalPages(Math.ceil(filteredData.length / pageSize));
//   }, [filteredData, pageSize]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   // Filter employees based on search, role, and salary
//   useEffect(() => {
//     const filteredEmployees = employeeData.filter((employee) => {
//       const matchesSearch =
//         employee.employeeName
//           .toLowerCase()
//           .includes(search.toLowerCase().trim()) ||
//         employee.employeeEmail
//           .toLowerCase()
//           .includes(search.toLowerCase().trim()) ||
//         employee.employeeId.toLowerCase().includes(search.toLowerCase().trim());

//       const matchesRole = RoleFilter
//         ? employee.employeeRoles?.some((role) =>
//             role.roleName.toLowerCase().includes(RoleFilter.toLowerCase())
//           )
//         : true;

//       const matchesSalary =
//         (!salaryRange.min ||
//           employee.employeeSalary >= parseFloat(salaryRange.min)) &&
//         (!salaryRange.max ||
//           employee.employeeSalary <= parseFloat(salaryRange.max));

//       return matchesSearch && matchesRole && matchesSalary;
//     });

//     setFilteredData(filteredEmployees);
//   }, [search, RoleFilter, salaryRange, employeeData]);

//   // Extract unique roles for dropdown
//   const allRoles = [
//     ...new Set(
//       employeeData
//         .map((employee) => employee.employeeRoles?.map((role) => role.roleName))
//         .flat()
//     ),
//   ];

//   const handleDateChange = (id, value) => {
//     setSelectedDates((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };

//   // Handle marking attendance
//   const handleMarkAttendance = async (employeeId) => {
//     const month = selectedDates[employeeId];
//     if (!month) {
//       Swal.fire("Error", "Please select a month", "error");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `/api/attendance/${employeeId}/${month}`
//       );
//       Swal.fire("Success", response.data.msg, "success");
//     } catch (error) {
//       Swal.fire(
//         "Error",
//         error.response?.data?.err || "Failed to mark attendance",
//         "error"
//       );
//     }
//   };

  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/api/markAbsences/:id/:month");
//       Swal.fire("Success", response.data.msg, "success");
//     } catch (error) {
//       Swal.fire("Error", error.response.data.err, "error");
//     }
//   };

//   // Pagination slice
//   const startIndex = (page - 1) * pageSize;
//   const endIndex = page * pageSize;
//   const currentData = filteredData.slice(startIndex, endIndex);

//   return (
//     <div className="container-fluid mb-5">
//       {/* Search and Filters */}
//       <div className="row mt-1">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="card-body">
//               <div className="row mt-2">
//                 <div className="col-lg-4 col-md-5 col-sm-6 my-2">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Search by Name, Email, or ID"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />
//                 </div>

//                 <div className="col-lg-3 col-md-5 col-sm-5 my-2">
//                   <select
//                     id="inputState"
//                     className="form-control"
//                     onChange={(e) => setRoleFilter(e.target.value)}
//                   >
//                     <option disabled selected>
//                       Search By Role
//                     </option>
//                     <option value="">All</option>
//                     {allRoles.map((role, index) => (
//                       <option value={role || ""} key={index}>
//                         {role || "N/A"}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="col-lg-5 col-md-10 col-sm-11 d-flex align-items-center my-2">
//                   <input
//                     min={1}
//                     className="form-control"
//                     type="number"
//                     placeholder="Min Salary"
//                     value={salaryRange.min}
//                     onChange={(e) =>
//                       setSalaryRange((prev) => ({
//                         ...prev,
//                         min: e.target.value,
//                       }))
//                     }
//                   />
//                   <span className="mx-2">to</span>
//                   <input
//                     min={1}
//                     className="form-control"
//                     type="number"
//                     placeholder="Max Salary"
//                     value={salaryRange.max}
//                     onChange={(e) =>
//                       setSalaryRange((prev) => ({
//                         ...prev,
//                         max: e.target.value,
//                       }))
//                     }
//                   />
//                   <button
//                     className="btn btn-primary mx-3"
//                     onClick={() => setSalaryRange({ min: "", max: "" })}
//                   >
//                     Clear Filter
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Employee Table */}
//       <div className="row mt-2">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="card-body">
//               <h4 className="card-title">Mark Employee Attendance</h4>
//               {filteredData.length > pageSize && (
//                 <div className="mt-5 mb-2 d-flex justify-content-end">
//                   <button
//                     className="btn mx-2 btn-sm"
//                     onClick={() => handlePageChange(1)}
//                     disabled={page <= 1}
//                   >
//                     First
//                   </button>
//                   <button
//                     className="btn btn-sm"
//                     onClick={() => handlePageChange(page - 1)}
//                     disabled={page <= 1}
//                   >
//                     Prev
//                   </button>
//                   <span className="mx-2">
//                     Page {page} of {totalPages}
//                   </span>
//                   <button
//                     className="btn btn-sm"
//                     onClick={() => handlePageChange(page + 1)}
//                     disabled={page >= totalPages}
//                   >
//                     Next
//                   </button>
//                   <button
//                     className="btn mx-2 btn-sm"
//                     onClick={() => handlePageChange(totalPages)}
//                     disabled={page >= totalPages}
//                   >
//                     Last
//                   </button>
//                 </div>
//               )}

//               <div className="table-responsive table-hover">
//                 <table className="table header-border">
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>Employee Id</th>
//                       <th>Employee Name</th>
//                       <th>Employee Email</th>
//                       <th>Employee Role</th>
//                       <th>Employee Salary</th>
//                       <th>Employee Allowances</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentData.length > 0 ? (
//                       currentData.map((employee, index) => (
//                         <tr key={index}>
//                           <td>{startIndex + index + 1}</td>
//                           <td>{employee.employeeId || "N/A"}</td>
//                           <td>{employee.employeeName || "N/A"}</td>
//                           <td>{employee.employeeEmail || "N/A"}</td>
//                           <td>
//                             {employee.employeeRoles
//                               ?.map((role) => role.roleName)
//                               .join(", ") || "N/A"}
//                           </td>
//                           <td>{employee.employeeSalary || "N/A"}</td>
//                           <td>
//                             {employee.employeeallowances
//                               ?.map(
//                                 (allowance) =>
//                                   `${allowance.name}: ${allowance.amount}`
//                               )
//                               .join(", ") || "No Allowances"}
//                           </td>
//                           <td>
//                             <div className="my-2">
//                               <label>Select Month</label>
//                               <input
//                                 type="month"
//                                 value={selectedDates[employee._id] || ""}
//                                 onChange={(e) =>
//                                   handleDateChange(employee._id, e.target.value)
//                                 }
//                                 className="form-control"
//                               />
//                             </div>
//                             <button
//                               className="btn btn-primary my-2"
//                               style={{ width: "100%" }}
//                               type="submit"
//                               // onClick={() => {
//                               //   setId(employee)
//                               // }}
//                             >
//                               <i className="fa fa-calendar-check mx-2"></i>
//                               Mark Attendance
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="8" className="text-center">
//                           No employees found.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               {filteredData.length > pageSize && (
//                 <div className="mt-5 mb-2 d-flex justify-content-end">
//                   <button
//                     className="btn mx-2 btn-sm"
//                     onClick={() => handlePageChange(1)}
//                     disabled={page <= 1}
//                   >
//                     First
//                   </button>
//                   <button
//                     className="btn btn-sm"
//                     onClick={() => handlePageChange(page - 1)}
//                     disabled={page <= 1}
//                   >
//                     Prev
//                   </button>
//                   <span className="mx-2">
//                     Page {page} of {totalPages}
//                   </span>
//                   <button
//                     className="btn btn-sm"
//                     onClick={() => handlePageChange(page + 1)}
//                     disabled={page >= totalPages}
//                   >
//                     Next
//                   </button>
//                   <button
//                     className="btn mx-2 btn-sm"
//                     onClick={() => handlePageChange(totalPages)}
//                     disabled={page >= totalPages}
//                   >
//                     Last
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarkAttendanceMonth; 
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const MarkAttendanceMonth = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [RoleFilter, setRoleFilter] = useState("");
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" });
  const [selectedDates, setSelectedDates] = useState({});

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // Admin authentication check
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

  // Fetch employee data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/employee");
        setEmployeeData(res.data);
        setFilteredData(res.data);
      } catch (error) {
        console.log("Error Fetching Employees Data", error);
        Swal.fire("Error", "Failed to fetch employees", "error");
      }
    };
    fetchEmployees();
  }, []);

  // Update pagination
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / pageSize));
  }, [filteredData, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Filter employees
  useEffect(() => {
    const filteredEmployees = employeeData.filter((employee) => {
      const matchesSearch =
        employee.employeeName
          ?.toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        employee.employeeEmail
          ?.toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        employee.employeeId?.toLowerCase().includes(search.toLowerCase().trim());

      const matchesRole = RoleFilter
        ? employee.employeeRoles?.some((role) =>
            role.roleName.toLowerCase().includes(RoleFilter.toLowerCase())
          )
        : true;

      const matchesSalary =
        (!salaryRange.min ||
          (employee.employeeSalary >= parseFloat(salaryRange.min))) &&
        (!salaryRange.max ||
          (employee.employeeSalary <= parseFloat(salaryRange.max)));

      return matchesSearch && matchesRole && matchesSalary;
    });

    setFilteredData(filteredEmployees);
  }, [search, RoleFilter, salaryRange, employeeData]);

  // Extract unique roles for dropdown
  const allRoles = [
    ...new Set(
      employeeData
        .map((employee) => employee.employeeRoles?.map((role) => role.roleName))
        .flat()
        .filter(Boolean)
    ),
  ];

  const handleDateChange = (id, value) => {
    setSelectedDates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle marking absences
  const handleMarkAbsence = async (employeeId) => {
    const month = selectedDates[employeeId];
    if (!month) {
      Swal.fire("Error", "Please select a month", "error");
      return;
    }

    try {
      const response = await axios.post(`/api/markAbsences/${employeeId}/${month}`);
      Swal.fire("Success", response.data.msg, "success");
      // Clear the selected date after successful marking
      setSelectedDates((prev) => ({
        ...prev,
        [employeeId]: "",
      }));
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.err || "Failed to mark absences",
        "error"
      );
    }
  };

  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
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
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-lg-3 col-md-5 col-sm-5 my-2">
                  <select
                    className="form-control"
                    value={RoleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    {allRoles.map((role, index) => (
                      <option value={role} key={index}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

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
                    onClick={() => setSalaryRange({ min: "", max: "" })}
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
              <h4 className="card-title">Mark Employee Absences</h4>
              
              {filteredData.length > pageSize && (
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
                      <th>Employee Allowances</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((employee, index) => (
                        <tr key={employee._id || index}>
                          <td>{startIndex + index + 1}</td>
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
                          <td>
                            <div className="my-2">
                              <label>Select Month</label>
                              <input
                                type="month"
                                value={selectedDates[employee._id] || ""}
                                onChange={(e) =>
                                  handleDateChange(employee._id, e.target.value)
                                }
                                className="form-control"
                                max={new Date().toISOString().slice(0, 7)} // Prevent future months
                              />
                            </div>
                            <button
                              className="btn btn-primary my-2"
                              style={{ width: "100%" }}
                              onClick={() => handleMarkAbsence(employee._id)}
                            >
                              <i className="fa fa-calendar-times mx-2"></i>
                              Mark Absences
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
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
  );
};

export default MarkAttendanceMonth;