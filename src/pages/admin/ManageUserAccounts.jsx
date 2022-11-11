import React, {useState,  useEffect} from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import AdminLayout from './AdminLayout'
import ManageStudentAccounts from './components/ManageStudentAccounts'
import ManageDeanAccounts from './components/ManageDeanAccounts'
import ManagePendingStudentRegistrations from './components/ManagePendingStudentRegistrations'
import ManagePendingDeanRegistrations from './components/ManagePendingDeanRegistrations'

import './styles/ManageUserAccounts.css'




function ManageUserAccounts() {
  const [whichTable, setWhichTable] = useState('Students');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');


  useEffect(() => {
    refreshToken();
  }, []);
  
  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get('http://localhost:5000/admin/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    }
    catch (error) {
      if (error.response) {
        navigate("/");
  
      }
    }
  }

  let tableToRender;
    if (whichTable == 'Students') {
      tableToRender = <ManageStudentAccounts/>;

    } else if (whichTable == 'Deans') {
      tableToRender = <ManageDeanAccounts/>;

    } else if (whichTable == 'PendingDeans') {
      tableToRender = <ManagePendingDeanRegistrations/>;

    } else if (whichTable == 'PendingStudents') {
      tableToRender = <ManagePendingStudentRegistrations/>;

    }
  

  return (
    <>
      <AdminLayout>
      <div className="manage-user-header">
        <h1>Manage User Accounts</h1>
        <a href="#" onClick={()=>setWhichTable('PendingStudents')}>Pending Student Registrations</a>
        <a href="#" onClick={()=>setWhichTable('PendingDeans')}>Pending Dean Registrations</a>
        <a href='#' onClick={()=>setWhichTable('Deans')}>Dean Accounts</a>
        <a href='#' onClick={()=>setWhichTable('Students')}>Student Accounts</a>
      </div>

      <div className="manage-user-table-con">
        {tableToRender}
      </div>
      </AdminLayout>
    </>
  )
}

export default ManageUserAccounts