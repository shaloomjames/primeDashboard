import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2_
import axios from 'axios';
import Cookies from 'js-cookie';     
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode

const UpdateExpance = () => {
    const [expanceName, setExpanceName] = useState('');
    const [expanceAmount, setExpanceAmount] = useState('');
    const [expanceImage, setExpanceImage] = useState('');
    const [expanceDate, setExpanceDate] = useState('');
    const [addedBy, setAddedBy] = useState('');
    const [imageFile, setImageFile] = useState(null); // Store image file if uploaded
    const [expanceCategory, setExpanceCategory] = useState(''); // Store selected category ID
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
        // Fetch active expense categories
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

    useEffect(() => {
        // Fetch existing expense details to pre-fill the form
        const fetchExpance = async () => {
            try {
                const res = await axios.get(`/api/expance/${id}`);
                setExpanceName(res.data.expanceName);
                setExpanceAmount(res.data.expanceAmount);
                setExpanceDate(new Date(res.data.expanceDate).toISOString().split('T')[0]);
                setExpanceImage(res.data.expanceImage);
                setAddedBy(res.data.addedBy.employeeName);
                setExpanceCategory(res.data.expanceCategory._id); // Set initial category by ID
            } catch (error) {
                console.error("Error Fetching Expance Data", error);
            }
        };
        fetchExpance();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Prepare form data for submission
            const formData = new FormData();
            formData.append('expanceName', expanceName);
            formData.append('expanceAmount', expanceAmount);
            formData.append('expanceDate', expanceDate);
            formData.append('expanceCategory', expanceCategory); // Submit selected category ID

            if (imageFile) {
                formData.append('expanceImage', imageFile);
            } else {
                formData.append('expanceImage', expanceImage);
            }

            const res = await axios.put(`/api/expance/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showSuccessAlert(res.data.msg);
            setTimeout(() => navigate("/showexpance"), 4000);
        } catch (error) {
            showErrorAlert(error.response?.data?.err || "Failed to update Expance");
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
                                <h2>Update Expance</h2>
                                <center>
                                    <h4 className="card-title">
                                        Added By <span style={{ fontWeight: "900", fontSize: "30px", color: "#7571f9" }}>
                                            {addedBy}
                                        </span>
                                    </h4>
                                </center>
                                <div className="basic-form">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label>Expance Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={expanceName}
                                                    placeholder="Expance Name"
                                                    onChange={(e) => setExpanceName(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Expance Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={expanceAmount}
                                                    placeholder="Expance Amount"
                                                    onChange={(e) => setExpanceAmount(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label>Expance Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={expanceDate}
                                                    placeholder="Expance Date"
                                                    onChange={(e) => setExpanceDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Expense Image</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={(e) => setImageFile(e.target.files[0])}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label>Expance Category</label>
                                                <select
                                                    className="form-control"
                                                    value={expanceCategory}
                                                    onChange={(e) => setExpanceCategory(e.target.value)}
                                                >
                                                    <option disabled>Choose Expance Category</option>
                                                    {expanceCategoryData.length > 0 ? (
                                                        expanceCategoryData.map((category) => (
                                                            <option key={category._id} value={category._id}>
                                                                {category.ExpanceCategoryName}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No Categories Available</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-dark">Update Expance</button>
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

export default UpdateExpance;
