import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const ShowSalary = () => {
  const [employeeData, setEmployeeData] = useState([]); // Raw employee data
  const [search, setSearch] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]); // Filtered employees
  const [RoleFilter, setRoleFilter] = useState(""); // State to store selected role filter
  const [salaryData, setsalaryData] = useState([]); // Raw salary data
  const [selectedMonth, setSelectedMonth] = useState(""); // State for the selected month
  const [Id, setId] = useState(null); // State for selected user ID

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

        // Redirect to login if the user is not an Admin
        if (
          !(Array.isArray(userRole) && userRole.includes("Admin")) && // Array case
          userRole !== "Admin"                                       // String case
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
    const fetchSalary = async () => {
      try {
        const res = await axios.get("/api/salary");
        setsalaryData(res.data);
      } catch (error) {
        console.log("Error Fetching Salary Data", error);
      }
    };
    fetchSalary();
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


  // // Initialize default month on load
  // useEffect(() => {
  //   const today = new Date();
  //   setSelectedMonth(today.toISOString().slice(0, 7)); // Format: YYYY-MM
  // }, []);

  // Update filtered records based on search input
  useEffect(() => {
    if (search === "") {
      // If search is empty, reset to show all records
      setFilteredData(salaryData);
      setId(null);
      return;
    }

    const filteredBySearch = salaryData.filter((record) => {
      const searchLower = search.toLowerCase();
      return (
        record?.employeeId.employeeName.toLowerCase().includes(searchLower) ||
        record?.employeeId.employeeEmail.toLowerCase().includes(searchLower) ||
        record?.employeeId.employeeId.toLowerCase().includes(searchLower)
      );
    });

    setFilteredData(filteredBySearch);

    // Update `Id` state if all filtered records belong to the same user
    if (
      filteredBySearch.length > 0 &&
      filteredBySearch.every(
        (record) =>
          record.employeeId.employeeId === filteredBySearch[0].employeeId.employeeId
      )
    ) {
      setId(filteredBySearch[0].employeeId._id);
    } else {
      setId(null); // Reset ID if no unique user is found
    }
  }, [search, salaryData]);

  // Filter salary records based on the selected month
  useEffect(() => {
    const filteredRecords = salaryData.filter((record) =>
      record.selectedMonth.startsWith(selectedMonth)
    );
    setFilteredData(filteredRecords);
  }, [salaryData, selectedMonth]);


  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);


  return (
    <div className="container-fluid">
      {/* Filter Section */}
      <div className="row d-flex justify-content-between align-items-center mx-3 my-5">
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
      </div>

      {/* Salary Table */}
      <div className="row mt-5">
        <div className="col-lg-12">
          <div className="card p-4">
            <div className="card-body">
              <h4 className="card-title">Salary</h4>
              {/* Pagination Controls */}
              {filteredData.length > pageSize && (<div className="mt-5 mb2">
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

              <div className="table-responsive">
                <table className="table header-border">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee ID</th>
                      <th>Employee Name</th>
                      <th>Employee Email</th>
                      <th>Salary Month</th>
                      <th>Month Total Days</th>
                      <th>Month Working Days</th>
                      <th>Days Late</th>
                      <th>Days OnTime</th>
                      <th>Absent Days</th>
                      <th>Effective Absent Days</th>
                      <th>Total Absent</th>
                      <th>Days Late Left</th>
                      <th>Basic Salary</th>
                      <th>Salary Per Day</th>
                      <th>Allowances</th>
                      <th>Total Allowance Amount</th>
                      <th>Salary Subtotal</th>
                      <th>Deductions</th>
                      <th>Total Deduction</th>
                      <th>Net Salary</th>
                      <th>Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((salary, index) => (
                        <tr key={index}>
                          <td>{startIndex + index + 1}</td> {/* Correct index calculation */}
                          <td>{salary.employeeId.employeeId}</td>
                          <td>{salary.employeeId.employeeName}</td>
                          <td>{salary.employeeId.employeeEmail}</td>
                          <td>
                            {new Date(salary.selectedMonth).toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: '2-digit',
                            })}
                          </td>
                          <td>{salary.monthtotalDays}</td>
                          <td>{salary.totalWorkingDays}</td>
                          <td>{salary.daysLate}</td>
                          <td>{salary.daysOnTime}</td>
                          <td>{salary.absentDays}</td>
                          <td>{salary.effectiveAbsentDays}</td>
                          <td>{salary.totalAbsentDays}</td>
                          <td>{salary.daysLateLeft}</td>
                          <td>{salary.basicSalary}</td>
                          <td>{Number(salary.salaryPerDay).toFixed(2)}</td>
                          <td>
                            {salary.allowances && salary.allowances.length > 0
                              ? salary.allowances.map((allowance, idx) => `${allowance.name}: ${allowance.amount}`)
                                .join(", ")
                              : "No Allowances"}
                          </td>
                          <td>{salary.totalAllowanceAmount}</td>
                          <td>{salary.salarySubtotal}</td>
                          <td>
                            {salary.deductions && salary.deductions.length > 0
                              ? salary.deductions.map((deduction, idx) => `${deduction.name}: ${Number(deduction.amount).toFixed(2)}`)
                                .join(", ")
                              : "No Allowances"}
                          </td>
                          <td>{Number(salary.totalDeduction).toFixed(2)}</td>
                          <td>{Number(salary.netSalary).toFixed(2)}</td>
                          <td>{salary.remarks}</td>
                          <td>
                            <span>
                              <Link data-toggle="tooltip" data-placement="top" title="Edit">
                                <i className="fa fa-pencil color-muted mx-2"></i>
                              </Link>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="19" className="text-center">
                          {selectedMonth === "" ? (
                            // If no month is selected
                            search === "" ? (
                              `No Salary Found. Please select a Month and/or search for a user.`
                            ) : (
                              `No Salary Found For the Search Term "${search}". Please select a Month.`
                            )
                          ) : (
                            // If a month is selected
                            search === "" ? (
                              `No Salary Found For the Selected Month ${new Date(`${selectedMonth}-01`).toLocaleString("default", { month: "long", year: "numeric" })}`
                            ) : (
                              `No Salary Found For the Search Term "${search}" in the Selected Month ${new Date(`${selectedMonth}-01`).toLocaleString("default", { month: "long", year: "numeric" })}`
                            )
                          )}
                        </td>
                      </tr>


                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              {filteredData.length > pageSize && (<div className="mt-3 mb2">
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
    </div>
  );
};

export default ShowSalary;
