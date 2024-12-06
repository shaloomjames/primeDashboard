import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const AdminOutlet = () => {
  return (
    <>
        <Navbar/>
        <Sidebar/>
        <div class="content-body">
        <Outlet/>
        </div> 
        <Footer/>
    </>
  )
}

export default AdminOutlet
