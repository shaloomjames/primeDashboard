import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';     // Corrected to js-cookie
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  const navigate = useNavigate();
  const notify = (error) => toast.error(error);
  const successNotify = (success) => toast.success(success);

  // Function to toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = isDark ? 'dark' : 'dark'; // Toggle between light and dark themes
    setIsDark(!isDark); // Update the state
    const body = document.querySelector('body');
    body.setAttribute('data-theme-version', newTheme); // Set the body theme attribute

    // Store the selected theme in localStorage
    localStorage.setItem('theme', newTheme);
  };

  // Check for saved theme preference in localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to light if not found
    setIsDark(savedTheme === 'dark'); // Set the theme state based on saved value

    // Set the body attribute for the theme
    const body = document.querySelector('body');
    body.setAttribute('data-theme-version', savedTheme); // Apply theme to body
  }, []);

  //   const handleLogout = () => {
  //     Cookies.remove("UserAuthToken");
  //     navigate("/login");
  // };


  return (
    <>
      {/* Navbar Header */}
      {/* <div className="nav-header" style={{ backgroundColor: isDark ? 'rgb(29 44 66)' : 'rgb(252 252 252)',opacity:"70%" }}> */}
      <div className="nav-header" style={{ backgroundColor: isDark ? 'rgb(29 44 66)' : 'rgb(29 44 66)',opacity:"70%" }}>
        <div className="brand-logo" >
          <Link to="/">
            <b className="logo-abbr">
              <img src="/images/Primevertex--mini.png" style={{ position: "relative", right: "7px", width: "auto", height: "100%" }} alt="" className='img-fluid' />
            </b>
            {/* <span className="logo-compact">
              <img src="/images/Primevertex--Logo-light.png" alt="" />
               <img src="/images//images/Primevertex-Logo-01-dark.png" alt="" />
             </span>  */}
            <span className="brand-title" >
              {/* <img src={`${isDark ? "/images/Primevertex-Logo-01-dark.png" : "/images/Primevertex--Logo-light.png"}`} className='img-fluid' alt="" style={{ height: "auto", width: "100%", position: "relative", bottom: "20px", top: "-13px" }} /> */}
              <img src={`${isDark ? "/images/Primevertex-Logo-01-dark.png" : "/images/Primevertex-Logo-01-dark.png"}`} className='img-fluid' alt="" style={{ height: "auto", width: "100%", position: "relative", bottom: "20px", top: "-13px" }} />
            </span>
          </Link>
        </div>
      </div>

      {/* Header Content */}
      <div className="header" style={{opacity:"70%"}}>
        <div className="header-content clearfix">
          <div className="nav-control">
            <div
              className="hamburger"
              onClick={() => {
                const body = document.querySelector('body');
                const currentSidebarStyle = body.getAttribute('data-sidebar-style');

                if (currentSidebarStyle === 'vertical') {
                  body.setAttribute('data-sidebar-style', 'mini');
                } else {
                  body.setAttribute('data-sidebar-style', 'vertical');
                }
              }}
            >
              <span className="toggle-icon">
                <i
                  className="icon-menu"
                  // style={{ color: isDark ? 'white' : 'black' }} // Change color based on isDark
                  style={{ color:  'white' }} // Change color based on isDark
                ></i>
              </span>
            </div>
          </div>
          <div className="header-right">
            <ul className="clearfix">
              {/* <li className="icons">
                <i
                  className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}`}
                  style={{ fontSize: '25px', margin: '3px 3px 6px 3px', cursor: 'pointer' }}
                  onClick={toggleTheme} // Call toggle theme on click
                ></i>
              </li> */}
              <li class="icons dropdown" >
                <div class="user-img c-pointer position-relative" data-toggle="dropdown">
                  {/* <img src="data:image/png;base64,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" height="40" width="40" alt="" /> */}
                  <img src="/images/Primevertex--mini.png" style={{backgroundColor:"white",paddingRight:'3px'}} height="40" width="40" alt="" />
                </div>
                <div class="drop-down dropdown-profile animated fadeIn dropdown-menu">
                  <div class="dropdown-content-body">
                    <ul>
                      <li style={{ backgroundColor: "transparent" }}>
                        <Link to={'/employee/showprofile'} ><i class="fa-solid fa-user"></i> <span style={{ color: "black" }} className="menu-text">Profile</span></Link>
                      </li>
                      <hr class="my-2" />
                      <li style={{ backgroundColor: "transparent" }}>
                        <Link to="/logout">
                          <i className="fa-solid fa-lock"></i>
                          <span className="menu-text logout-text" style={{ color: "black" }} >Logout</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Navbar;
