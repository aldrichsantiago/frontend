import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { FaPrint } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';



const EachApplication = ({application, handleDeleteApplication}) => {
  return(
      <tr key={application.application_id}>
        <th scope='row' className='fit'>{application.student.student_id}</th>
        <td className='fit col-2'>{application.student.first_name} {application.student.last_name}</td>
        <td className='fit col-2'>{application.scholarship.scholarship_name}</td>
        <td className='fit col-3'>
            <a className='btn btn-info mr-3' target="_blank" href={`/admin/approved/application/${application.application_id}`}>View Application</a>
            <button className="btn btn-danger mx-3" onClick={()=>handleDeleteApplication(application.application_id)} >Delete</button>
        </td>
      </tr>
  )
}

function ViewApprovedApplications() {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectCourse, setSelectCourse] = useState('');
  const [selectDept, setSelectDept] = useState('');
  const [applications, setApplications] = useState([]);
  const [applicantData, setApplicantData] = useState([]);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

 

  useEffect(()=>{
    refreshToken();
    getDepartments();
    getApplications();
  },[]);
  useEffect(()=>{
    getCourses();
  },[selectDept]);

  useEffect(()=>{
    if (selectDept == "") {
      setSelectCourse("");
      setCourses([]);
    }else{
      getCourses();
    }
    if(search == "" && selectDept == "" && selectCourse == ""){
      getApplications();
    }  else if (search != "" && selectDept != "" && selectCourse != ""){
      getMultipleFilteredApplications();
    } else if (selectCourse != ""  && search == "" && selectDept == ""){
      getCourseFilteredApplications();
    } else if (selectDept != "" && search == "" && selectCourse == ""){
      getDeptFilteredApplications();
    } else if (search != ""  && selectDept == ""){
      getSearchedApplications(search);
    } else if (selectCourse == ""  && search != "" && selectDept != ""){
      getNameDeptFilteredApplications();
    } else if (search == ""  && selectDept != "" && selectCourse != ""){
      getCourseFilteredApplications();
    } else if (search != "" && selectDept != "" && selectCourse != ""){
      getMultipleFilteredApplications();
    } else if(search == "" && selectDept == "" && selectCourse == ""){
      getApplications();
    }
  },[search, selectDept, selectCourse]);

  useEffect(()=>{
    if (selectDept == "") {
      setSelectCourse("");
      setCourses([])
    }else{
      getCourses();
    }
    if(search == "" && selectDept != "" && selectCourse != ""){
      getDeptFilteredApplications();
    }
  },[selectDept]);

  const dept_options = departments.map(({dept_id, dept_code}) =>
  <option key={dept_id} value={dept_id}>{dept_code}</option>
  );
  const course_options = courses.map(({course_id, course_code}) =>
    <option key={course_id} value={course_id}>{course_code}</option>
  );

  const getDepartments = async () => {
    try{
       const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/departments`);
       setDepartments(response.data);
    }catch(e){console.log(e)}
}

const getCourses = async () => {
    try{
       const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/courses/${selectDept}`);
       setCourses(response.data);
    }catch(e){console.log(e)}
}

  const getApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/approved/applications`, {
        headers: {
          Authorization: `Bearer ${token}`
      }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getSearchedApplications = async(id) => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/search/approved/applications/${id}`, {
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
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/approved/applications/department/${selectDept}`, {
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
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/approved/applications/course/${selectCourse}`, {
        headers: {
          Authorization: `Bearer ${token}`
      }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getMultipleFilteredApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/applications/approved/${search}/${selectDept}/${selectCourse}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getNameDeptFilteredApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/name/dept/filter/approved/${search}/${selectDept}`, {
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
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/approved/application/${id}`,{
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
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/admin/delete/approved/application/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
      }
      });
      getApplications();
      errNotify("Application deleted");
    }catch(e){
      console.log(e);
      console.log(e.response.data.msg);
    }
  }

  const handleDeleteApplication = (id) => {
    let text = '❌ Do you want to delete this Approved Application? '
    if(confirm(text) == true){
      getApplicantData(id);
      deleteFromApprovedApps(id);

    } else {}
  }

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/token`);
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
    axios.defaults.withCredentials = true;

    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/token`);
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
      return Promise.reject(error);
  });
  const errNotify = (msg) => toast.error(msg, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const notify = (msg) => toast.success(msg, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
  });


  return (
    <div className="dean-view-applications">
      <div className="dean-view-header">
        <div className="col-3 flex align-items-center">
          <h1 className='h2'>APPROVED</h1>
          <Link to="/admin/view/approved/applications" target="_blank" className='print-all-approved'><FaPrint/> ALL</Link>

        </div>
        
        <div className='col-12 text-left d-flex align-items-center flex-wrap'>
          <div class="input-group h-25 col-5">
            <div class="input-group-prepend">
              <span class="input-group-text" >Name or Student ID</span>
            </div>
            <input type="text" name="searchField" className='searchField form-control'class="form-control" onChange={(e)=>{setSearch(e.target.value)}}/>
          </div>
          <div className='flex flex-wrap'>
            <div>
              <select name="applications-dept" className='course-select-admin custom-select mr-sm-2' id='dean-select-course' onChange={(e)=>setSelectDept(e.target.value)} value={selectDept}>
                <option value="">Select a department</option>
                {dept_options} 
              </select>
            </div>
            <div>
              <select name="applications-course" className='course-select-admin custom-select mr-sm-2' id='dean-select-course' onChange={(e)=>setSelectCourse(e.target.value)} value={selectCourse}>
                <option value="">Select a course</option>
                {course_options} 
              </select>
            </div>
          </div>
        </div>
          
      </div>
        <div className="approved-applications-table">
          <table className='table'>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Scholarship Type</th>
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
        <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"/>
  </div>
  )
}

export default ViewApprovedApplications