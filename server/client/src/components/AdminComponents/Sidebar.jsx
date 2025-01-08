import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import './sidebar.css'

const Sidebar = () => {
  // State to manage the visibility of submenus
  const [openMenu, setOpenMenu] = useState(null);

  // Function to toggle the menu visibility
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  

  return (
    <>
      {/* <!--**********************************
            Sidebar start
        ***********************************--> */}
      {/* <div className="nk-sidebar" style={{ height: "100% !important"}}> */}
      {/* <div className="nk-sidebar"   style={{ height: "100%" , backgroundColor:"#1b2b42 iMPORTANT"}}  ref={(el) => {
    if (el) el.style.setProperty('height', '100%', 'important');
    if (el) el.style.setProperty('backgroundColor', '#1b2b42', 'important');
  }}> */}
  <div
  className="nk-sidebar"
  style={{ height: "100%" , backgroundColor:"#1b2b42"}}
  ref={(el) => {
    if (el) el.style.setProperty('height', '100%', 'important');
    if (el) el.style.setProperty('backgroundColor', '#1b2b42', 'important');
  }}
>

        {/* <div className="nk-nav-scroll"> */}
          <ul className="metismenu" id="menu">
            <li className='mt-3' >
              {/* #1d2c42 */}
              <Link to="/" aria-expanded="false">
                <i class="fa-solid fa-gauge-high"></i><span class="nav-text" >Dashboard</span>
              </Link>
            </li>
            {/* Expo Events Menu */}

            {/* Apps Menu */}
            {/* <li class="nav-label">Employee</li> */}

            <li>
              <a
                className="has-arrow"

                aria-expanded={openMenu === 'roles'}
                onClick={() => toggleMenu('roles')}
              >
                <i class="fa-solid fa-user-shield"></i>
                <span className="nav-text">Roles</span>
              </a>
              {openMenu === 'roles' && (
                <ul>
                  <li>
                    <Link to="/showrole">Show Roles</Link>
                  </li>
                  <li>
                    <Link to="/addrole">Add Roles</Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <a
                className="has-arrow"

                aria-expanded={openMenu === 'employee'}
                onClick={() => toggleMenu('employee')}
              >
                <i class="fa-solid fa-user-group"></i>
                <span className="nav-text">Employee</span>
              </a>
              {openMenu === 'employee' && (
                <ul>
                  <li>
                    <Link to="/showemployee">Show Employee</Link>
                  </li>
                  <li>
                    <Link to="/showdeletedemployee">Show Deleted Employee</Link>
                  </li>
                  <li>
                    <Link to="/addemployee">Add Employee</Link>
                  </li>
                </ul>
              )}
            </li>
            {/* <li class="nav-label">Expance</li> */}
            <li>
              <a
                className="has-arrow"

                aria-expanded={openMenu === 'ExpanceCategory'}
                onClick={() => toggleMenu('ExpanceCategory')}
              >
                <i class="fa-solid fa-layer-group"></i>
                <span className="nav-text">Expance Category</span>
              </a>
              {openMenu === 'ExpanceCategory' && (
                <ul>
                  <li>
                    <Link to="/showexpanceCategory">Show Expance Category</Link>
                  </li>
                  <li>
                    <Link to="/addexpanceCategory">Add Expance Category</Link>
                  </li>
                </ul>
              )}
            </li>
            
            <li>
              <a
                className="has-arrow"

                aria-expanded={openMenu === 'apps'}
                onClick={() => toggleMenu('apps')}
              >
                <i class="fa-solid fa-sack-dollar"></i>
                <span className="nav-text">Expance</span>
              </a>
              {openMenu === 'apps' && (
                <ul>
                  <li>
                    <Link to="/showexpance">Show Expance</Link>
                  </li>
                  <li>
                    <Link to="/addexpance">Add Expance</Link>
                  </li>
                </ul>
              )}
            </li>
            {/* <li class="nav-label">Apps</li> */}
            <li>
              <a
                className="has-arrow"

                aria-expanded={openMenu === 'attendance'}
                onClick={() => toggleMenu('attendance')}
              >
                <i class="fa-regular fa-calendar-days"></i>
                <span className="nav-text">Attendance</span>
              </a>
              {openMenu === 'attendance' && (
                <ul>
                  <li>
                    <Link to="/showattendance">Attendence History</Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <a
                className="has-arrow"

                aria-expanded={openMenu === 'salary'}
                onClick={() => toggleMenu('salary')}
              >
                {/* <i class="fa-solid fa-user-shield"></i> */}
                <i class="fa-solid fa-hand-holding-dollar"></i>
                <span className="nav-text">Salary</span>
              </a>
              {openMenu === 'salary' && (
                <ul>
                  <li>
                    <Link to="/showSalaries">Salary History</Link>
                  </li>
                  <li>
                    <Link to="/SelectSalaryusers">Pay Salary</Link>
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