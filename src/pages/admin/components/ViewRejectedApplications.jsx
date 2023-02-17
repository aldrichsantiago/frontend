import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';



const EachApplication = ({application, handleDeleteApplication, handleViewApplication}) => {
    return(
       <tr key={application.application_id}>
          <th scope='row' className='fit'>{application.student.student_id}</th>
          <td className='fit col-2'>{application.student.first_name} {application.student.last_name}</td>
          <td className='fit col-2'>{application.scholarship.scholarship_name}</td>
          <td className='fit col-2'>{application?.rejected_by}</td>
          <td className='fit col-2'><a title={application?.reason_for_rejection}>{application?.reason_for_rejection}</a>{application?.reason_for_rejection}</td>
          <td className='fit col-2'>
            <a className='btn btn-info mr-3' href={`/admin/applications/review/${application.application_id}`} target="_blank">View Application</a>
            <button className="btn btn-danger mx-3" onClick={()=>{handleDeleteApplication(application.application_id)}}>Delete</button>
          </td>
        </tr>
    )
}

function ViewRejectedApplications() {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectDept, setSelectDept] = useState('');
    const [selectCourse, setSelectCourse] = useState('');
    const [applications, setApplications] = useState([]);
    const [applicantData, setApplicantData] = useState([]);
    const [search, setSearch] = useState('');

  
    const navigate = useNavigate();

    useEffect(()=>{
      getDepartments();
      refreshToken();
      getApplications();
    },[]);
    
    useEffect(()=>{
      if (selectDept == "") {
        setSelectCourse("");
        setCourses([])
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
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/rejected/applications`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setApplications(response.data);
      }catch(e){
          console.log(e)
      }
    }

    const getSearchedApplications = async() => {
        try{
          const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/search/rejected/applications/${search}`, {
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
          const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/rejected/applications/department/${selectDept}`, {
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
          const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/name/dept/rejected/applications/${search}/${selectDept}`, {
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
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/rejected/applications/course/${selectCourse}`, {
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
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/filter/rejected/applications/${search}/${selectDept}/${selectCourse}`, {
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
            const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/rejected/application/${id}`,{
              headers: {
                Authorization: `Bearer ${token}`
              }
        });
            setApplicantData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteFromRejectedApps = async (id) => {
        try{
            await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/admin/delete/rejected/application/${id}`,{
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            getApplications();
            errNotify("Application deleted");
        }catch(e){
            console.log(e);
        }
    }

    const handleDeleteApplication = (id) => {
        let text = '❌ Do you want to delete this Rejected Application? '
        if(confirm(text) == true){
            deleteFromRejectedApps(id);
        } else {}
    }

    

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
          <h1 className='h2'>REJECTED</h1>
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
        <div className="dean-view-body">
          <table className='table table-responsive'>
            <thead>
              <tr>
              <th scope='col' className='fit'>Student ID</th>
                <th scope='col' className='fit'>Student Name</th>
                <th scope='col' className='fit'>Scholarship Type</th>
                <th scope='col' className='fit'>Rejected By</th>
                <th scope='col' className='fit'>Reason for rejection</th>
                <th scope='col' className='fit'>Actions</th>
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

export default ViewRejectedApplications