import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import DeanLayout from './DeanLayout'
import './styles/ViewApplications.css'
import DeanApprovedApplications from './DeanApprovedApplications';
import DeanPendingApplications from './DeanPendingApplications';


function ViewApplications() {
  const [table, setTable] = useState('Pending');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');

  let tableToRender;
  if (table == 'Approved') {
    tableToRender = <DeanApprovedApplications/>;

  } else if (table == 'Pending') {
    tableToRender = <DeanPendingApplications/>;

  }

  return (
    <DeanLayout>
      <div className="dean-view-applications-header flex">
        <h1>View Applications</h1>
        <a href="#" onClick={()=>setTable('Pending')}>Pending Applications</a>
        <a href="#" onClick={()=>setTable('Approved')}>Approved Applications</a>
      </div>
      
      {tableToRender}
    </DeanLayout>
  )
}

export default ViewApplications