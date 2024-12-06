import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const UpdateEmployee = () => {
    const [RoleData, setRoleData] = useState([]);
    const [employeeName, setEmployeeName] = useState('');
    const [employeeEmail, setEmployeeEmail] = useState('');
    const [employeeSalary, setEmployeeSalary] = useState('');
    const [employeeRoles, setEmployeeRoles] = useState(['']); // Array for roles

    const navigate = useNavigate();
    const { id } = useParams();

    const showErrorAlert = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
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

    // Check if user is an Admin
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
      
    // Fetch Employee Data
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await axios.get(`/api/employee/${id}`);
                setEmployeeName(res.data.employeeName);
                setEmployeeEmail(res.data.employeeEmail);
                setEmployeeSalary(res.data.employeeSalary);
                setEmployeeRoles(res.data.employeeRoles.map(role => role._id)); // Pre-fill roles
            } catch (error) {
                console.error("Error Fetching Employee Data", error);
            }
        };
        fetchEmployee();
    }, [id]);

    // Fetch Role Data
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axios.get("/api/role/active/R    ");
                setRoleData(res.data);
            } catch (error) {
                console.error("Error Fetching Roles", error);
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
        setEmployeeRoles([...employeeRoles, '']);
    };

    const removeRoleField = (index) => {
        const roles = [...employeeRoles];
        roles.splice(index, 1);
        setEmployeeRoles(roles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            employeeName,
            employeeEmail,
            employeeSalary,
            employeeRoles, // Array of roles
        };
        try {
            const res = await axios.put(`/api/employee/${id}`, formData);
            showSuccessAlert(res.data.msg);
            setTimeout(() => {
                navigate("/showemployee");
            }, 2000);
        } catch (error) {
            showErrorAlert(error.response?.data?.err || "Failed to update Employee");
        }
    };

    return (
        <div className="container-fluid">
            <button type="button" className="btn mb-3 btn-primary" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left-long" style={{ fontSize: "20px", fontWeight: "900" }}></i>
            </button>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Update Employee</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Employee Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Employee Name"
                                            value={employeeName}
                                            onChange={(e) => setEmployeeName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Employee Email:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Employee Email"
                                            value={employeeEmail}
                                            onChange={(e) => setEmployeeEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label>Salary</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Salary"
                                            value={employeeSalary}
                                            onChange={(e) => setEmployeeSalary(e.target.value)}
                                            required
                                        />
                                    </div>
                                    
                                </div>
                                <div className="form-row">
                                <div className="form-group col-md-12">
                                        <label>Employee Roles:</label>
                                        {employeeRoles.map((role, index) => (
                                            <div key={index} className="d-flex align-items-center mb-2">
                                                <select
                                                    className="form-control"
                                                    value={role}
                                                    onChange={(e) => handleRoleChange(index, e.target.value)}
                                                >
                                                    <option disabled value="">
                                                        Choose Role
                                                    </option>
                                                    {RoleData.map((r) => (
                                                        <option key={r._id} value={r._id}>
                                                            {r.roleName}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger ml-2"
                                                    onClick={() => removeRoleField(index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-success mt-2"
                                            onClick={addRoleField}
                                        >
                                            Add Role
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-dark">
                                    Update Employee
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmployee;
