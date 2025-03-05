import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AddEmployee = () => {
  const [employeeRoleData, setEmployeeRoleData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [employeeRoles, setEmployeeRoles] = useState([""]); // Array for roles
  const [employeeTimeIn, setEmployeeTimeIn] = useState("21:00");
  const [employeeTimeOut, setEmployeeTimeOut] = useState("05:00");
  const [employeeAllowances, setEmployeeAllowances] = useState([
    { name: "", amount: "" },
  ]); // Array for allowances
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const showErrorAlert = (message) => {
    Swal.fire({ icon: "error", title: "Oops...", text: message });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  };

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
    const fetchRoles = async () => {
      try {
        const res = await axios.get("/api/role/active/R");
        setEmployeeRoleData(res.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleRoleChange = (index, value) => {
    const roles = [...employeeRoles];
    roles[index] = value;
    setEmployeeRoles(roles);
  };

  const addRoleField = () => {
    setEmployeeRoles([...employeeRoles, ""]);
  };

  const removeRoleField = (index) => {
    const roles = [...employeeRoles];
    roles.splice(index, 1);
    setEmployeeRoles(roles);
  };

  const handleAllowanceChange = (index, key, value) => {
    const updatedAllowances = [...employeeAllowances];
    updatedAllowances[index][key] = value;
    setEmployeeAllowances(updatedAllowances);
  };

  const addAllowanceField = () => {
    setEmployeeAllowances([...employeeAllowances, { name: "", amount: "" }]);
  };

  const removeAllowanceField = (index) => {
    const updatedAllowances = [...employeeAllowances];
    updatedAllowances.splice(index, 1);
    setEmployeeAllowances(updatedAllowances);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check submission status first
    if (isSubmitting) {
      Swal.fire({
        icon: "warning",
        title: "Request Already Sent",
        text: "Please wait while we process your previous request",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setIsSubmitting(true);

    // Filter allowances that have valid names and amounts
    const filteredAllowances = employeeAllowances.filter(
      (allowance) =>
        allowance.name.trim() !== "" || allowance.amount.trim() !== ""
    );

    // Check if partial allowances (only one field filled) exist
    const invalidAllowance = filteredAllowances.find(
      (allowance) =>
        (allowance.name.trim() !== "" && allowance.amount.trim() === "") ||
        (allowance.amount.trim() !== "" && allowance.name.trim() === "")
    );

    if (invalidAllowance) {
      showErrorAlert(
        "Both 'Allowance Name' and 'Allowance Amount' are required if either is provided."
      );
      return;
    }

    // ---- Inject Employee Role if not Admin ----

    // Clone the selected roles
    let rolesToSend = [...employeeRoles];

    // Check if any selected role is Admin.
    // Convert role names to lowercase for a case-insensitive comparison.
    const hasAdmin = rolesToSend.some((roleId) => {
      const roleObj = employeeRoleData.find((r) => r._id === roleId);
      return roleObj && roleObj.roleName.toLowerCase() === "admin";
    });

    // If no Admin role was selected, then always add the "Employee" role.
    if (!hasAdmin) {
      const employeeRoleObj = employeeRoleData.find(
        (r) => r.roleName.toLowerCase() === "employee"
      );
      if (employeeRoleObj && !rolesToSend.includes(employeeRoleObj._id)) {
        rolesToSend.push(employeeRoleObj._id);
      }
    }

    // ---------------------------------------------

    // Prepare the form data with the (possibly modified) roles array.If no allowances are provided, proceed with the form submission without allowances
    const formData = {
      employeeName,
      employeeEmail,
      employeePassword,
      employeeSalary,
      employeeRoles: rolesToSend, // roles array now guaranteed to have "Employee" if no Admin was selected
      employeeTimeIn,
      employeeTimeOut,
      employeeallowances: filteredAllowances, // only non-empty allowances
    };

    console.log("TIme In client", employeeTimeIn);
    console.log("TIme Out client", employeeTimeOut);
    try {
      const response = await axios.post("/api/employee", formData);
      showSuccessAlert(response.data.msg);
      setTimeout(() => {
        navigate("/showemployee");
      }, 2000);
    } catch (error) {
      showErrorAlert(error.response?.data?.err || "Failed to add Employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <button
        type="button"
        className="btn mb-3 btn-primary"
        onClick={() => navigate(-1)}
      >
        <i
          className="fa-solid fa-arrow-left-long"
          style={{ fontSize: "20px", fontWeight: "900" }}
        ></i>
      </button>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Add Employee</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Employee Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Employee Name"
                      onChange={(e) => setEmployeeName(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Employee Email: </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Employee Email"
                      onChange={(e) => setEmployeeEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={(e) => setEmployeePassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Salary</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Salary"
                      onChange={(e) => setEmployeeSalary(e.target.value)}
                    />
                  </div>
                </div>

                {/* Employee Roles */}
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Employee Roles:</label>
                    {employeeRoles.map((role, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <select
                          className="form-control"
                          value={role}
                          onChange={(e) =>
                            handleRoleChange(index, e.target.value)
                          }
                        >
                          <option value="">Choose Employee Role</option>
                          {employeeRoleData.map((roleOption) => (
                            <option key={roleOption._id} value={roleOption._id}>
                              {roleOption.roleName}
                            </option>
                          ))}
                        </select>
                        {employeeRoles.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger ml-2"
                            onClick={() => removeRoleField(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={addRoleField}
                    >
                      Add Another Role
                    </button>
                  </div>
                  <div className="form-group col-md-6">
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>Time In</label>
                        <input
                          type="time"
                          className="form-control"
                          placeholder="Time In"
                          onChange={(e) => setEmployeeTimeIn(e.target.value)}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label>Time Out</label>
                        <input
                          type="time"
                          className="form-control"
                          placeholder="Time Out"
                          onChange={(e) => setEmployeeTimeOut(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Employee Allowances */}
                <div className="form-group">
                  <label>Employee Allowances:</label>
                  {employeeAllowances.map((allowance, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <input
                        type="text"
                        placeholder="Allowance Name"
                        className="form-control mr-2"
                        value={allowance.name}
                        onChange={(e) =>
                          handleAllowanceChange(index, "name", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="Allowance Amount"
                        className="form-control mr-2"
                        min={0}
                        value={allowance.amount}
                        onChange={(e) =>
                          handleAllowanceChange(index, "amount", e.target.value)
                        }
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
                  <button
                    type="button"
                    className="btn btn-primary mt-2"
                    onClick={addAllowanceField}
                  >
                    Add Another Allowance
                  </button>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  // >
                  //   Add Employee
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Employee..." : "Add Employee"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <center className=" card py-5" style={{ visibility: "hidden" }}>
        <div className="row"></div>
      </center>
    </div>
  );
};

export default AddEmployee;
