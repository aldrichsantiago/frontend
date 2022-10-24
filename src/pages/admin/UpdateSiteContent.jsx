import React from 'react'
import AdminLayout from './AdminLayout'
import './styles/UpdateSiteContent.css'


function UpdateSiteContent() {
  return (
    <AdminLayout>
      <div className="update-site-content-con">
        <div className="update-header-container">
          <h1>Update Site Content</h1>
          <a href="#">Announcements</a>
          <a href="#">Scholarship Information</a>
        </div>
        <div className="update-body-container">
          
        </div>
      </div>
        
    </AdminLayout>
  )
}

export default UpdateSiteContent