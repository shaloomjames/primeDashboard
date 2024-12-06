import React from 'react'
import { Link } from 'react-router-dom'

const ShowAttendance = () => {
  return (

    <div class="container-fluid">
                <Link type="button" class="btn mb-1 btn-primary" to="/admin/addbooth">
            Add Booth
            <span class="btn-icon-right">
            <i class="fa-solid fa-clipboard-user"></i>
            </span>
          </Link>
            <div class="row mt-5" >
            <div class="col-lg-12">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Attendance</h4>
                                <div class="table-responsive">
                                    <table class="table header-border ">
                                        <thead>
                                            <tr>
                                                <th>Employee Name</th>
                                                <th>Employee Email</th>
                                                <th>Time In</th>
                                                <th>Time Out</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td>Herman Beck</td>
                                            <td>HermanBeck@gmail.com</td>
                                                <td>11:45.00</td>
                                                <td>12:36.00</td>
                                                <td>11/5/24</td>
                                                <td>
                                                    <span>
                                                        <Link data-toggle="tooltip" data-placement="top" title="Edit">
                                                          <i class="fa fa-pencil color-muted mx-2"></i>
                                                        </Link>
                                                        <Link data-toggle="tooltip" data-placement="top" title="Close">
                                                          <i class="fa fa-close color-danger mx-2"></i>
                                                        </Link>
                                                    </span>
                                                 </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
    </div>
  )
}

export default ShowAttendance