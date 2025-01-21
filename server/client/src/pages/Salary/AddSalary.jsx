import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AddSalary = () => {
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [employeeId, setemployeeId] = useState('');
  const [employeeName, setemployeeName] = useState('');
  const [employeeEmail, setemployeeEmail] = useState('');
  const [employeeAllowances, setEmployeeAllowances] = useState([{ name: '', amount: 0 }]);
  const [totalAllowanceAmount, setTotalAllowanceAmount] = useState(0);
  const [monthtotalDays, setMonthtotalDays] = useState(0);
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [daysOnTime, setDaysOnTime] = useState(0);
  const [daysLate, setDaysLate] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [totalAbsentDays, setTotalAbsentDays] = useState(0);
  const [daysLateLeft, setDaysLateLeft] = useState(0);
  const [effectiveAbsentDays, setEffectiveAbsentDays] = useState(0);
  const [basicSalary, setBasicSalary] = useState(0);
  const [salaryPerDay, setSalaryPerDay] = useState(0);
  const [salarySubtotal, setSalarySubtotal] = useState(0);
  const [employeeDeductions, setEmployeeDeductions] = useState([{ name: 'Absents', amount: 0 }]);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [netSalary, setNetSalary] = useState(0);
  const [remarks, setRemarks] = useState('');

  const navigate = useNavigate();
  const { month, id } = useParams();


  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      timer: 3000, // 3 seconds
      timerProgressBar: true, // Show progress bar for timer
      showConfirmButton: false,
      willClose: () => {
        navigate('/SelectSalaryusers'); // Navigate after the alert closes
      },
    });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // secure page
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


  // Fetch attendance report on mount or month/id change
  useEffect(() => {
    const fetchAttendanceReport = async () => {
      try {
        if (!id) return;
        const response = await axios.get(`/api/attendance/report/${id}/${month}`);
        console.log(response.data)
        setAttendanceReport(response.data);
        setemployeeName(response.data?.employee?.employeeName)
        setemployeeEmail(response.data?.employee?.employeeEmail)
        setMonthtotalDays(response.data?.totalDays);
        setBasicSalary(response.data?.employee?.employeeSalary || 0);
        setemployeeId(response.data?.employee?.employeeId || 0);
        // Properly updating employeeAllowances with correct data format
        const allowancesFromBackend = response.data?.employee?.employeeallowances || [];
        const formattedAllowances = allowancesFromBackend.map(allowance => ({
          name: allowance.name || '',
          amount: allowance.amount || 0
        }));

        setEmployeeAllowances(formattedAllowances);
        setAbsentDays(response.data?.absentDays || 0);
        setDaysOnTime(response.data?.daysOnTime || 0);
        setDaysLate(response.data?.daysLate || 0);
        setTotalWorkingDays(response.data?.workingDays || 0);

        setEffectiveAbsentDays(response.data?.effectiveAbsentDays);
        setDaysLateLeft(response.data?.remainingLates);
        setTotalAbsentDays(response.data?.totalAbsentDays);

        setSalarySubtotal(response.data?.employee?.employeeSalary || 0);
        setNetSalary(response.data?.employee?.employeeSalary || 0);
      } catch (error) {
        showErrorAlert(error.response.data.err || 'Error fetching attendance report');
        setTimeout(() => {
          navigate("/SelectSalaryusers")
        }, 3000);
      }
    };
    fetchAttendanceReport();
  }, [month, id]);

  // Function to calculate salary per day
  useEffect(() => {
    const calculateSalaryPerDay = () => {
      if (totalWorkingDays > 0) {
        setSalaryPerDay(basicSalary / totalWorkingDays);
      } else {
        setSalaryPerDay(0);
      }
    };
    calculateSalaryPerDay();
  }, [basicSalary, totalWorkingDays]);


  // Calculate salary subtotal and net salary
  useEffect(() => {
    const subtotal = basicSalary + totalAllowanceAmount;
    setSalarySubtotal(subtotal);
  }, [basicSalary, totalAllowanceAmount]);

  // Calculate deductions and net salary
  useEffect(() => {

    // const deduction = TotalAbsentDays * salaryPerDay; // Calculate deduction for absent days
    const absentsDeduction = totalAbsentDays * salaryPerDay;

    const deductionsWithAbsents = [
      { name: "Absents", amount: absentsDeduction },
      ...employeeDeductions.filter((deduction) => deduction.name !== "Absents"),
    ];

    const totalDeductions = deductionsWithAbsents.reduce(
      (acc, deduction) =>
        acc + (deduction.amount ? parseFloat(deduction.amount) : 0),
      0
    );

    const netSalaryCalculation = salarySubtotal - totalDeductions; // Calculate net salary


    setEmployeeDeductions(deductionsWithAbsents); //
    setTotalDeduction(totalDeductions); // Update total deduction
    setNetSalary(netSalaryCalculation < 0 ? 0 : netSalaryCalculation); // Update net salary

    // setNetSalary(netSalaryCalculation); // Update net salary
  }, [totalAbsentDays, salaryPerDay, salarySubtotal, totalDeduction]);

  // Handle form submission to post salary data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      selectedMonth: month,
      employeeId,
      employeeName,
      employeeEmail,
      monthtotalDays,
      totalWorkingDays,
      daysOnTime,
      daysLate,
      daysLateLeft,
      absentDays,
      effectiveAbsentDays,
      totalAbsentDays,
      basicSalary,
      salaryPerDay,
      salarySubtotal,
      netSalary,
      allowances: employeeAllowances,
      totalAllowanceAmount,
      deductions: employeeDeductions,
      totalDeduction,
      remarks,

    };
    console.log(formData)
    try {
      const res = await axios.post('/api/salary', formData);
      showSuccessAlert(res.data.msg);
      setTimeout(() => {
        navigate('/showSalaries');
      }, 4000);
    } catch (error) {
      showErrorAlert(error.response?.data?.err || 'Failed to add salary');
    }
  };

  // Update total allowance amount when employeeAllowances changes
  useEffect(() => {
    const calculateTotalAllowance = () => {
      return employeeAllowances.reduce(
        (total, allowance) => total + parseFloat(allowance.amount || 0),
        0
      );
    };
    setTotalAllowanceAmount(calculateTotalAllowance());
  }, [employeeAllowances]);

  // Update total allowance amount when employeeAllowances changes
  useEffect(() => {
    const calculateTotalDeduction = () => {
      return employeeDeductions.reduce(
        (total, deduction) => total + parseFloat(deduction.amount || 0),
        0
      );
    };
    setTotalDeduction(calculateTotalDeduction());
  }, [employeeDeductions]);

  // Handle allowance input changes
  const handleAllowanceChange = (index, key, value) => {
    const updatedAllowances = [...employeeAllowances];
    updatedAllowances[index][key] = value;
    setEmployeeAllowances(updatedAllowances);
  };

  // Add a new allowance input field
  const addAllowanceField = () => {
    setEmployeeAllowances([...employeeAllowances, { name: '', amount: 0 }]);
  };

  // Remove allowance input field by index
  const removeAllowanceField = (index) => {
    const updatedAllowances = [...employeeAllowances];
    updatedAllowances.splice(index, 1);
    setEmployeeAllowances(updatedAllowances);
  };
  // -------------------------------------------------------------------
  // Handle allowance input changes
  const handleDeductionChange = (index, key, value) => {
    const updatedDeductions = [...employeeDeductions];
    updatedDeductions[index][key] = value;
    setEmployeeDeductions(updatedDeductions);
  };

  // Add a new allowance input field
  const addDeductionField = () => {
    setEmployeeDeductions([...employeeDeductions, { name: '', amount: 0 }]);
  };

  // Remove allowance input field by index
  const removeDeductionField = (index) => {
    const updatedDeductions = [...employeeDeductions];
    updatedDeductions.splice(index, 1);
    setEmployeeDeductions(updatedDeductions);
  };


  return (
    <>
      <div className="container-fluid">
        <Link className="btn mb-3 btn-primary" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left-long" style={{ fontSize: '20px', fontWeight: '900' }}></i>
        </Link>
        <form onSubmit={handleSubmit}>
          <div className="row mb-2">
            {/* <div className="col-lg-1"></div> */}
            <div class="col-lg-12 ">
              <div class="card">
                <div class="card-body">
                  {/* <center> */}
                  <h4 className="card-title mb-5">Add Salary</h4>
                  {/* </center> */}
                  <p><strong>Employee ID:</strong> {attendanceReport?.employee?.employeeId || 'N/A'}</p>
                  <p><strong>Employee Email:</strong> {attendanceReport?.employee?.employeeEmail || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>


          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <h4>Attendance Summary for {attendanceReport?.reportMonth || 'N/A'}</h4>
                    <table className="table header-border  ">
                      <thead>
                        <tr>
                          {/* <th>Employee ID</th>
                                        <th>Employee Email</th> */}
                          <th>Total Days In Month</th>
                          <th>Total SunDays in Month</th>
                          <th>Working Days (Excluding Sundays)</th>
                          <th>Days On Time</th>
                          <th>Days Late</th>
                          <th>Absent Days (Excluding Sundays)</th>
                          <th>Effective Absents (Conversion from lates)</th>
                          <th>Effective Lates left (after conversion to absent)</th>
                          <th>Total Absents</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr >
                          {/* <td>{attendanceReport?.employee?.employeeId || 'N/A'}</td> Correct index calculation */}
                          {/* <td>{attendanceReport?.employee?.employeeEmail || 'N/A'}</td> Correct index calculation */}
                          <td> {monthtotalDays || 0} </td> {/* Correct index calculation */}
                          <td> {attendanceReport?.totalSundays || 0} </td> {/* Correct index calculation */}
                          <td> {totalWorkingDays || 0} </td> {/* Correct index calculation */}
                          <td> {daysOnTime || 0} </td> {/* Correct index calculation */}
                          <td> {daysLate || 0} </td> {/* Correct index calculation */}
                          <td> {absentDays || 0} </td> {/* Correct index calculation */}
                          <td> {effectiveAbsentDays || 0} </td> {/* Correct index calculation */}
                          <td> {daysLateLeft || 0} </td> {/* Correct index calculation */}
                          <td> {totalAbsentDays || 0} </td> {/* Correct index calculation */}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row mb-2">
            <div class="col-lg-6 mb-1"  >
              <div class="card" style={{ minHeight: "40vh" }}>
                <div class="card-body">
                  <div className="form-group">
                    <label>Employee Allowances:</label>
                    {employeeAllowances.length > 0 ? (
                      employeeAllowances.map((allowance, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                          <input
                            type="text"
                            placeholder="Allowance Name"
                            className="form-control mr-2"
                            value={allowance.name}
                            onChange={(e) => handleAllowanceChange(index, 'name', e.target.value)}
                          />
                          <input
                            type="number"
                            placeholder="Allowance Amount"
                            className="form-control mr-2"
                            min={0}
                            value={(Number(allowance.amount) || 0).toFixed()}
                            onChange={(e) => handleAllowanceChange(index, 'amount', e.target.value)}
                          />
                          {employeeAllowances.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger ml-2"
                              onClick={() => removeAllowanceField(index)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))) : (
                      <h4>No Allowances</h4>
                    )

                    }
                    <button type="button" className="btn btn-primary" onClick={addAllowanceField}>
                      Add Another Allowance
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mb-1" >
              <div class="card" style={{ minHeight: "40vh" }}>
                <div class="card-body">
                  <div className="form-group">
                    <label>Employee Deduction:</label>
                    {
                      employeeDeductions.length > 0 ? (
                        employeeDeductions.map((deduction, index) => (
                          <div key={index} className="d-flex align-items-center mb-2">
                            <input
                              type="text"
                              placeholder="Deduction Name"
                              className="form-control mr-2"
                              value={deduction.name}
                              onChange={(e) => handleDeductionChange(index, 'name', e.target.value)}
                            />
                            <input
                              type="number"
                              placeholder="Deduction Amount"
                              className="form-control mr-2"
                              min={0}
                              value={(Number(deduction.amount) || 0).toFixed(2)}
                              onChange={(e) => handleDeductionChange(index, 'amount', e.target.value)}
                              step="any" // Allows any decimal value
                              required // You can customize whether you need this for validation
                            />

                            {employeeDeductions.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-danger ml-2"
                                onClick={() => removeDeductionField(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <h4>No Deductions</h4>
                      )

                    }
                    <button type="button" className="btn btn-primary" onClick={addDeductionField}>
                      Add Another Deduction
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-5">
            <div class="col-lg-12 mb-5">
              <div class="card">
                <div class="card-body">
                  {/* <div className="row mt-5">
                <div className="col-lg-6">
                <div className="form-group">
                    <label>Employee Allowances:</label>
                    {employeeAllowances.map((allowance, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <input
                          type="text"
                          placeholder="Allowance Name"
                          className="form-control mr-2"
                          value={allowance.name}
                          onChange={(e) => handleAllowanceChange(index, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Allowance Amount"
                          className="form-control mr-2"
                          min={0}
                          value={(Number(allowance.amount) || 0).toFixed()}
                          onChange={(e) => handleAllowanceChange(index, 'amount', e.target.value)}
                        />
                        {employeeAllowances.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger ml-2"
                            onClick={() => removeAllowanceField(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={addAllowanceField}>
                      Add Another Allowance
                    </button>
                  </div>
                </div>
                <div className="col-lg-6">
                <div className="form-group">
                    <label>Employee Deduction:</label>
                    {employeeDeductions.map((deduction, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <input
                          type="text"
                          placeholder="Deduction Name"
                          className="form-control mr-2"
                          value={deduction.name}
                          onChange={(e) => handleDeductionChange(index, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Deduction Amount"
                          className="form-control mr-2"
                          min={0}
                          value={(Number(deduction.amount) || 0).toFixed()}
                          onChange={(e) => handleDeductionChange(index, 'amount', e.target.value)}
                          step="any" // Allows any decimal value
                          required // You can customize whether you need this for validation
                        />

                        {employeeDeductions.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger ml-2"
                            onClick={() => removeDeductionField(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={addDeductionField}>
                      Add Another Deduction
                    </button>
                  </div>
                </div>
              </div> */}
                  <center> <h4 class="card-title">Summary</h4></center>
                  <hr />
                  <div class="basic-form">
                    {/* <form> */}
                    <div class="form-group row">
                      <div className="col-sm-1"></div>
                      <label class="col-sm-3 col-form-label">Basic Salary</label>
                      <div class="col-sm-6">
                        {/* <input type="email" class="form-control" placeholder="Email" /> */}
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Basic Salary"
                          value={basicSalary.toFixed(2)}
                          readOnly
                        />

                      </div>
                    </div>
                    <div class="form-group row">
                      <div className="col-sm-1"></div>
                      <label class="col-sm-3 col-form-label">Salary Per Day</label>
                      <div class="col-sm-6">
                        {/* <input type="email" class="form-control" placeholder="Email"/> */}
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Salary per day"
                          value={salaryPerDay.toFixed(2)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <div className="col-sm-1"></div>
                      <label class="col-sm-3 col-form-label">Total Allowance Amount</label>
                      <div class="col-sm-6">
                        {/* <input type="email" class="form-control" placeholder="Email" /> */}
                        <input
                          type="number"
                          className="form-control"
                          value={totalAllowanceAmount.toFixed(2)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <div className="col-sm-1"></div>
                      <label class="col-sm-3 col-form-label">Sub Total Salary</label>
                      <div class="col-sm-6">
                        {/* <input type="email" class="form-control" placeholder="Email" /> */}
                        <input
                          type="number"
                          className="form-control"
                          value={salarySubtotal.toFixed(2)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <div className="col-sm-1"></div>
                      <label class="col-sm-3 col-form-label">Total Deduction</label>
                      <div class="col-sm-6">
                        {/* <input type="email" class="form-control" placeholder="Email" /> */}
                        <input
                          type="number"
                          className="form-control"
                          value={totalDeduction.toFixed(2)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <div className="col-sm-1"></div>
                      <label class="col-sm-3 col-form-label">Net Salary</label>
                      <div class="col-sm-6">
                        {/* <input type="email" class="form-control" placeholder="Email" /> */}
                        <input
                          type="number"
                          className="form-control"
                          value={netSalary.toFixed(2)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <div className="col-sm-1"></div>
                      <label className='col-sm-3 col-form-label'>Remarks</label>
                      <div class="col-sm-6">
                        <textarea
                          // className="form-control"
                          class="col-sm-12 col-form-label "
                          placeholder="Leave Remarks About this Salary"
                          onChange={(e) => setRemarks(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <div class="form-group row">
                      <div class="col-sm-12">
                        <center> <button type="submit" class="btn btn-dark px-5">Confirm Pay Salary</button></center>
                      </div>
                    </div>
                    {/* </form> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSalary;