import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';     
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AddExpance = () => {
    const [expanceName, setExpanceName] = useState('');
    const [expanceAmount, setExpanceAmount] = useState('');
    const [expanceImage, setExpanceImage] = useState(null);
    const [expanceDate, setExpanceDate] = useState('');
    const [addedBy, setAddedBy] = useState('');
    const [expanceCategory, setExpanceCategory] = useState('');
    const [expanceCategoryData, setExpanceCategoryData] = useState([]);

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
        if(userToken) {
            const decodedToken = jwtDecode(userToken); 
        setAddedBy(decodedToken.userid || '');
        }
    }, []);


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
                const res = await axios.get("/api/expance/category/active/E");
                setExpanceCategoryData(res.data);
            } catch (error) {
                console.error("Error Fetching Expance Category Data", error);
            }
        };
        fetchExpanceCategory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("expanceAmount", expanceAmount);
            formData.append("expanceName", expanceName);
            if (expanceImage) formData.append("expanceImage", expanceImage);
            formData.append("expanceDate", expanceDate);
            formData.append("expanceCategory", expanceCategory); 
            formData.append("addedBy", addedBy);

            const response = await axios.post("/api/expance", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            showSuccessAlert(response.data.msg);

            // Redirect after 4 seconds
            setTimeout(() => {
                navigate("/showexpance");
            }, 4000);
        } catch (error) {
            showErrorAlert(error.response?.data?.err || "Failed to add Expense");
        }
    };

    return (
        <>
            <div className="container-fluid">
                <Link type="button" className="btn mb-3 btn-primary" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left-long" style={{ fontSize: "20px", fontWeight: "900" }}></i>
                </Link>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Add Expense</h4>
                                <div className="basic-form">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label>Expense Name</label>
                                                <input type="text" className="form-control" placeholder="Expense Name" value={expanceName} onChange={(e) => setExpanceName(e.target.value)} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Expense Amount</label>
                                                <input type="number" className="form-control" placeholder="Expense Amount" value={expanceAmount} onChange={(e) => setExpanceAmount(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label>Expense Image</label>
                                                <input type="file" className="form-control" onChange={(e) => setExpanceImage(e.target.files[0])} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Expense Date</label>
                                                <input type="date" className="form-control" value={expanceDate} onChange={(e) => setExpanceDate(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label>Expense Category</label>
                                                <select className="form-control" value={expanceCategory} onChange={(e) => setExpanceCategory(e.target.value)} >
                                                    <option disabled selected value={""}>Choose Expense Category</option>
                                                    {expanceCategoryData.length > 0 ? (
                                                        expanceCategoryData.map((category) => (
                                                            <option key={category._id} value={category._id}>{category.ExpanceCategoryName}</option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No Categories Available</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-dark">Add Expense</button>
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

export default AddExpance;