import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployeeSidebar = () => {
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
      <div className="nk-sidebar" style={{ height: "100%"}}>
        <div className="nk-nav-scroll">
          <ul className="metismenu" id="menu">
            <li className='mt-3' >
              {/* #1d2c42 */}
              <Link to="/employee" aria-expanded="false">
                <i class="fa-solid fa-gauge-high"></i><span class="nav-text" >Dashboard</span>
              </Link>
            </li>
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
                    <Link to="/employee/showattendance">Attendence History</Link>
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
                <i class="fa-solid fa-hand-holding-dollar"></i>
                <span className="nav-text">Salary</span>
              </a>
              {openMenu === 'salary' && (
                <ul>
                  <li>
                    <Link to="/employee/showsalary">Salary History</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a
                className="has-arrow"

                aria-expanded={openMenu === 'profile'}
                onClick={() => toggleMenu('profile')}
              >
                <i class="fa-regular fa-id-card"></i>
                <span className="nav-text">Profile</span>
              </a>
              {openMenu === 'profile' && (
                <ul>
                  <li>
                    <Link to="/employee/showprofile">Profile</Link>
                  </li>
                </ul>
              )}
            </li>

          </ul>
        </div>
      </div>
      {/* <!--**********************************
            Sidebar end
        ***********************************--> */}
    </>
  );
};

export default EmployeeSidebar;      