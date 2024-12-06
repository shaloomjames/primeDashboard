import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import Cookies from 'js-cookie';     
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode

const AddExpanceCategory = () => {
    const [ExpanceCategoryName, setExpanceCategoryName] = useState('');
    const [ExpanceCategoryColor, setExpanceCategoryColor] = useState('');

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
      

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            ExpanceCategoryName,
            ExpanceCategoryColor
        }
        try {
            const response  = await axios.post("/api/expance/category", formData);
            showSuccessAlert(response.data.msg);
            setTimeout(() => {
                    navigate("/showexpanceCategory");
            }, 2000);
        } catch (error) {
            showErrorAlert(error.response?.data?.err || "Failed to add Employee");
        }
    }

    return (
        <>
            <div class="container-fluid">
                <button type="button" class="btn mb-3 btn-primary" onClick={() => navigate(-1)}>
                    <i class="fa-solid fa-arrow-left-long" style={{ fontSize: "20px", fontWeight: "900" }}></i>
                </button>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Add Expance Category</h4>
                                <div class="basic-form">
                                    <form onSubmit={handleSubmit}>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label>Expance Category Name</label>
                                                <input type="text" class="form-control" placeholder="Expance Category Name" onChange={(e) => setExpanceCategoryName(e.target.value)} />
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label>Expance Category Color</label>
                                                <input type="color" class="form-control" placeholder="Expance Category Color" onChange={(e) => setExpanceCategoryColor(e.target.value)} />
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-dark">Add Expance Category</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddExpanceCategory