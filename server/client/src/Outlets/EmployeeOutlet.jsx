import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from '../components/AdminComponents/Navbar'
import EmployeeSidebar from '../components/EmployeeComponents/EmployeeSidebar'
import Footer from '../components/AdminComponents/Footer'

const AdminOutlet = () => {
  return (
    <>
        <Navbar/>
        <EmployeeSidebar/>
        <div class="content-body" style={{opacity:"80%"}}>
        <Outlet/>
        </div> 
        <Footer/>
    </>
  )
}

export default AdminOutlet
