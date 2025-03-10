import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";

const MarkAbsencesDate = () => {
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/markAbsences", { date });
      Swal.fire("Success", response.data.msg, "success");
    } catch (error) {
      Swal.fire("Error", error.response.data.err, "error");
    }
  };

  React.useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");
    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        const userRole = decodedToken.userrole;
        if (!(Array.isArray(userRole) && userRole.includes("Admin")) && userRole !== "Admin") {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="container-fluid">
      <button type="button" className="btn mb-3 btn-primary" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left-long" style={{fontSize: "20px",fontWeight: "900"}}></i>
      </button>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Mark Absences</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Mark Absences</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAbsencesDate;