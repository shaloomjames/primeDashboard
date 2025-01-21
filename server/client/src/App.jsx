import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/userAuth/Login'
import ShowRoles from './pages/Roles/ShowRoles'
import AddRole from './pages/Roles/AddRole'
import UpdateRole from './pages/Roles/UpdateRole'
import ShowEmployee from './pages/Employees/ShowEmployee'
import AddEmployee from './pages/Employees/AddEmployee'
import ShowExpance from './pages/Expance/ShowExpance'
import AddExpance from './pages/Expance/AddExpance'
import UpdateExpance from './pages/Expance/UpdateExpance'

import ShowExpanceCategory from './pages/ExpanceCategory/ShowExpanceCategory'
import AddExpanceCategory from './pages/ExpanceCategory/AddExpanceCategory'
import UpdateExpanceCategory from './pages/ExpanceCategory/UpdateExpanceCategory'

import UpdateEmployee from './pages/Employees/UpdateEmployee'
import ShowAttendance from './pages/Attendance/ShowAttendance'
import ShowSalary from './pages/Salary/ShowSalaries'
import AddSalary from './pages/Salary/AddSalary'
import SalaryUser from './pages/Salary/SelectSalaryUser'
import AdminOutlet from './Outlets/AdminOutlet'
import NotFound from './pages/NotFound'
import ShowDeletedEmployee from './pages/Employees/ShowDeletedEmployee'
import ResetPassword from './pages/userAuth/ResetPassword'
import ForgotPassword from './pages/userAuth/ForgotPassword'


import EmployeeOutlet from './Outlets/EmployeeOutlet'
import EmployeeHome from './EmployeePages/EmployeeHome'
import EmployeeShowAttendance from './EmployeePages/EmployeeShowAttendance'
import EmployeeShowProfile from './EmployeePages/EmployeeShowProfile'
import EmployeeShowSalary from './EmployeePages/EmployeeShowSalary'

const App = () => {
  return (
    <>
      <BrowserRouter>


          <Routes>

         
             <Route path='/' element={<AdminOutlet/>}>
             <Route path='/' element={<Home />} />
              {/* Role routes */}
              <Route path='/showrole' element={<ShowRoles />} />
              <Route path='/addrole' element={<AddRole />} />
              <Route path='/updaterole/:id' element={<UpdateRole />} />
              {/* Employee Routes */}
              <Route path='/showemployee' element={<ShowEmployee />} />
              <Route path='/showdeletedemployee' element={<ShowDeletedEmployee />} />
              <Route path='/addemployee' element={<AddEmployee />} />
              <Route path='/updateemployee/:id' element={<UpdateEmployee />} />
              {/* Expance Category Routes */}
              <Route path='/showexpanceCategory' element={<ShowExpanceCategory />} />
              <Route path='/addexpanceCategory' element={<AddExpanceCategory />} />
              <Route path='/updateexpanceCategory/:id' element={<UpdateExpanceCategory />} />
              {/* Expance Routes */}
              <Route path='/showexpance' element={<ShowExpance />} />
              <Route path='/addexpance' element={<AddExpance />} />
              <Route path='/updateexpance/:id' element={<UpdateExpance />} />
              {/* Attendance Routes */}
              <Route path='/showattendance' element={<ShowAttendance/>} />
              {/* Salary Routes */}
              <Route path='/showSalaries' element={<ShowSalary/>} />
              <Route path='/addSalary/:month/:id' element={<AddSalary />} />
              <Route path='/SelectSalaryusers' element={<SalaryUser/>} />
            </Route>

            <Route  path='/employee' element={<EmployeeOutlet/>}>
              <Route path='/employee' element={<EmployeeHome/>}/>
              <Route path='/employee/showattendance' element={<EmployeeShowAttendance/>}/>
              <Route path='/employee/showsalary' element={<EmployeeShowSalary/>}/>
              <Route path='/employee/showprofile' element={<EmployeeShowProfile/>}/>
            </Route>

            <Route path='/login' element={<Login />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
            <Route path='/resetpassword/:token' element={<ResetPassword />} />


            <Route path='*' element={<NotFound />} />


          </Routes>


      </BrowserRouter>
    </>
  )
}

export default App