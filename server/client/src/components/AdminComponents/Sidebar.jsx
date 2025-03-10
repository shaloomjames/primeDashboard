import React, { useState } from "react";
import { Link } from "react-router-dom";
// import './sidebar.css'

const Sidebar = () => {
  // State to manage the visibility of submenus
  const [openMenu, setOpenMenu] = useState(null);

  // Function to toggle the menu visibility
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // State to track hover effect
  const [isHovered, setIsHovered] = useState(false);

  // Inline style for the span
  const spanStyle = {
    color: isHovered ? "#fff" : "#ffffff", // Change color on hover
    transition: "color 0.3s ease", // Smooth transition
  };

  return (
    <>
      {/* <!--**********************************
            Sidebar start
        ***********************************--> */}
      <div
        style={{ opacity: "70%" }}
        className="nk-sidebar"
        // style={{ height: "100%" , backgroundColor:"#1b2b42"}}
        ref={(el) => {
          if (el) el.style.setProperty("height", "100%", "important");
          // if (el) el.style.setProperty('backgroundColor', '#1b2b42', 'important');
        }}
      >
        {/* <div className="nk-nav-scroll"> */}
        <ul className="metismenu" id="menu">
          <li className="mt-3">
            {/* #1d2c42 */}
            <Link
              to="/"
              onMouseEnter={() => setIsHovered(true)} // Set hover state
              onMouseLeave={() => setIsHovered(false)} // Remove hover state
              aria-expanded="false"
            >
              <i class="fa-solid fa-gauge-high" style={spanStyle}></i>
              <span style={spanStyle} class="nav-text">
                Dashboard
              </span>
            </Link>
          </li>
          {/* Expo Events Menu */}

          {/* Apps Menu */}
          {/* <li class="nav-label">Employee</li> */}

          <li>
            <a
              className="has-arrow"
              aria-expanded={openMenu === "roles"}
              onClick={() => toggleMenu("roles")}
            >
              <i class="fa-solid fa-user-shield"></i>
              <span
                className="nav-text"
                onMouseEnter={() => setIsHovered(true)} // Set hover state
                onMouseLeave={() => setIsHovered(false)} // Remove hover state
                style={spanStyle}
              >
                Roles
              </span>
            </a>
            {openMenu === "roles" && (
              <ul>
                <li>
                  <Link
                    to="/showrole"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Show Roles
                  </Link>
                </li>
                <li>
                  <Link
                    to="/addrole"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Add Roles
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a
              className="has-arrow"
              aria-expanded={openMenu === "employee"}
              onClick={() => toggleMenu("employee")}
            >
              <i class="fa-solid fa-user-group"></i>
              <span
                className="nav-text"
                onMouseEnter={() => setIsHovered(true)} // Set hover state
                onMouseLeave={() => setIsHovered(false)} // Remove hover state
                style={spanStyle}
              >
                Employee
              </span>
            </a>
            {openMenu === "employee" && (
              <ul>
                <li>
                  <Link
                    to="/showemployee"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Show Employee
                  </Link>
                </li>
                <li>
                  <Link
                    to="/showdeletedemployee"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Show Deleted Employee
                  </Link>
                </li>
                <li>
                  <Link
                    to="/addemployee"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Add Employee
                  </Link>
                </li>
              </ul>
            )}
          </li>
          {/* <li class="nav-label">Expance</li> */}
          <li>
            <a
              className="has-arrow"
              aria-expanded={openMenu === "ExpanceCategory"}
              onClick={() => toggleMenu("ExpanceCategory")}
            >
              <i class="fa-solid fa-layer-group"></i>
              <span
                className="nav-text"
                onMouseEnter={() => setIsHovered(true)} // Set hover state
                onMouseLeave={() => setIsHovered(false)} // Remove hover state
                style={spanStyle}
              >
                Expance Category
              </span>
            </a>
            {openMenu === "ExpanceCategory" && (
              <ul>
                <li>
                  <Link
                    to="/showexpanceCategory"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Show Expance Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/addexpanceCategory"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Add Expance Category
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a
              className="has-arrow"
              aria-expanded={openMenu === "apps"}
              onClick={() => toggleMenu("apps")}
            >
              <i class="fa-solid fa-sack-dollar"></i>
              <span
                className="nav-text"
                onMouseEnter={() => setIsHovered(true)} // Set hover state
                onMouseLeave={() => setIsHovered(false)} // Remove hover state
                style={spanStyle}
              >
                Expance
              </span>
            </a>
            {openMenu === "apps" && (
              <ul>
                <li>
                  <Link
                    to="/showexpance"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Show Expance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/addexpance"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Add Expance
                  </Link>
                </li>
              </ul>
            )}
          </li>
          {/* <li class="nav-label">Apps</li> */}
          <li>
            <a
              className="has-arrow"
              aria-expanded={openMenu === "attendance"}
              onClick={() => toggleMenu("attendance")}
            >
              <i class="fa-regular fa-calendar-days"></i>
              <span
                className="nav-text"
                onMouseEnter={() => setIsHovered(true)} // Set hover state
                onMouseLeave={() => setIsHovered(false)} // Remove hover state
                style={spanStyle}
              >
                Attendance
              </span>
            </a>
            {openMenu === "attendance" && (
              <ul>
                <li>
                  <Link
                    to="/showattendance"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Attendence History
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mark-absence-date"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Mark Absent for Day
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mark-absence-month"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Mark Absent for Month
                  </Link>
                </li>
              </ul>
            )}
          </li>


          <li>
            <a
              className="has-arrow"
              aria-expanded={openMenu === "leave"}
              onClick={() => toggleMenu("leave")}
            >
              <i className="fa-solid fa-calendar-day"></i>
              <span
                className="nav-text"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={spanStyle}
              >
                Leave and Leave Types
              </span>
            </a>
            {openMenu === "leave" && (
              <ul>
                <li>
                  <Link
                    to="/manage-leave-request"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={spanStyle}
                  >
                    Manage Leave Requests
                  </Link>
                </li>
                <li>
                  <Link
                    to="/show-leavetype"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={spanStyle}
                  >
                    Show Leave Type
                  </Link>
                </li>
                <li>
                  <Link
                    to="/add-leavetype"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={spanStyle}
                  >
                    Add Leave Type
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a
              className="has-arrow"
              aria-expanded={openMenu === "Holiday"}
              onClick={() => toggleMenu("Holiday")}
            >
              <i className="fa-solid fa-calendar-day"></i>
              <span
                className="nav-text"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={spanStyle}
              >
                 Holiday
              </span>
            </a>
            {openMenu === "Holiday" && (
              <ul>
                <li>
                  <Link
                    to="/holiday-calendar"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={spanStyle}
                  >
                    Holiday Calendar
                  </Link>
                </li>
                <li>
                  <Link
                    to="/add-holiday"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={spanStyle}
                  >
                    Add Holiday
                  </Link>
                </li>
              </ul>
            )}
          </li>
          

          <li>
            <a
              className="has-arrow"
              aria-expanded={openMenu === "salary"}
              onClick={() => toggleMenu("salary")}
            >
              {/* <i class="fa-solid fa-user-shield"></i> */}
              <i class="fa-solid fa-hand-holding-dollar"></i>
              <span
                className="nav-text"
                onMouseEnter={() => setIsHovered(true)} // Set hover state
                onMouseLeave={() => setIsHovered(false)} // Remove hover state
                style={spanStyle}
              >
                Salary
              </span>
            </a>
            {openMenu === "salary" && (
              <ul>
                <li>
                  <Link
                    to="/showSalaries"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Salary History
                  </Link>
                </li>
                <li>
                  <Link
                    to="/SelectSalaryusers"
                    onMouseEnter={() => setIsHovered(true)} // Set hover state
                    onMouseLeave={() => setIsHovered(false)} // Remove hover state
                    style={spanStyle}
                  >
                    Pay Salary
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
        {/* </div> */}
      </div>
      {/* <!--**********************************
            Sidebar end
        ***********************************--> */}
    </>
  );
};

export default Sidebar;
