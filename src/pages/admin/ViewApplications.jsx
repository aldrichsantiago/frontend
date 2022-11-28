import React, {useState} from 'react'
import AdminLayout from './AdminLayout'
import './styles/ViewApplications.css'
import ViewPendingApplications from './components/ViewPendingApplications';
import ViewApprovedApplications from './components/ViewApprovedApplications';
import ViewRejectedApplications from './components/ViewRejectedApplications';

function ViewApplications() {
  const [applicationTable, setApplicationTable] = useState('PendingApplications');

  let tableToRender;
  if (applicationTable == 'PendingApplications') {
    tableToRender = <ViewPendingApplications/>;

  } else if (applicationTable == 'ApprovedApplications') {
    tableToRender = <ViewApprovedApplications/>;

  } else if (applicationTable == 'RejectedApplications') {
    tableToRender = <ViewRejectedApplications/>;
  }
  
  return (
    <AdminLayout>
        <div className="admin-view-applications">

          <div className="admin-view-app-header">
            <h1>View Applications</h1>
            <a href="#" onClick={()=>setApplicationTable('PendingApplications')}>Pending Applications</a>
            <a href="#" onClick={()=>setApplicationTable('ApprovedApplications')}>Approved Applications</a>
            <a href='#' onClick={()=>setApplicationTable('RejectedApplications')}>Rejected Applications</a>
          </div>

          <div className="admin-view-app-body">
            {tableToRender}
          </div>
        </div>
    </AdminLayout>
  )
}

export default ViewApplications