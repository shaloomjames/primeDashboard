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

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

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
  

  // Fetch roles from the API
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


  // Handle pagination logic on changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / pageSize));
  }, [filteredData, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    // Update filteredData based on both search and statusFilter
    const filteredRoles = RoleData.filter((role) => {
      const matchesName = role.roleName.toLowerCase().includes(search.toLowerCase().trim());
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


    // Pagination slice
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const currentData = filteredData.slice(startIndex, endIndex);
  
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
        <div className="row mt-1">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
        <div className="row mt-1">
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
        </div>
        </div>
        </div>
        </div>

        <div className="row mt-2">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Roles</h4>
                        {/* Pagination Controls */}
                        {filteredData.length > pageSize && ( <div className="mt-5 mb-2 d-flex  justify-content-end">
        <button className='btn btn-sm mx-2' onClick={() => handlePageChange(1)} disabled={page <= 1}>
          First
        </button>
        <button  className='btn btn-sm' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        <span className='mx-2'>
          Page {page} of {totalPages}
        </span>
        <button  className='btn btn-sm' onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
        <button  className='btn mx-2 btn-sm' onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}>
          Last
        </button>
      </div>)}
                <div className="table-responsive table-hover">
                  <table className="table header-border">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Role Name</th>
                        <th>Role Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length > 0 ? (
                        currentData.map((role, index) => (
                          <tr key={index}>
                            {/* <td>{index+1 || "N/A"}</td> */}
                            <td>{startIndex + index + 1}</td> {/* Correct index calculation */}
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
                        <tr className="my-5">
                          <td colSpan="3" className="text-center ">
                            No Role Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                {filteredData.length > pageSize &&( <div className=" d-flex  justify-content-end">
        <button className='btn mx-2 btn-sm' onClick={() => handlePageChange(1)} disabled={page <= 1}>
          First
        </button>
        <button  className='btn btn-sm' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        <span className='mx-2'>
          Page {page} of {totalPages}
        </span>
        <button  className='btn btn-sm' onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
        <button  className='btn mx-2 btn-sm' onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}>
          Last
        </button>
      </div>)}
              </div>
            </div>
          </div>
        </div>
        <center className=" card py-5" style={{visibility:"hidden"}}>
        <div className="row">
        </div ></center>
      </div>
    </>
  );
};

export default ShowRoles;
