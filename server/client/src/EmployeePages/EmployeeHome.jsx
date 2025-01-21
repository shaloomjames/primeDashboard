import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./employee.css";
import { useNavigate } from "react-router-dom";

const IN_TIME = "21:00"; // Designated Check-In Time

const EmployeeHome = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [Id, setId] = useState("");

  

  const navigate = useNavigate();

      const showErrorAlert = (message) => {
          Swal.fire({ icon: 'error', title: 'Oops...', text: message });
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

      
  // secure page
  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");

    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken); // Decode the JWT token
        const userRole = decodedToken.userrole;   // Get the user role(s)
        setId(decodedToken.userid)
        // Redirect to login if the user is not an Admin
        if (
          !(Array.isArray(userRole) && userRole.includes("Employee")) && // Array case
          userRole !== "Employee"                                       // String case
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
  }, [navigate,Id]);


  // Helper function to format date
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Helper function to format time
  const formatTime = (date) => date.toTimeString().split(" ")[0].slice(0, 5);

  // Helper function to calculate minutes late 8  30
  const getMinutesLate = (currentTime, targetTime) => {
    const [currentHours, currentMinutes] = currentTime.split(":").map(Number);
    const [targetHours, targetMinutes] = targetTime.split(":").map(Number);

    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    const targetTotalMinutes = targetHours * 60 + targetMinutes;

    return Math.max(0, currentTotalMinutes - targetTotalMinutes); // Ensure non-negative result
  };


  // Initialize the current date
  useEffect(() => {
    const today = new Date();
    setCurrentDate(formatDate(today));
  }, []);

  // Handle Check-In
  const markCheckIn = async () => {
    try {
      const now = new Date();
      const currentTime = formatTime(now);
      const lateBy = currentTime > IN_TIME ? getMinutesLate(currentTime, IN_TIME) : 0;
      const userToken = Cookies.get("UserAuthToken");
      if (!userToken) throw new Error("User not authenticated.");

      const decodedToken = jwtDecode(userToken);
      const userId = decodedToken.userid;
      
      const attendance = {
        employee: userId, // Replace with dynamic employee ID
        attendanceDate: currentDate,
        timeIn: now.toISOString(),
        status: lateBy > 0 ? "Late" : "On Time",
        lateBy,
      };

      const response = await axios.post("/api/attendance", attendance);
      setAttendanceStatus(response.data.attendance);
      showSuccessAlert(response?.data?.msg || "Failed to add Attendance");
    } catch (error) {
      console.error("Error during Check-In:", error.response?.data || error.message);
      showErrorAlert(error.response?.data?.err || "Failed to add Attendance");
    }
  };

  // Handle Check-Out
  const markCheckOut = async () => {
    try {
      const now = new Date();
      const response = await axios.put(`/api/attendance/${attendanceStatus._id}`, { timeOut: now.toISOString() }
      );
      setAttendanceStatus(response.data.attendance);
      showSuccessAlert(response?.data?.msg || "Failed to add Attendance");
    } catch (error) {
      showErrorAlert(error.response?.data?.err || "Failed to add Attendance");
      console.error("Error during Check-Out:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <center className=" card py-5">
        <div className="row">

          <div className="col-lg-12 text-center">
            <h2>Attendance Tracker</h2>
            <p>Mark your attendance for the day.</p>
            <p>Date: {currentDate}</p>
          </div>

          <div className="row mt-4" style={{ width: "100vw", display: "flex", justifyContent: "space-between" }}>
            {/* Check-In and Check-Out Buttons */}
            <div className="col-md-6 mt-2">
              <button onClick={markCheckIn} disabled={!!attendanceStatus} className="btn btn-success ">Check-In
              </button>
            </div>
            <div className="col-md-6 mt-2">
              <button onClick={markCheckOut} disabled={!attendanceStatus || !!attendanceStatus.timeOut} className="btn btn-primary ">
                Check-Out
              </button>
            </div>
          </div>


          {attendanceStatus && (
            <div className={`mt-3`} style={{ width: "100vw", display: "flex",flexDirection:"column", justifyContent: "space-between"}}>
              <p>  
                <p style={{display:"inline",fontWeight:"900"}}>Status:</p> {attendanceStatus.status}
              </p>
              <p>
                <p style={{display:"inline",fontWeight:"900"}}>Check-In:</p>{" "}
                {new Date(attendanceStatus.timeIn).toLocaleTimeString()}
              </p>
              {attendanceStatus.timeOut && (
                <p>
                  <p style={{display:"inline",fontWeight:"900"}}>Check-Out:</p>{" "}
                  {new Date(attendanceStatus.timeOut).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}

        </div ></center>
    </div>
  );
};

export default EmployeeHome;