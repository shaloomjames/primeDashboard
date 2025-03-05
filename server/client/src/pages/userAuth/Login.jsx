import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode
import Swal from 'sweetalert2'; // Import SweetAlert2
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';
// require("../../../public/images/")
const Login = () => {
    const [employeeEmail, setEmployeeEmail] = useState('');
    const [employeePassword, setEmployeePassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
   const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const {storeTokenInCookies} = useAuth();

    useEffect(() => {
        const savedTheme = 'light'; // Default to light
        // const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
        const body = document.querySelector('body');
        body.setAttribute('data-theme-version', savedTheme); // Apply theme to body
    }, [])



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
            timer: 2700,
            showConfirmButton: false,
        });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const formData = {
    //         employeeEmail:employeeEmail.toLocaleLowerCase(),
    //         employeePassword,
    //     };

    //     try {
    //         const response = await axios.post("/api/employee/login", formData);
    //         showSuccessAlert(response.data.msg);
    //         const userToken = response.data.token;
    //         const decodedToken = jwtDecode(userToken);
    //         const userRole = decodedToken.userrole;
    //         // storing the token in cookies and context api by a function
    //         storeTokenInCookies(userToken);
    //             if(Array.isArray(userRole)  && userRole.includes("Admin") && // Array case
    //             userRole !== "Admin"                                       // String case
    //             ){
    //                 setTimeout(() => {
    //                     navigate("/");
    //                 }, 2800);
    //             }else{
    //                 setTimeout(() => {
    //                     navigate("/employee");
    //                 }, 2800);
    //             }
    //     } catch (error) {
    //         showErrorAlert(error.response?.data?.err || 'Failed to Login');
    //     }
    // };

    
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
        
        const formData = {
            employeeEmail:employeeEmail.toLocaleLowerCase(),
            employeePassword,
        };

        try {
            const response = await axios.post("/api/employee/login", formData);
            showSuccessAlert(response.data.msg);
            const userToken = response.data.token;
            const decodedToken = jwtDecode(userToken);
            const userRole = decodedToken.userrole;
            // storing the token in cookies and context api by a function
            storeTokenInCookies(userToken);
                // if(Array.isArray(userRole)  && userRole.includes("Admin") && // Array case
                // userRole !== "Admin"                                       // String case
                // ){
                //     setTimeout(() => {
                //         navigate("/");
                //     }, 2800);
                // }else{
                //     setTimeout(() => {
                //         navigate("/employee");
                //     }, 2800);
                // }
                // Check if the roles array contains "Admin"
        if (Array.isArray(userRole) && userRole.includes("Admin")) {
            setTimeout(() => {
                navigate("/");
            }, 2800);
        } else {
            setTimeout(() => {
                navigate("/employee");
            }, 2800);
        }
        } catch (error) {
            showErrorAlert(error.response?.data?.err || 'Failed to Login');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
      <>
        {/*     
            <div className="login-form-bg vh-100 " style={{ backgroundImage: `url('/images/loginBg-4.JPG')`, backgroundRepeat: "auto",  display: "flex", justifyContent: "center", alignItems: "center", height: "100vh",width: "100vw" }}> */}
        <div
          className="login-form-bg vh-100"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <style>
            {`
                       input::placeholder {
    color: #000 !important; /* Change this to the color you want */
}

                    `}
          </style>
          <div className="container h-100">
            <div className="row justify-content-center h-100">
              <div className="col-xl-6">
                <div className="form-input-content">
                  <div
                    className="card login-form mb-0"
                    style={{ backgroundColor: "rgb(255 255 255 / 35%)" }}
                  >
                    <div className="card-body pt-5">
                      <a className="text-center">
                        {/* <h4>Prime Vertex</h4> */}
                        <h4>
                          <img
                            src="/images/Primevertex--Logo-light.png"
                            alt=""
                          />
                        </h4>
                      </a>
                      <form
                        className="mt-5 mb-5 login-input"
                        onSubmit={handleSubmit}
                      >
                        <div className="form-group">
                          <input
                            style={{ color: "black" }}
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={employeeEmail}
                            onChange={(e) => setEmployeeEmail(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            style={{ color: "black" }}
                            type={`${passwordVisible ? "text" : "password"}`}
                            className="form-control"
                            placeholder="Password"
                            value={employeePassword}
                            onChange={(e) =>
                              setEmployeePassword(e.target.value)
                            }
                          />
                          <span
                            onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility state
                            style={{
                              position: "absolute",
                              right: "40px",
                              top: "56%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                              color: "white",
                            }}
                          >
                            <i
                              className={`fa-solid ${
                                passwordVisible ? "fa-eye" : "fa-eye-slash"
                              }`}
                              style={{ color: "black" }}
                            ></i>
                          </span>
                        </div>
                        {/* <button className="btn login-form__btn  submit w-100" type="submit" style={{ backgroundColor: "#0d6efd" }}
                                                                                        disabled={isSubmitting}>
                                                                                        {isSubmitting ? " ..." : "Log In"}
                                            
                                            </button> */}
                        <button
                          className="btn login-form__btn submit w-100"
                          type="submit"
                          style={{ backgroundColor: "#0d6efd" }}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Log In"}
                        </button>

                        <span className="btn">
                          <Link
                            to="/forgotpassword"
                            style={{ color: "black", fontWeight: "900" }}
                          >
                            forgot password
                          </Link>
                        </span>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default Login;
// Shaloom@12345