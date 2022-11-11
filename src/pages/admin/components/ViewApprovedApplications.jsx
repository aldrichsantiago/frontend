import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';


const EachApplication = ({application, handleDeleteApplication}) => {
  return(
      <tr>
          <td>{application.student_id}</td>
          <td>{application.first_name} {application.last_name}</td>
          <td>
              <a target="_blank" href={`/admin/approved/application/${application.id}`}>View Application</a>
              <button onClick={()=>handleDeleteApplication(application.id)} >Delete</button>
          </td>
      </tr>
  )
}

function ViewApprovedApplications() {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [selectCourse, setSelectCourse] = useState('');
  const [selectDept, setSelectDept] = useState('');
  const [applications, setApplications] = useState([]);
  const [applicantData, setApplicantData] = useState([]);

  const navigate = useNavigate();


  const departments = ["","CECT", "CONAMS", "CBA", "CHTM", "CAS", "CoEd"];
  let courses = [""];

  if (selectDept == "CECT"){
    courses = ["","BSIT", "BSEE", "BSCpE"];
  }else if (selectDept == "CONAMS"){
      courses = ["","Bachelor of Science in Nursing", "Bachelor of Science in Radiologic Technology", "Bachelor of Science in Medical Technology", "Bachelor of Science in Physical Therapy", "Bachelor of Science in Pharmacy"];
  }else if (selectDept == "CHTM"){
    courses = ["","Bachelor of Science in Hospitality Management major in Culinary and Kitchen Operations", "Bachelor of Science in Hospitality Management major in Hotel and Restaurant Administration", "Bachelor of Science in Tourism Management"];
  }else if (selectDept == "CBA"){
    courses = ["","Bachelor of Science in Accountancy", "Bachelor of Science in Accounting Technology", "Bachelor of Science in Business Administration"];
  }else if (selectDept == "CAS"){
      courses = ["","Bachelor of Arts in Communication ", "Bachelor of Arts in Political Science", "Bachelor of Arts in Psychology", "Bachelor of Arts in Theology", "Bachelor of Science in Psychology", "Bachelor of Science in Biology", "Bachelor of Science in Social Work"];
  }else if (selectDept == "CoEd"){
      courses = ["","BSHRM", "BSECE", "BSCpE"];
  }else if (selectDept == "CCJE"){
      courses = ["","Bachelor of Science in Criminology"];
  }else{
      courses = [""];
  }

  const dept_options = departments.map((dept) =>
    <option key={dept}>{dept}</option>
  );

  const course_options = courses.map((course) =>
    <option key={course}>{course}</option>
  );

  useEffect(()=>{
    refreshToken();
    getApplications();
  },[]);

  useEffect(()=>{
    getDeptFilteredApplications();
    if (selectDept == ''){
      getApplications();
    }
  },[selectDept]);

  useEffect(()=>{
    getCourseFilteredApplications();
    if (selectCourse == ''){
      getDeptFilteredApplications();
    }
  },[selectCourse]);

  const getApplications = async() => {
    try{
      const response = await axiosJWT.get(`http://localhost:5000/admin/view/approved/applications`, {
        headers: {
          Authorization: `Bearer ${token}`
      }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getDeptFilteredApplications = async() => {
    try{
      const response = await axiosJWT.get(`http://localhost:5000/admin/view/approved/applications/department/${selectDept}`, {
        headers: {
          Authorization: `Bearer ${token}`
      }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getCourseFilteredApplications = async() => {
    try{
      const response = await axiosJWT.get(`http://localhost:5000/admin/view/approved/applications/course/${selectCourse}`, {
        headers: {
          Authorization: `Bearer ${token}`
      }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getApplicantData = async(id) => {
    try {
        const response = await axiosJWT.get(`http://localhost:5000/admin/view/approved/application/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`
        }
      });
        setApplicantData(response.data);
    } catch (error) {
        console.log(error);
    }
  }

  const deleteFromApprovedApps = async (id) => {
    try{
      await axiosJWT.delete(`http://localhost:5000/admin/delete/approved/application/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
      }
      });
      getApplications();
    }catch(e){
      console.log(e);
    }
  }

  const handleDeleteApplication = (id) => {
    getApplicantData(id);
    deleteFromApprovedApps(id);
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
    <div className="approved-applications">
      <div className="dean-view-header flex">
          <p>Approved Applications</p>
          <div>
            <label htmlFor="applications-dept">DEPARTMENT: </label>
            <select name="applications-dept" id='admin-select-course' onChange={(e)=>setSelectDept(e.target.value)} value={selectDept}>
              {dept_options} 
            </select>
             
            <label htmlFor="applications-course">COURSE: </label>
            <select name="applications-course" id='admin-select-course' onChange={(e)=>setSelectCourse(e.target.value)} value={selectCourse}>
              {course_options} 
            </select>
          </div>
        </div>
        <div className="approved-applications-table">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
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

export default ViewApprovedApplications