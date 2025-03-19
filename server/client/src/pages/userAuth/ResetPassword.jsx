// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link, useNavigate, useParams } from "react-router-dom";
// // import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import icons for eye and eye-slash

// const ResetPassword = () => {
//   const { token } = useParams(); // Extract token from URL
//   const [employeePassword, setEmployeePassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedTheme = "light"; // Default to light
//     const body = document.querySelector("body");
//     body.setAttribute("data-theme-version", savedTheme); // Apply theme to body
//   }, []);

//   const showErrorAlert = (message) => {
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: message,
//     });
//   };

//   const showSuccessAlert = (message) => {
//     Swal.fire({
//       icon: "success",
//       title: "Success",
//       text: message,
//       timer: 2000,
//       showConfirmButton: false,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check submission status first
//     if (isSubmitting) {
//       Swal.fire({
//         icon: "warning",
//         title: "Request Already Sent",
//         text: "Please wait while we process your previous request",
//         timer: 2000,
//         showConfirmButton: false,
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     const formData = {
//       resetToken: token,
//       newPassword: employeePassword,
//     };

//     if (employeePassword !== confirmPassword) {
//       return Swal.fire("Error", "Passwords do not match.", "error");
//     }
//     try {
//       const response = await axios.post(
//         "/api/employee/resetpassword",
//         formData
//       ); // Adjusted endpoint
//       showSuccessAlert(response.data.msg);
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (error) {
//       showErrorAlert(error.response?.data?.error || "Failed to Reset Password");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       {/* <div className="login-form-bg vh-100" style={{ backgroundImage: `url('https://img.freepik.com/premium-photo/nightfall-workplace-dark-office-interior-photo_960396-69711.jpg?w=996')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}> */}
//       <div
//         className="login-form-bg vh-100"
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           width: "100vw",
//         }}
//       >
//         <style>
//           {`
//                        input::placeholder {
//     color: #000 !important; /* Change this to the color you want */
// }

//                     `}
//         </style>
//         <div className="container h-100">
//           <div className="row justify-content-center h-100">
//             <div className="col-xl-6">
//               <div className="form-input-content">
//                 <div
//                   className="card login-form mb-0"
//                   style={{ backgroundColor: "rgb(255 255 255 / 35%)" }}
//                 >
//                   <div className="card-body pt-5">
//                     <a className="text-center">
//                       <h4>
//                         <img src="/images/Primevertex--Logo-light.png" alt="" />
//                       </h4>
//                     </a>
//                     <form
//                       className="mt-5 mb-5 login-input"
//                       onSubmit={handleSubmit}
//                     >
//                       <h3 style={{ color: "black", fontWeight: "500" }}>
//                         Reset Password
//                       </h3>
//                       <div
//                         className="form-group"
//                         style={{ position: "relative" }}
//                       >
//                         <input
//                           style={{ color: "black" }}
//                           type={passwordVisible ? "text" : "password"} // Toggle password visibility
//                           className="form-control"
//                           placeholder="Password"
//                           value={employeePassword}
//                           onChange={(e) => setEmployeePassword(e.target.value)}
//                         />
//                         <input
//                           style={{ color: "black" }}
//                           type={passwordVisible ? "text" : "password"} // Toggle password visibility
//                           className="form-control"
//                           placeholder="confirm password"
//                           value={confirmPassword}
//                           onChange={(e) => setConfirmPassword(e.target.value)}
//                         />
//                         <span
//                           onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility state
//                           style={{
//                             position: "absolute",
//                             right: "10px",
//                             top: "75%",
//                             transform: "translateY(-50%)",
//                             cursor: "pointer",
//                             color: "black",
//                           }}
//                         >
//                           <i
//                             className={`fa-solid ${
//                               passwordVisible ? "fa-eye" : "fa-eye-slash"
//                             }`}
//                           ></i>
//                         </span>
//                       </div>
//                       {/* <button className="btn login-form__btn submit w-100" type="submit" style={{ backgroundColor: "#0d6efd" }}>
//                                                 Reset Password
//                                             </button> */}
//                       <button
//                         className="btn login-form__btn submit w-100"
//                         type="submit"
//                         style={{ backgroundColor: "#0d6efd" }}
//                         disabled={isSubmitting}
//                       >
//                         {isSubmitting ? "Submitting..." : "Reset Password"}
//                       </button>

//                       <span className="btn">
//                         <Link
//                           to="/login"
//                           style={{ color: "black", fontWeight: "800" }}
//                         >
//                           Go Back to login Page?
//                         </Link>
//                       </span>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ResetPassword;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from URL
  const [employeePassword, setEmployeePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = "light"; // Default to light
    const body = document.querySelector("body");
    body.setAttribute("data-theme-version", savedTheme); // Apply theme to body
  }, []);

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple clicks

    if (employeePassword !== confirmPassword) {
      showErrorAlert("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const formData = {
      resetToken: token,
      newPassword: employeePassword,
    };

    try {
      const response = await axios.post("/api/employee/resetpassword", formData);
      showSuccessAlert(response.data.msg);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      showErrorAlert(error.response?.data?.error || "Failed to Reset Password");
    } finally {
      setIsSubmitting(false); // Re-enable button after request
    }
  };

  return (
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
            color: #000 !important;
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
                    <h4>
                      <img src="/images/Primevertex--Logo-light.png" alt="" />
                    </h4>
                  </a>
                  <form className="mt-5 mb-5 login-input" onSubmit={handleSubmit}>
                    <h3 style={{ color: "black", fontWeight: "500" }}>Reset Password</h3>
                    <div className="form-group" style={{ position: "relative" }}>
                      <input
                        style={{ color: "black" }}
                        type={passwordVisible ? "text" : "password"}
                        className="form-control"
                        placeholder="Password"
                        value={employeePassword}
                        onChange={(e) => setEmployeePassword(e.target.value)}
                      />
                      <input
                        style={{ color: "black" }}
                        type={passwordVisible ? "text" : "password"}
                        className="form-control"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "75%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "black",
                        }}
                      >
                        <i className={`fa-solid ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`}></i>
                      </span>
                    </div>
                    <button
                      className="btn login-form__btn submit w-100"
                      type="submit"
                      style={{ backgroundColor: "#0d6efd" }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Reset Password"}
                    </button>
                    <span className="btn">
                      <Link to="/login" style={{ color: "black", fontWeight: "800" }}>
                        Go Back to Login Page?
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
  );
};

export default ResetPassword;