import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddAttendance = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [attendanceDate, setattendanceDate] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [totalHoursPerMonth, setTotalHoursPerMonth] = useState('');


  const navigate = useNavigate();

  

  const notify = (error) => toast.error(error);
  const successNotify = (success) => toast.success(success);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      employeeName,
      employeeEmail,
      timeIn,
      timeOut,
      attendanceDate,
      totalHours,
      totalHoursPerMonth
    }
    try {
      const res = await axios.post("http://localhost:5000/api/attendance", formData);
      successNotify(res.data.msg)
      setTimeout(() => {
        navigate("showattendance")
      }, 4000);
    } catch (error) {
      notify(error.res?.data?.err || "Failed to add attendance");
    }
  }

  return (
    <>
      <div class="container-fluid">
        <Link type="button" class="btn mb-3 btn-primary" onClick={() => navigate(-1)} >
          <i class="fa-solid fa-arrow-left-long" style={{ fontSize: "20px", fontWeight: "900" }}></i>
        </Link>
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Add Attendance</h4>
                <div class="basic-form">
                  <form onSubmit={handleSubmit} >
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label>Employee Name:</label>
                        <input type="text" class="form-control" placeholder="Employee Name" onChange={(e) => setEmployeeName(e.target.value)} />
                      </div>
                      <div class="form-group col-md-6">
                        <label>Employee Email: </label>
                        <input type="email" class="form-control" placeholder="Employee Email" onChange={(e) => setEmployeeEmail(e.target.value)} />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label>Time In:</label>
                        <input type="time" class="form-control" placeholder="Time In" onChange={(e) => setTimeIn(e.target.value)} />
                      </div>
                      <div class="form-group col-md-6">
                        <label>Time Out: </label>
                        <input type="time" class="form-control" placeholder="Time Out" onChange={(e) => setTimeOut(e.target.value)} />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label>attendanceDate :</label>
                        <input type="date" class="form-control" placeholder="Date" onChange={(e) => setattendanceDate(e.target.value)} />
                      </div>
                      <div class="form-group col-md-6">
                        <label>Total Hours: </label>
                        <input min={0} type="number" class="form-control" placeholder="Total Hours" onChange={(e) => setTotalHours(e.target.value)} />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-12">
                        <label>Total Hours Per Month: </label>
                        <input min={0} type="number" class="form-control" placeholder="Total Hours Per Month" onChange={(e) => setTotalHoursPerMonth(e.target.value)} />
                      </div>
                    </div>
                    <button type="submit" class="btn btn-dark">Add Attendance</button>
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

export default AddAttendance