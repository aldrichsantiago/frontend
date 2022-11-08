import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';


const EachApplication = ({application, handleDeleteApplication}) => {
    return(
        <tr>
            <td>{application.student_id}</td>
            <td>{application.first_name} {application.last_name}</td>
            <td>{application.department}</td>
            <td>{application.rejected_by}</td>
            <td>{application.reason_of_rejection}</td>
            <td>
                <p></p>
                <button onClick={()=>{handleDeleteApplication(application.id)}}>Delete</button>
            </td>
        </tr>
    )
}

function ViewRejectedApplications() {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [selectDept, setSelectDept] = useState('');
    const [applications, setApplications] = useState([]);
    const [applicantData, setApplicantData] = useState([]);
  
    const navigate = useNavigate();

    useEffect(()=>{
        // refreshToken();
        getApplications();
    },[]);
    
    useEffect(()=>{
        getDeptFilteredApplications();
        if (selectDept == ''){
            getApplications();
        }
    },[selectDept]);


    const departments = ["","CECT", "CONAMS", "CBA", "CHTM", "CAS", "CoEd"];

    const dept_options = departments.map((dept) =>
        <option key={dept}>{dept}</option>
    );

    const getApplications = async() => {
        try{
            const response = await axios.get(`http://localhost:5000/admin/view/rejected/applications`, {
        });
            setApplications(response.data);
        }catch(e){
            console.log(e)
        }
    }

    const getDeptFilteredApplications = async() => {
        try{
            const response = await axios.get(`http://localhost:5000/admin/view/rejected/applications/department/${selectDept}`, {
        });
        setApplications(response.data);
        }catch(e){
            console.log(e)
        }
    }

    const getApplicantData = async(id) => {
        try {
            const response = await axios.get(`http://localhost:5000/admin/view/rejected/application/${id}`,{
            });
            setApplicantData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteFromRejectedApps = async (id) => {
        try{
            await axios.delete(`http://localhost:5000/admin/delete/rejected/application/${id}`);
            getApplications();
        }catch(e){
            console.log(e);
        }
    }

    const handleDeleteApplication = (id) => {
        deleteFromRejectedApps(id);
    }

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
    
      const axiosJWT = axios.create();
    
      axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
          const response = await axios.get('http://localhost:5000/admin/token');
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);
        }
        return config;
      }, (error) => {
          return Promise.reject(error);
      });

  return (
    <div className="rejected-applications">
        <div className="dean-view-header flex">
          <p>Rejected Applications</p>
          <div>
            <label htmlFor="applications-dept">DEPARTMENT: </label>
            <select name="applications-dept" id='admin-select-course' onChange={(e)=>setSelectDept(e.target.value)} value={selectDept}>
              {dept_options} 
            </select>
          </div>
        </div>
        <div className="rejected-applications-table">
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Rejected By</th>
                        <th>Reason for Rejection</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {applications.map((application)=>
                    <EachApplication
                    application={application}
                    handleDeleteApplication={handleDeleteApplication}
                    />
              )}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ViewRejectedApplications