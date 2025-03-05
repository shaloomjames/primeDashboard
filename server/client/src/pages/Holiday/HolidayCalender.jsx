import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2"; // Import SweetAlert2

const HolidayCalender = () => {
  // State to store the fetched holiday data
  const [holidayData, setHolidayData] = useState([]);
  // State to store records after filtering by month or search term
  const [filteredRecords, setFilteredRecords] = useState([]);
  // State to store the selected month (e.g. "2024-12")
  const [selectedMonth, setSelectedMonth] = useState("");
  // State to store search term input by the user
  const [search, setSearch] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // Helper: Format a date to "YYYY-MM-DD"
  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  // Verify token and role
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

  // Fetch holiday data from the API endpoint (adjust the URL if needed)
  useEffect(() => {
    const fetchHolidayData = async () => {
      try {
        const response = await axios.get("/api/holiday");
        setHolidayData(response.data);
        setFilteredRecords(response.data); // initially, show all records
      } catch (error) {
        console.error("Error fetching holiday data from API:", error);
      }
    };
    fetchHolidayData();
  }, []);

  // Update pagination info whenever filtered records change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredRecords.length / pageSize));
  }, [filteredRecords, pageSize]);

  // Filter records based on selected month and search term
  useEffect(() => {
    let filtered = holidayData;

    // Filter by month if one is selected
    if (selectedMonth) {
      filtered = filtered.filter((record) =>
        formatDate(record?.date).startsWith(selectedMonth)
      );
    }

    // Filter by search term (looking in Holiday Name and Holiday Description)
    if (search) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(
        (record) =>
          (record.name && record.name.toLowerCase().includes(searchLower)) ||
          (record.description &&
            record.description.toLowerCase().includes(searchLower))
      );
    }

    setFilteredRecords(filtered);
    setPage(1); // reset to the first page when filters change
  }, [search, selectedMonth, holidayData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Calculate pagination indexes
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = filteredRecords.slice(startIndex, endIndex);

  const deleteHoliday = async (holidayDeleteId) => {
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
          const response = await axios.delete(
            `/api/holiday/${holidayDeleteId}`
          );
          Swal.fire("Deleted!", response.data.msg, "success");
          setFilteredRecords((PrevData) =>
            PrevData.filter((data, index) => data._id !== holidayDeleteId)
          );
        } catch (error) {
          Swal.fire(
            "Error!",
            error.response.data.err ||
              "An unexpected error occurred. Please try again.",
            "error"
          );
          console.log("Error Deleting Employee!");
        }
      }
    });
  };

  return (
    <>
      <div className="container-fluid">
        {/* Filters */}
        <div className="row mt-1">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="row d-flex justify-content-between align-items-center mx-3 mt-2">
                  <div className="col-lg-5 col-md-5">
                    <label style={{ color: "white" }}>Select Month</label>
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Holiday Name or Description"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Holiday Records */}
        <div className="row">
          <div className="col-lg-12 mb-5">
            <div className="card">
              <div className="card-body">
                <h4>Holidays</h4>
                {/* Pagination Controls */}
                {filteredRecords.length > pageSize && (
                  <div className="mt-5 mb-2 d-flex justify-content-end">
                    <button
                      className="btn btn-sm mx-2"
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
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Holiday Name</th>
                        <th>Holiday Date</th>
                        <th>Holiday Description</th>
                        <th>Holiday Created By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length > 0 ? (
                        currentData.map((record, index) => (
                          <tr key={record._id || index}>
                            <td>{startIndex + index + 1}</td>
                            <td>{record.name || "-"}</td>
                            <td>
                              {record.date
                                ? new Date(record.date).toLocaleDateString(
                                    "en-GB"
                                  )
                                : "-"}
                            </td>
                            <td>{record.description || "-"}</td>
                            <td>{record?.createdBy?.employeeName || "-"}</td>
                            <td>
                              <span>
                                <Link
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Edit"
                                  to={`/update-calendar/${record._id}`}
                                >
                                  <button className="btn btn-primary btn-sm">
                                    Edit
                                  </button>
                                </Link>
                                <button
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Delete"
                                  className="btn btn-danger btn-sm mx-1 my-2"
                                  onClick={() => deleteHoliday(record._id)}
                                >
                                  Delete
                                </button>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
                            {selectedMonth === ""
                              ? search === ""
                                ? "No Holidays Found. Please select a Month."
                                : `No Holidays Found For the Search Term "${search}". Please select a Month.`
                              : search === ""
                              ? `No Holidays Found For the Selected Month ${new Date(
                                  `${selectedMonth}-01`
                                ).toLocaleString("default", {
                                  month: "long",
                                  year: "numeric",
                                })}`
                              : `No Holidays Found For the Search Term "${search}" in the Selected Month ${new Date(
                                  `${selectedMonth}-01`
                                ).toLocaleString("default", {
                                  month: "long",
                                  year: "numeric",
                                })}`}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredRecords.length > pageSize && (
                  <div className="d-flex justify-content-end">
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
        <center style={{ visibility: "hidden", height: "255px" }}>
          <div className="row"></div>
        </center>
      </div>
    </>
  );
};

export default HolidayCalender;
