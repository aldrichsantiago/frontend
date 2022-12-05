import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { FaPrint } from "react-icons/fa";


const EachApplication = ({application, handleDeleteApplication}) => {
  return(
      <tr>
          <td>{application.student_id}</td>
          <td>{application.first_name} {application.last_name}</td>
          <td>{application.department}</td>
          <td>{application.scholarship_type}</td>
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
  const [search, setSearch] = useState('');

  const navigate = useNavigate();


  const departments = ["","CECT", "CONAMS", "CBA", "CHTM", "CAS", "CoEd", "CCJE", "Medicine", "JWSLG", "High School", "Elementary"];
  let courses = [""];

  if (selectDept == "CECT"){
    courses = ["","Bachelor of Science in Information Technology", "Bachelor of Science in Electronics Engineering", "Bachelor of Science in Computer Engineering"];
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
  }else if (selectDept == "Medicine"){
    courses = ["",""];
  }else if (selectDept == "JWSLG"){
      courses = ["",""];
  }else if (selectDept == "High School"){
      courses = ["","Junior High School", "Senior High School"];
  }else if (selectDept == "Elementary"){
      courses = ["","GRADE 1 to 3 ( Primary Level )", "GRADE 4 to 6 ( Intermediate Level )"];
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
    if (selectDept == "") {
      setSelectCourse("");
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
      await axiosJWT.delete(`${import.meta.env.VITE_API_URL}/admin/delete/approved/application/${id}`,{
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
    let text = 'Do you want to delete this Approved Application? '
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


  return (
    <div className="approved-applications">
      <div className="dean-view-header flex">

        <div className="all-applications-button" style={{display:'flex', alignItems:'center', gap:'1em'}}>
          <Link to="/admin/view/approved/applications"><FaPrint/> ALL</Link>
          <h2>Approved Applications</h2>
        </div>
          <div>
            <label htmlFor="searchField">Search Student ID or Name:  </label>
            <input type="text" name="searchField" className='search-input' placeholder='e.g. 00-0000-000' onChange={(e)=>{setSearch(e.target.value)}}/>
          </div>
          <div>
            <label htmlFor="applications-dept">DEPARTMENT: </label>
            <select name="applications-dept" className='dept-select' id='admin-select-course' onChange={(e)=>setSelectDept(e.target.value)} value={selectDept}>
              {dept_options} 
            </select>
             
            <label htmlFor="applications-course">COURSE: </label>
            <select name="applications-course" className='course-select' id='admin-select-course' onChange={(e)=>setSelectCourse(e.target.value)} value={selectCourse}>
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
                <th>Department</th>
                <th>Shcolarship Type</th>
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