import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Modal.css"; // Custom CSS for the modal

const ShowExpance = () => {
  const [ExpanceData, setExpanceData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [selectedExpance, setSelectedExpance] = useState(null); // State for modal data
  const [CategoryFilter, setCategoryFilter] = useState(""); // State to store selected category filter

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");
    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        const userRole = decodedToken.userrole;
        if (
          !(Array.isArray(userRole) && userRole.includes("Admin")) &&
          userRole !== "Admin"
        ) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchExpance = async () => {
      try {
        const res = await axios.get("/api/expance");
        setExpanceData(res.data);
      } catch (error) {
        console.log("Error Fetching Expance Data", error);
      }
    };
    fetchExpance();
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

  const deleteExpance = async (expanceid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/api/expance/${expanceid}`);
          setExpanceData(
            ExpanceData.filter((expance) => expance._id !== expanceid)
          );
          Swal.fire("Deleted!", response.data.msg, "success");
        } catch (error) {
          Swal.fire(
            "Error",
            error?.response?.data?.err ||
              "An unexpected error occurred. Please try again.",
            "error"
          );
          console.error("Error deleting expance:", error);
        }
      }
    });
  };

  useEffect(() => {
    const filteredExpances = ExpanceData.filter((expance) => {
      const expanceDate = new Date(expance.expanceDate);
      const startDate = startingDate ? new Date(startingDate) : null;
      const endDate = endingDate ? new Date(endingDate) : null;

      const isWithinDateRange =
        (!startDate || expanceDate >= startDate) &&
        (!endDate || expanceDate <= endDate);

      const matchesCategory = CategoryFilter
        ? expance.expanceCategory?.ExpanceCategoryName.toLowerCase().includes(
            CategoryFilter.toLowerCase()
          )
        : true;

      return (
        isWithinDateRange &&
        matchesCategory &&
        ((expance.expanceName || "")
          .toLowerCase()
          .includes(search.toLowerCase().trim()) ||
          (expance.addedBy.employeeName || "")
            .toLowerCase()
            .includes(search.toLowerCase().trim()))
      );
    });

    setFilteredData(filteredExpances);
  }, [search, ExpanceData, startingDate, endingDate, CategoryFilter]);

  const allCategories = [
    ...new Set(
      ExpanceData.map((expance) => expance.expanceCategory?.ExpanceCategoryName)
    ),
  ];

  const clearFilters = () => {
    setSearch("");
    setStartingDate("");
    setEndingDate("");
  };

  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  console.log(
    "current data found",
    currentData.map((date) => date.expanceDate)
  );

  return (
    <div className="container-fluid">
      <div
        className="row"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "3%",
        }}
      >
        <Link type="button" className="btn mb-1 btn-primary" to="/addexpance">
          Add Expance
          <span className="btn-icon-right">
            <i className="fa-solid fa-sack-dollar"></i>
          </span>
        </Link>
      </div>
      <div className="row mt-1">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row mt-2">
                <div className="col-lg-4 col-md-5 col-sm-6 mt-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Expance Name or Added By"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-lg-3 col-md-5 col-sm-5 mt-5">
                  <select
                    id="inputState"
                    className="form-control"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option disabled selected>
                      Search By Category
                    </option>
                    <option value={""}>All</option>
                    {allCategories.length > 0 ? (
                      allCategories.map((category, index) => (
                        <option value={category || ""} key={index}>
                          {category || "N/A"}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Categories Available</option>
                    )}
                  </select>
                </div>

                <div className="col-lg-5 col-md-10 col-sm-11 mt-3">
                  <div className="row" style={{ marginRight: "10px" }}>
                    <div className="col-lg-4 col-md-5 col-sm-4">
                      <label>Starting Date:</label>
                      <input
                        type="date"
                        className="form-control"
                        value={startingDate}
                        onChange={(e) => setStartingDate(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-4 col-md-5 col-sm-4">
                      <label>Ending Date:</label>
                      <input
                        type="date"
                        className="form-control"
                        value={endingDate}
                        onChange={(e) => setEndingDate(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-3 col-md-1 col-sm-2 d-flex align-items-end mt-2">
                      <button
                        className="btn btn-primary"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
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
              <h4 className="card-title">Expances</h4>
              {/* Pagination Controls */}
              {filteredData.length > pageSize && (
                <div className="mt-5 mb-2 d-flex  justify-content-end">
                  <button
                    className="btn mx-2 btn-sm"
                    onClick={() => handlePageChange(1)}
                    disabled={page <= 1}
                  >
                    First
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    Prev
                  </button>
                  <span className="mx-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                  <button
                    className="btn mx-2 btn-sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page >= totalPages}
                  >
                    Last
                  </button>
                </div>
              )}

              <div className="table-responsive table-hover">
                <table className="table header-border">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Expance Image</th>
                      <th>Expance Name</th>
                      <th>Expance Category</th>
                      <th>Expance Date</th>
                      <th>Expance Added By</th>
                      <th>Expance Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((expance, index) => (
                        <tr key={index}>
                          <td>{startIndex + index + 1}</td>{" "}
                          {/* Correct index calculation */}
                          <td>
                            <img
                              src={
                                expance.expanceImage &&
                                expance.expanceImage !== "null"
                                  ? `/uploads/ExpanceImg/${expance.expanceImage}`
                                  : "/uploads/ExpanceImg/defaultExpance.jpg"
                              }
                              width={90}
                              height={90}
                              className="expance-img"
                              alt={expance.expanceName || "Default Expance"}
                            />
                          </td>
                          <td>{expance.expanceName}</td>
                          <td>
                            {expance.expanceCategory?.ExpanceCategoryName}
                          </td>
                          <td>
                            {new Date(expance.expanceDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td>{expance?.addedBy?.employeeName || "N/A"}</td>
                          <td>{expance.expanceAmount}</td>
                          <td>
                            <Link
                              to={`/updateexpance/${expance._id}`}
                              className="btn btn-primary btn-sm my-2"
                            >
                              <i className="fa fa-pencil color-muted mx-2"></i>{" "}
                              Edit
                            </Link>
                            <button
                              className="btn btn-danger btn-sm mx-2"
                              onClick={() => deleteExpance(expance._id)}
                            >
                              <i className="fa fa-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No Expances Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="mt-5">
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <b>Grand Total</b>
                      </td>
                      <td>
                        <strong>
                          Rs :{" "}
                          {filteredData.reduce(
                            (acc, expance) =>
                              acc + (expance.expanceAmount || 0),
                            0
                          )}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {/* Pagination Controls */}
              {filteredData.length > pageSize && (
                <div className="d-flex  justify-content-end">
                  <button
                    className="btn mx-2 btn-sm"
                    onClick={() => handlePageChange(1)}
                    disabled={page <= 1}
                  >
                    First
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    Prev
                  </button>
                  <span className="mx-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                  <button
                    className="btn mx-2 btn-sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page >= totalPages}
                  >
                    Last
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <center className=" card py-5" style={{ visibility: "hidden" }}>
        <div className="row"></div>
      </center>
    </div>
  );
};

export default ShowExpance;
