import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const EmployeeShowProfile = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [Id, setId] = useState(""); // To store employee ID

  const navigate = useNavigate();

  // Handle showing errors
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  };

  // Handle showing success messages
  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // Check the user's authentication and role
  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");

    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken); // Decode the JWT token
        const userRole = decodedToken.userrole;   // Get the user role(s)
        setId(decodedToken.userid); // Set the current user's ID

        // Redirect to login if the user is not an Employee
        if (
          !(Array.isArray(userRole) && userRole.includes("Employee")) && // Array case
          userRole !== "Employee"                                       // String case
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

  // Fetch employee data from the API
  useEffect(() => {
    if (Id) {
      const fetchEmployee = async () => {
        try {
          const res = await axios.get(`/api/employee/${Id}`);
          setEmployeeData(res.data); // Set the employee data from API response
        } catch (error) {
          console.error("Error Fetching Employee Data", error);
          showErrorAlert("Error Fetching Employee Data");
        }
      };
      fetchEmployee();
    }
  }, [Id]);

  // Render the employee profile
  return (
    <>
      <div className="container-fluid">
        <button type="button" className="btn mb-3 btn-primary" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left-long" style={{ fontSize: "20px", fontWeight: "900" }}></i>
        </button>
        <div className="row">
          <div className="col-lg-12">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="card-title mb-5">Employee Profile</h4>
                
                {/* Display employee data once fetched */}
                {employeeData ? (
                  <>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Employee Id</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{employeeData?.employeeId || "N/A"}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Employee Name</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{employeeData?.employeeName || "N/A"}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Employee Email</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{employeeData?.employeeEmail || "N/A"}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Employee Salary</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{employeeData?.employeeSalary || "N/A"}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Employee Roles</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">
                          {employeeData?.employeeRoles.map((role) => role?.roleName || "N/A").join(" , ") || "No Roles Available"}
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Employee Allowances</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">
                          {employeeData?.employeeallowances.map((allowance) => `${allowance?.name || "N/A"}: ${allowance?.amount || "N/A"}`).join(" | ")|| "No Allowances Available"}
                        </p>
                      </div>
                    </div>
                    <hr />
                  </>
                ) : (
                  <p>Loading...</p> // Show loading while data is being fetched
                )}
              </div>
            </div>
          </div>
        </div>
        <center className=" card py-5" style={{visibility:"hidden"}}>
        <div className="row">
        </div ></center>
      </div>
    </>
  );
};

export default EmployeeShowProfile;
