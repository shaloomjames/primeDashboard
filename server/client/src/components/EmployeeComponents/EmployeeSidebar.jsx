import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import '../AdminComponents/sidebar.css'
const EmployeeSidebar = () => {
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
    color: isHovered ? '#fff' : '#ffffff',  // Change color on hover
    transition: 'color 0.3s ease',  // Smooth transition
  };
  

  return (
    <>
      {/* <!--**********************************
            Sidebar start
        ***********************************--> */}
    <div
  className="nk-sidebar"
  ref={(el) => {
    if (el) el.style.setProperty('height', '100%', 'important');
  }} style={{opacity:"70%"}}
>
        <div className="nk-nav-scroll">
          <ul className="metismenu" id="menu">
            <li className='mt-3' >
              {/* #1d2c42 */}
              <Link to="/employee" aria-expanded="false"
                               onMouseEnter={() => setIsHovered(true)}  // Set hover state
                               onMouseLeave={() => setIsHovered(false)} // Remove hover state              
              >
                <i class="fa-solid fa-gauge-high" style={spanStyle} ></i><span style={spanStyle} class="nav-text" >Dashboard</span>
              </Link>
            </li>
            <li>
              <a
                className="has-arrow"

                aria-expanded={openMenu === 'attendance'}
                onClick={() => toggleMenu('attendance')}
              >
                <i class="fa-regular fa-calendar-days"></i>
                <span className="nav-text" 
                                  onMouseEnter={() => setIsHovered(true)}  // Set hover state
                                  onMouseLeave={() => setIsHovered(false)} // Remove hover state
                                  style={spanStyle}                
                >Attendance</span>
              </a>
              {openMenu === 'attendance' && (
                <ul>
                  <li>
                    <Link to="/employee/showattendance"
                                      onMouseEnter={() => setIsHovered(true)}  // Set hover state
                                      onMouseLeave={() => setIsHovered(false)} // Remove hover state
                                      style={spanStyle}                    
                    >Attendence History</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className='mt-1'>
              <a
                className="has-arrow"
                aria-expanded={openMenu === 'salary'}
                onClick={() => toggleMenu('salary')}
              >
                <i class="fa-solid fa-hand-holding-dollar"></i>
                <span className="nav-text"
                                  onMouseEnter={() => setIsHovered(true)}  // Set hover state
                                  onMouseLeave={() => setIsHovered(false)} // Remove hover state
                                  style={spanStyle}                
                >Salary</span>
              </a>
              {openMenu === 'salary' && (
                <ul>
                  <li>
                    <Link to="/employee/showsalary"
                                      onMouseEnter={() => setIsHovered(true)}  // Set hover state
                                      onMouseLeave={() => setIsHovered(false)} // Remove hover state
                                      style={spanStyle}                    
                    >Salary History</Link>
                  </li>
                </ul>
              )}
            </li  >
            <li className='mt-1'>
              <a
                className="has-arrow"

                aria-expanded={openMenu === 'profile'}
                onClick={() => toggleMenu('profile')}
              >
                <i class="fa-regular fa-id-card"></i>
                <span className="nav-text" 
                                  onMouseEnter={() => setIsHovered(true)}  // Set hover state
                                  onMouseLeave={() => setIsHovered(false)} // Remove hover state
                                  style={spanStyle}                
                >Profile</span>
              </a>
              {openMenu === 'profile' && (
                <ul>
                  <li>
                    <Link to="/employee/showprofile"
                                      onMouseEnter={() => setIsHovered(true)}  // Set hover state
                                      onMouseLeave={() => setIsHovered(false)} // Remove hover state
                                      style={spanStyle}                    
                    >Profile</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className='mt-1'>
  <a
    className="has-arrow"
    aria-expanded={openMenu === 'leaveHoliday'}
    onClick={() => toggleMenu('leaveHoliday')}
  >
    <i className="fa-solid fa-calendar-day"></i>
    <span className="nav-text" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={spanStyle}
    >Leave & Holiday</span>
  </a>
  {openMenu === 'leaveHoliday' && (
    <ul>
      <li>
        <Link to="/employee/request-leave"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={spanStyle}
        >Request Leave</Link>
      </li>
      <li>
        <Link to="/employee/leave-history"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={spanStyle}
        >Leave History</Link>
      </li>
      <li>
        <Link to="/employee/view-holidays"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={spanStyle}
        >View Holidays</Link>
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