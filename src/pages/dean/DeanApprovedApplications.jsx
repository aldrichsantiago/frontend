import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';


const EachApplication = ({application}) => {
  return(
    <tr key={application.application_id}>
      <th scope='row' className='fit'>{application.student.student_id}</th>
      <td className='fit col-7'>{application.student.first_name} {application.student.last_name}</td>
      <td className='fit'>{application.scholarship.scholarship_name}</td>
      <td className='fit' id='td-btn'>
        <a className='btn btn-info mr-3' href={`/dean/applications/review/${application.application_id}`} target="_blank">View Application</a>
      </td>
    </tr>
  )
} 


function DeanApprovedApplications() {
  const [deanId, setDeanId] = useState('');
  const [dean, setDean] = useState({});
  const [department, setDepartment] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectChange, setSelectChange] = useState('');
  const [applications, setApplications] = useState([]);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();


    
  const course_options = courses?.map(({course_id, course_code, course_name}) =>
    <option key={course_id} value={course_id}>{course_code}</option>
  );

  useEffect(()=>{
    if(!token){
      refreshToken();
    }else{
      getDean();
    }
  },[deanId]);

  useEffect(()=>{
    getApplications();
    setTimeout(()=>{
      getApplications();
      getCourses();
    },1000)
  },[dean, department]);

  useEffect(()=>{
    if (selectChange == '' && search == ''){
      getApplications();
    }else if (search != '' && selectChange == ''){
      getSearchedApplications();
    }else if (search == '' && selectChange != ''){
      getFilteredApplications();
    } else {
      getNameCourseApplications();
    }
  },[search, selectChange]);

  const refreshToken = async () => {
      axios.defaults.withCredentials = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/dean/token`);
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setDeanId(decoded.deanId);
        setDepartment(decoded.dept_id);
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dean/token`);
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setDeanId(decoded.deanId);
      setDepartment(decoded.dept_id);
      setExpire(decoded.exp);
  }
  return config;
  }, (error) => {
      return Promise.reject(error);
  });

  const getDean = async () => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/details/${deanId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setDean(response.data);
      console.log(dean);
      console.log(department);
    }catch(e){
      console.log(e)
    }
  }

  const getCourses = async () => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/courses/${department}`);
        setCourses(response.data);
        console.log(courses)
    }catch(e){console.log(e)}
  }

  const getApplications = async() => {
      try{
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/approved/applications/dept/${department}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
      });
        setApplications(response.data);
      }catch(e){
        console.log(e)
      }
    }

  const getFilteredApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/approved/applications/course/${selectChange}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setApplications(response.data);
    }catch(e){console.log(e)}
  }

  const getSearchedApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/applications/approved/dept/${department}/name/${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getNameCourseApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/applications/approved/filter/${search}/${selectChange}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  return (
    <>
        <div className="dean-view-applications">
        <div className="dean-view-header flex align-items-center">
          <h2 className='h2 ml-3'>APPROVED</h2>
          <div className='col-5 text-left display flex'>
          <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" >Name or Student ID</span>
              </div>
              <input type="text" name="searchField" className='searchField form-control'class="form-control" onChange={(e)=>{setSearch(e.target.value)}}/>
            </div>
            {/* <label htmlFor="searchField">Search Student ID or Name:  </label>
            <input type="text" name="searchField" className='searchField form-control' placeholder='e.g. Juan Dela Cruz' onChange={(e)=>{setSearch(e.target.value)}}/> */}
          </div>
          <div>
            <select name="applications-course" className='course-select-dean custom-select mr-sm-2' id='dean-select-course' onChange={(e)=>setSelectChange(e.target.value)} value={selectChange}>
              <option value="">Select a course</option>
              {course_options} 
            </select>
          </div>
        </div>
        <div className="dean-view-body">
          <table className='table table-striped'>
            <thead>
              <tr>
                <th scope='col' className='fit'>Student ID</th>
                <th scope='col' className='fit'>Student Name</th>
                <th scope='col' className='fit'>Scholarship Type</th>
                <th scope='col' className='fit'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application)=>
                <EachApplication application={application}/>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </>
  )
}

export default DeanApprovedApplications