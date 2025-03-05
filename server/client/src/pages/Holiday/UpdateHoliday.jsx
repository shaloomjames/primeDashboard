import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode
import Swal from 'sweetalert2'; // Import SweetAlert2_

const UpdateHoliday = () => {
    // State to store the fetched holiday data
    const [holidayData, setHolidayData] = useState([]);
    const [name, setname] = useState('');
    const [date, setdate] = useState('');
    const [description, setdescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const {id} = useParams();
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
            // showConfirmButton: false,
        });
    };


    useEffect(() => {
        const userToken = Cookies.get("UserAuthToken");

        if (userToken) {
            try {
                const decodedToken = jwtDecode(userToken); // Decode the JWT token
                const userRole = decodedToken.userrole;   // Get the user role(s)
                // setId(decodedToken?.userid || '')
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
        const fetchHoliday = async () => {
            try {
                const responce = await axios.get(`/api/holiday/${id}`);
                setHolidayData(responce.data);
                setname(responce.data.name)
                setdate(responce.data.date.split('T')[0])
                setdescription(responce.data.description)
            } catch (error) {
                console.error("Error fetching Holiday Data From the Api !", error)
            }
        }
        fetchHoliday();
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        
           // Check submission status first
                if (isSubmitting) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Request Already Sent',
                        text: 'Please wait while we process your previous request',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }
        
                setIsSubmitting(true);

        try {
            const formData = {
                name,
                date,
                description,
            }
            const response = await axios.put(`/api/holiday/${id}`, formData);
            showSuccessAlert(response.data.msg);
            console.log(response)
            setTimeout(() => {
                navigate("/holiday-calendar");
            }, 2000);
        } catch (error) {
            showErrorAlert(error.response?.data?.err)
        }finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>

            <div class="container-fluid">
                <Link type="button" class="btn mb-3 btn-primary" onClick={() => navigate(-1)}>
                    <i class="fa-solid fa-arrow-left-long" style={{ fontSize: "20px", fontWeight: "900" }}></i>
                </Link>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Update Holiday</h4>
                                <div class="basic-form">
                                    <form onSubmit={handleSubmit}>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label>Holiday Name:</label>
                                                <input type="text" style={inputStyle} class="form-control" value={name} placeholder="Holiday Name" onChange={(e) => setname(e.target.value)} />
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label>Holiday Date:</label>
                                                <input type="date" style={inputStyle} class="form-control" value={date} onChange={(e) => setdate(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-12">
                                                <label>Holiday Date:</label>
                                                <textarea name="" style={inputStyle} class="form-control" value={description} placeholder="Leave Remarks About this Salary" onChange={(e) => setdescription(e.target.value)} id=""></textarea>
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary"
                                         disabled={isSubmitting}>
                                            {isSubmitting ? "Updating Holiday..." : "Update Holiday"}
                                        {/* // >Update Holiday */}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <center style={{ visibility: "hidden", height: "265px" }}>
                    <div className="row">
                    </div >
                </center>
            </div>
        </>)
}

const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
};


export default UpdateHoliday