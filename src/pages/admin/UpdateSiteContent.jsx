import React from 'react'
import { useState } from 'react'
import AdminLayout from './AdminLayout'
import ManageAnnouncements from './components/ManageAnnouncements'
import ManageScholarshipInfo from './components/ManageScholarshipInfo'
import './styles/UpdateSiteContent.css'


function UpdateSiteContent() {
  const [whichPage, setWhichPage] = useState('ScholarshipInfo');

  let pageToRender;
    if (whichPage == 'Announcements') {
      pageToRender = <ManageAnnouncements/>;

    } else if (whichPage == 'ScholarshipInfo') {
      pageToRender = <ManageScholarshipInfo/>;
    } 

  return (
    <AdminLayout>
      <div className="update-site-content-con">
        <div className="update-header-container">
          <h1>Update Site Content</h1>
          <a href="#" onClick={()=>setWhichPage('Announcements')}>Announcements</a>
          <a href="#" onClick={()=>setWhichPage('ScholarshipInfo')}>Scholarship Information</a>
        </div>
        <div className="update-body-container">
          {pageToRender}
        </div>
      </div>
        
    </AdminLayout>
  )
}

export default UpdateSiteContent