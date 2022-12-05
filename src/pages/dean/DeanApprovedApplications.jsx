import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';


const EachApplication = ({application}) => {
    return(
      <tr key={application.id}>
        <td>{application.student_id}</td>
        <td>{application.first_name} {application.last_name}</td>
        <td>{application.scholarship_type}</td>
        <td className='dean-view-apps-container'>
          <a href={`/dean/view/approved/application/${application.id}`} target="_blank">View Application</a>
        </td>
      </tr>
    )
  } 


function DeanApprovedApplications() {
    const [deanId, setDeanId] = useState('');
    const [department, setDepartment] = useState('');
    const [selectChange, setSelectChange] = useState('');
    const [applications, setApplications] = useState([]);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();


    let courses = [""];

    if (department == "CECT"){
        courses = ["","Bachelor of Science in Information Technology", "Bachelor of Science in Electronics Engineering", "Bachelor of Science in Computer Engineering"];
    }else if (department == "CONAMS"){
        courses = ["","Bachelor of Science in Nursing", "Bachelor of Science in Radiologic Technology", "Bachelor of Science in Medical Technology", "Bachelor of Science in Physical Therapy", "Bachelor of Science in Pharmacy"];
    }else if (department == "CHTM"){
        courses = ["","Bachelor of Science in Hospitality Management major in Culinary and Kitchen Operations", "Bachelor of Science in Hospitality Management major in Hotel and Restaurant Administration", "Bachelor of Science in Tourism Management"];
    }else if (department == "CBA"){
        courses = ["","Bachelor of Science in Accountancy", "Bachelor of Science in Accounting Technology", "Bachelor of Science in Business Administration"];
    }else if (department == "CAS"){
        courses = ["","Bachelor of Arts in Communication ", "Bachelor of Arts in Political Science", "Bachelor of Arts in Psychology", "Bachelor of Arts in Theology", "Bachelor of Science in Psychology", "Bachelor of Science in Biology", "Bachelor of Science in Social Work"];
    }else if (department == "CoEd"){
        courses = ["","BSHRM", "BSECE", "BSCpE"];
    }else if (department == "CCJE"){
        courses = ["","Bachelor of Science in Criminology"];
    }else if (department == "Medicine"){
        courses = ["",""];
    }else if (department == "JWSLG"){
        courses = ["",""];
    }else if (department == "High School"){
        courses = ["","Junior High School", "Senior High School)"];
    }else if (department == "Elementary"){
        courses = ["","GRADE 1 to 3 ( Primary Level )", "GRADE 4 to 6 ( Intermediate Level )"];
    }else{
        courses = [""];
    }
    
    const course_options = courses.map((course) =>
      <option key={course}>{course}</option>
    );

    useEffect(()=>{
        refreshToken();
    },[]);

    useEffect(()=>{
        getDean();
    },[deanId]);

    useEffect(()=>{
        getApplications();
    },[department]);

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
          setDepartment(response.data.department);
          console.log(department)
        }catch(e){
          console.log(e)
        }
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
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/applications/approved/name/${search}`, {
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
        <div className="dean-view-header">
          <h2>Approved Applications</h2>
          <div>
            <label htmlFor="searchField">Search Student ID or Name:  </label>
            <input type="text" name="searchField" className='search-input' placeholder='e.g. Juan Dela Cruz' onChange={(e)=>{setSearch(e.target.value)}}/>
          </div>
          <div>
            <label htmlFor="applications-course">COURSE: </label>
            <select name="applications-course" className='course-select' id='dean-select-course' onChange={(e)=>setSelectChange(e.target.value)} value={selectChange}>
              {course_options} 
            </select>
          </div>
        </div>
        <div className="dean-view-body">
          <table>
            <thead>
              <tr>
                <td>Student ID</td>
                <td>Student Name</td>
                <td>Scholarhsip Type</td>
                <td>Actions</td>
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