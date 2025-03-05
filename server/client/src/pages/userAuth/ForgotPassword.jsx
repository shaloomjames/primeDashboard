// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode
// import Cookies from 'js-cookie';     // Corrected to js-cookie
// import Swal from 'sweetalert2'; // Import SweetAlert2
// import { Link, useNavigate } from 'react-router-dom';

// const ForgotPassword = () => {
//     const [employeeEmail, setEmployeeEmail] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false); // New state for tracking submission status
//     const navigate = useNavigate();

//     useEffect(() => {
//         const savedTheme = 'light'; // Default to light
//         // const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
//         const body = document.querySelector('body');
//         body.setAttribute('data-theme-version', savedTheme); // Apply theme to body
//     }, [])



//     const showErrorAlert = (message) => {
//         Swal.fire({
//             icon: 'error',
//             title: 'Oops...',
//             text: message,
//             // timer: 2000, // Automatically closes after 2 seconds
//             // showConfirmButton: false,
//         });
//     };

//     const showSuccessAlert = (message) => {
//         Swal.fire({
//             icon: 'success',
//             title: 'Success',
//             text: message,
//             timer: 3600,
//             showConfirmButton: false,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setIsSubmitting(true); // Start submission
//          // Prevent multiple submissions
//          if (isSubmitting) {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Request Already Sent',
//                 text: 'Please wait while we process your previous request',
//                 timer: 2000,
//                 showConfirmButton: false
//             });
//             return;
//         }



//         const formData = {
//             employeeEmail:employeeEmail.toLocaleLowerCase(),
//         };

//         try {
//             const response = await axios.post("/api/employee/forgotpassword", formData);
//             // successNotify(response.data.msg);
//             showSuccessAlert(response.data.msg);


//             setTimeout(() => {
//                 navigate("/login");
//             }, 3700);
//         } catch (error) {
//             showErrorAlert(error.response?.data?.err || 'Failed to Login');
//         } finally {
//             setIsSubmitting(false); // Reset submission state
//         }
//     };

//     return (
//       <>
//         {/* <div className="login-form-bg vh-100 " style={{ backgroundImage: `url('https://img.freepik.com/premium-photo/nightfall-workplace-dark-office-interior-photo_960396-69711.jpg?w=996')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}> */}
//         <div
//           className="login-form-bg vh-100"
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100vh",
//             width: "100vw",
//           }}
//         >
//           <style>
//             {`
//                        input::placeholder {
//     color: #000 !important; /* Change this to the color you want */
// }

//                     `}
//           </style>
//           <div className="container h-100">
//             <div className="row justify-content-center h-100">
//               <div className="col-xl-6">
//                 <div className="form-input-content">
//                   <div
//                     className="card login-form mb-0"
//                     style={{ backgroundColor: "rgb(255 255 255 / 35%)" }}
//                   >
//                     <div className="card-body pt-5">
//                       <a className="text-center">
//                         <h4>
//                           <img
//                             src="/images/Primevertex-Logo-01-dark.png"
//                             width={"270px"}
//                             alt=""
//                           />
//                         </h4>
//                       </a>
//                       <form
//                         className="mt-5 mb-5 login-input"
//                         onSubmit={handleSubmit}
//                       >
//                         <h4 style={{ color: "black", fontWeight: "500" }}>
//                           Enter your email address and we will send you Password
//                           Reset Link
//                         </h4>
//                         <br />
//                         <div className="form-group">
//                           <input
//                             style={{ color: "black" }}
//                             type="email"
//                             className="form-control"
//                             placeholder="Email"
//                             value={employeeEmail}
//                             onChange={(e) => setEmployeeEmail(e.target.value)}
//                           />
//                         </div>
//                         {/* <button className="btn login-form__btn  submit w-100" type="submit" style={{ backgroundColor: "#0d6efd" }}>
//                                                 Send Email
//                                             </button> */}
//                         <button
//                           className="btn login-form__btn submit w-100"
//                           type="submit"
//                           style={{ backgroundColor: "#0d6efd" }}
//                           disabled={isSubmitting} // Disable button during submission
//                         >
//                           {isSubmitting ? "Sending..." : "Send Email"}
//                         </button>
//                         <span className="btn">
//                           <Link
//                             to="/login"
//                             style={{ color: "black", fontWeight: "800" }}
//                           >
//                             Login page?
//                           </Link>
//                         </span>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
// };

// export default ForgotPassword;
// // Shaloom@12345
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [employeeEmail, setEmployeeEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const body = document.querySelector('body');
        body.setAttribute('data-theme-version', 'light');
    }, []);

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
            timer: 3600,
            showConfirmButton: false,
        });
    };

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
            const response = await axios.post("/api/employee/forgotpassword", {
                employeeEmail: employeeEmail.toLowerCase()
            });
            
            showSuccessAlert(response.data.msg);
            
            setTimeout(() => {
                navigate("/login");
            }, 3700);
        } catch (error) {
            const errorMessage = error.response?.data?.err || 
                              error.message || 
                              'Failed to process your request';
            showErrorAlert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-form-bg vh-100" 
            style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100vh", 
                width: "100vw" 
            }}>
            
            <style>{`
                input::placeholder {
                    color: #000 !important;
                }
            `}</style>

            <div className="container h-100">
                <div className="row justify-content-center h-100">
                    <div className="col-xl-6">
                        <div className="form-input-content">
                            <div className="card login-form mb-0" 
                                style={{ backgroundColor: "rgb(255 255 255 / 35%)" }}>
                                
                                <div className="card-body pt-5">
                                    <div className="text-center">
                                        <h4>
                                            <img src="/images/Primevertex-Logo-01-dark.png" 
                                                width="270px" 
                                                alt="Company Logo" />
                                        </h4>
                                    </div>
                                    
                                    <form className="mt-5 mb-5 login-input" onSubmit={handleSubmit}>
                                        <h4 style={{ color: "black", fontWeight: "500" }}>
                                            Enter your email address to receive a password reset link
                                        </h4>
                                        
                                        <div className="form-group mt-4">
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email"
                                                value={employeeEmail}
                                                onChange={(e) => setEmployeeEmail(e.target.value)}
                                                style={{ color: "black" }}
                                                required
                                            />
                                        </div>
                                        
                                        <button
                                            className="btn login-form__btn submit w-100"
                                            type="submit"
                                            style={{ backgroundColor: "#0d6efd" }}
                                            disabled={isSubmitting}>
                                            {isSubmitting ? "Sending..." : "Send Email"}
                                        </button>
                                        
                                        <div className="mt-3 text-center">
                                            <Link to="/login" 
                                                style={{ color: "black", fontWeight: "800" }}>
                                                Back to Login
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;