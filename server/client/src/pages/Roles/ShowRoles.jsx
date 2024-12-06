import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode
import Cookies from 'js-cookie';
import Swal from "sweetalert2"; // Import SweetAlert2

const ShowRoles = () => {
  const [RoleData, setRoleData] = useState([]); // Raw roles data
  const [search, setSearch] = useState(""); // State to store search query
  const [statusFilter, setStatusFilter] = useState(""); // State to store selected status
  const [filteredData, setFilteredData] = useState([]); // State for filtered data

  const navigate = useNavigate();

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
    const fetchRole = async () => {
      try {
        const res = await axios.get("/api/role");
        setRoleData(res.data);
        setFilteredData(res.data); // Initialize filtered data with all roles
      } catch (error) {
        console.error("Error Fetching Roles Data:", error);
        Swal.fire("Error", "Failed to fetch roles data. Please try again.", "error");
      }
    };
    fetchRole();
  }, []);

  useEffect(() => {
    // Update filteredData based on both search and statusFilter
    const filteredRoles = RoleData.filter((role) => {
      const matchesName = role.roleName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? role.roleStatus === statusFilter : true;
      return matchesName && matchesStatus; // Both conditions must be true
    });
    setFilteredData(filteredRoles);
  }, [search, statusFilter, RoleData]);

  const deleteRole = async (roleid) => {
    Swal.fire({
      title: "Are you sure?",
      // text: "Are you sure you want to delete this role? This action cannot be undone, and all employees assigned to this role will be removed.",
      text: "Are you sure you want to delete this role? This action will remove all employees assigned to this role.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/api/role/${roleid}`);
          setRoleData(RoleData.filter((role) => role._id !== roleid)); // Update RoleData
          Swal.fire("Deleted!", response.data.msg, "success");
        } catch (error) {
          Swal.fire("Error", error?.response?.data?.err || "An unexpected error occurred. Please try again.", "error");
          console.error("Error deleting role:", error);
        }
      }
    });
  };

  return (
    <>
      <div className="container-fluid mb-5">
      <div className="row" style={{display:"flex",justifyContent:"flex-end" ,marginRight:"3%"}}>
      <Link type="button" className="btn mb-1 btn-primary " to="/addrole">
          Add Role
          <span className="btn-icon-right">
            <i className="fa-solid fa-user-shield"></i>
          </span>
        </Link>
      </div>

        {/* Search Field */}
        <div className="row mt-3">
          <div className="col-lg-4 col-md-5 col-sm-6 col-10 my-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Role Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)} // Update search query
            />
          </div>
          <div className="form-group col-md-4  col-lg-4 col-sm-6 col-10 my-2">
            <select
              id="inputState"
              className="form-control"
              value={statusFilter} // Bind to state
              onChange={(e) => setStatusFilter(e.target.value)} // Update statusFilter
            >
              <option value="" selected disabled>Search by Role Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="">All</option>
            </select>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Roles</h4>
                <div className="table-responsive">
                  <table className="table header-border">
                    <thead>
                      <tr>
                        <th>Role Name</th>
                        <th>Role Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((role, index) => (
                          <tr key={index}>
                            <td>{role.roleName || "N/A"}</td>
                            <td>{role.roleStatus || "N/A"}</td>
                            <td>
                              <span>
                                <Link
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Edit"
                                  to={`/updaterole/${role._id}`}
                                >
                                  <button className="btn btn-primary btn-sm">
                                    <i className="fa fa-pencil color-muted mx-2"></i> Edit
                                  </button>
                                </Link>
                                <button
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Delete"
                                  className="btn btn-danger btn-sm mx-1 my-2"
                                  onClick={() => deleteRole(role._id)}
                                >
                                  <i className="fa fa-trash"></i> Delete
                                </button>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No Role Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowRoles;
