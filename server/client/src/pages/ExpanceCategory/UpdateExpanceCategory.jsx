import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2_
import Cookies from 'js-cookie';     
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode

const UpdateExpanceCategory = () => {
    const [ExpanceCategoryName, setexpanceCategoryName] = useState('');
    const [ExpanceCategoryColor, setExpanceCategoryColor] = useState('');
    const [ExpanceCategoryStatus, setexpanceCategoryStatus] = useState('');

    const navigate = useNavigate();

    
    const showErrorAlert = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
            // timer: 2000, // Automatically closes after 2 seconds
            // showConfirmButton: false,
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

    const { id } = useParams();

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
        const fetchExpanceCategory = async () => {
          try {
            const res = await axios.get(`/api/expance/category/${id}`);
            setexpanceCategoryName(res.data.ExpanceCategoryName)
            setExpanceCategoryColor(res.data.ExpanceCategoryColor)
            setexpanceCategoryStatus(res.data.ExpanceCategoryStatus)
          } catch (error) {
            console.log("Error Fetching Expance Category Data", error)
          }
        }
        fetchExpanceCategory();
      }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            ExpanceCategoryName,
            ExpanceCategoryColor,
            ExpanceCategoryStatus
            };
        try {
            const res = await axios.put(`/api/expance/category/${id}`, formData);
            showSuccessAlert(res.data.msg);
            setTimeout(() => {
                navigate("/showexpanceCategory");
            }, 4000);
        } catch (error) {
            showErrorAlert(error.response?.data?.err || "Failed to update Expance Category");
        }
    };

    return (
        <>
            <div className="container-fluid">
                <button type="button" className="btn mb-3 btn-primary" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left-long" style={{ fontSize: "20px", fontWeight: "900" }}></i>
                </button>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Update Expance Category</h4>
                                <div className="basic-form">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-row">
                                        <div class="form-group col-md-6">
                                                <label>Expance Category Name</label>
                                                <input type="text" class="form-control" placeholder="Expance Category Name" value={ExpanceCategoryName} onChange={(e) => setexpanceCategoryName(e.target.value)} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Expance Category Status</label>
                                                <select id="inputState" className="form-control" value={ExpanceCategoryStatus} onChange={(e) => setexpanceCategoryStatus(e.target.value)}>
                                                    <option disabled value="">Choose expance Category Status</option>
                                                    <option value="active">active</option>
                                                    <option value="inactive">inactive</option>
                                                </select>
                                            </div>
                                            <div class="form-group col-md-12">
                                                <label>Expance Category Color</label>
                                                <input type="color" class="form-control" placeholder="Expance Category COlor" value={ExpanceCategoryColor} onChange={(e) => setExpanceCategoryColor(e.target.value)} />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-dark">Update Expance Category</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateExpanceCategory;
