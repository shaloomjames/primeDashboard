<!-- # Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify) -->






























// import React from 'react'

// const Sidebar = () => {
//   return (
//     <>
    
//         {/* <!--**********************************
//             Sidebar start
//         ***********************************--> */}
//         <div class="nk-sidebar">           
//             <div class="nk-nav-scroll">
//                 <ul class="metismenu" id="menu">
//                     <li className='mt-3'>
//                         <a  href="javascript:void(0)" aria-expanded="false">
//                             <i class="icon-speedometer menu-icon"></i><span class="nav-text" >Dashboard</span>
//                         </a>
//                     </li>   
//                     <li>
//                         <a href="javascript:void(0)" aria-expanded="false" >
//                             <i class="icon-screen-tablet menu-icon"></i><span class="nav-text" style={{marginRight:"110px"}}>Expance</span>
//                             <i class="fa-solid fa-angle-right"></i>
//                         </a>
//                         <ul aria-expanded="false">
//                             <li><a >Show Expance</a></li>
//                             <li><a >Add Expance</a></li>
//                         </ul>
//                     </li>
//                     <li>
//                         <a href="javascript:void(0)" aria-expanded="false" >
//                             <i class="icon-screen-tablet menu-icon"></i><span class="nav-text" style={{marginRight:"120px"}}>Roles</span>
//                             <i class="fa-solid fa-angle-right"></i>
//                         </a>
//                         <ul aria-expanded="false">
//                             <li><a >Show Roles</a></li>
//                             <li><a >Add Roles</a></li>
//                         </ul>
//                     </li>
//                     <li>
//                         <a href="javascript:void(0)" aria-expanded="false" >
//                             <i class="icon-screen-tablet menu-icon"></i><span class="nav-text" style={{marginRight:"90px"}}>Employees</span>
//                             <i class="fa-solid fa-angle-right"></i>
//                         </a>
//                         <ul aria-expanded="false">
//                             <li><a >Show Employees</a></li>
//                             <li><a >Add Employees</a></li>
//                         </ul>
//                     </li>
//                     <li>
//                         <a href="javascript:void(0)" aria-expanded="false" >
//                             <i class="icon-screen-tablet menu-icon"></i><span class="nav-text" style={{marginRight:"90px"}}>Attendance</span>
//                             <i class="fa-solid fa-angle-right"></i>
//                         </a>
//                         <ul aria-expanded="false">
//                             <li><a >Show Employees Attendance</a></li>
//                             <li><a >Add Employees Attendance</a></li>
//                         </ul>
//                     </li>
//                     <li>
//                         <a href="javascript:void(0)" aria-expanded="false">
//                             <i class="icon-notebook menu-icon"></i><span class="nav-text" style={{marginRight:"120px"}}>Pages</span>
//                             <i class="fa-solid fa-angle-right"></i>
//                         </a>
//                         <ul aria-expanded="false">
//                             <li><a href="./page-login.html">Login</a></li>
//                             <li><a href="./page-register.html">Register</a></li>
//                         </ul>
//                     </li>
//                 </ul>
//             </div>
//         </div>
//         {/* <!--**********************************
//             Sidebar end
//         ***********************************--> */}
//     </>
//   )
// }

// export default Sidebar

import React, { useState } from 'react';

const Sidebar = () => {
  // State to manage which submenu is open
  const [openMenu, setOpenMenu] = useState(null);

  // Toggle function to open/close the submenu
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <>
      {/* <!--**********************************
            Sidebar start
        ***********************************--> */}
      <div className="nk-sidebar">
        <div className="nk-nav-scroll">
          <ul className="metismenu" id="menu">
            <li className="mt-3">
              <a href="javascript:void(0)" aria-expanded="false">
                <i className="icon-speedometer menu-icon"></i>
                <span className="nav-text">Dashboard</span>
              </a>
            </li>

            {/* Expense Menu */}
            <li>
              <a
                href="javascript:void(0)"
                aria-expanded={openMenu === 'expance'}
                onClick={() => toggleMenu('expance')}
              >
                <i className="icon-screen-tablet menu-icon"></i>
                <span className="nav-text" style={{ marginRight: '100px' }}>
                  Expance
                </span>
                <i
                  className={`fa-solid fa-angle-${
                    openMenu === 'expance' ? 'down' : 'right'
                  }`}
                ></i>
              </a>
              {openMenu === 'expance' && (
                <ul>
                  <li><a>Show Expance</a></li>
                  <li><a>Add Expance</a></li>
                </ul>
              )}
            </li>

            {/* Roles Menu */}
            <li>
              <a
                href="javascript:void(0)"
                aria-expanded={openMenu === 'roles'}
                onClick={() => toggleMenu('roles')}
              >
                <i className="icon-screen-tablet menu-icon"></i>
                <span className="nav-text" style={{ marginRight: '115px' }}>
                  Roles
                </span>
                <i
                  className={`fa-solid fa-angle-${
                    openMenu === 'roles' ? 'down' : 'right'
                  }`}
                ></i>
              </a>
              {openMenu === 'roles' && (
                <ul>
                  <li><a>Show Roles</a></li>
                  <li><a>Add Roles</a></li>
                </ul>
              )}
            </li>

            {/* Employees Menu */}
            <li>
              <a
                href="javascript:void(0)"
                aria-expanded={openMenu === 'employees'}
                onClick={() => toggleMenu('employees')}
              >
                <i className="icon-screen-tablet menu-icon"></i>
                <span className="nav-text" style={{ marginRight: '80px' }}>
                  Employees
                </span>
                <i
                  className={`fa-solid fa-angle-${
                    openMenu === 'employees' ? 'down' : 'right'
                  }`}
                ></i>
              </a>
              {openMenu === 'employees' && (
                <ul>
                  <li><a>Show Employees</a></li>
                  <li><a>Add Employees</a></li>
                </ul>
              )}
            </li>

            {/* Attendance Menu */}
            <li>
              <a
                href="javascript:void(0)"
                aria-expanded={openMenu === 'attendance'}
                onClick={() => toggleMenu('attendance')}>
                <i className="icon-screen-tablet menu-icon"></i>
                <span className="nav-text" style={{ marginRight: '75px' }}>
                  Attendance
                </span>
                <i
                  className={`fa-solid fa-angle-${
                    openMenu === 'attendance' ? 'down' : 'right'}`}></i>
              </a>
              {openMenu === 'attendance' && (
                <ul>
                  <li><a>Show Employees Attendance</a></li>
                  <li><a>Add Employees Attendance</a></li>
                </ul>
              )}
            </li>

            {/* Pages Menu */}
            <li>
              <a href="javascript:void(0)" aria-expanded={openMenu === 'pages'} onClick={() => toggleMenu('pages')}>
                <i className="icon-notebook menu-icon"></i>
                <span className="nav-text" style={{ marginRight: '100px' }}> Pages </span>
                <i className={`fa-solid fa-angle-${ openMenu === 'pages' ? 'down' : 'right' }`} ></i>
              </a>
              {openMenu === 'pages' && (
                <ul>
                  <li><a href="./page-login.html">Login</a></li>
                  <li><a href="./page-register.html">Register</a></li>
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

export default Sidebar;












<!-- 000000000000000000000000000000000000 768 is the width breakpoint when sidebar toggle stop working and it opens 000000000000000000000000000000000000 -->








<!-- updates done -->
<!-- 1) implemented sweet alert on ervery page except show page of employee -->
<!-- 2) implemented a select dropdown to search by role status on show role page and removed search by role status from search bar -->
<!-- 3) implemented a select dropdown to search by category status on show category page and removed search by category status from search bar -->