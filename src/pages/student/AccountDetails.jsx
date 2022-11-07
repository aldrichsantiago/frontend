import React from 'react'
import { useState, useEffect, useLocation } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import Layout from './Layout'
import './styles/AccountDetails.css'

function AccountDetails() {
  const [token, setToken] = useState();
  const [name, setName] = useState('');
  const [expire, setExpire] = useState('');
  const [student, setStudent] = useState({});
  const [student_id, setStudentId] = useState('');

  const [last_name, setLastName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [middle_name, setMiddleName] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [contact_no, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [studentFormData, setStudentFormData] = useState({
  
  });

  const departments = ["","CECT", "CONAMS", "CBA", "CHTM", "CAS", "CoEd"];

  let courses = [""];

    if (department == "CECT"){
        courses = ["","BSIT", "BSEE", "BSCpE"];
    }else if (department == "CONAMS"){
        courses = ["","Bachelor of Science in Nursing", "Bachelor of Science in Radiologic Technology", "Bachelor of Science in Medical Technology", "Bachelor of Science in Physical Therapy", "Bachelor of Science in Pharmacy"];
    }else if (department == "CHTM"){
        courses = ["","Bachelor of Science in Hospitality Management major in Culinary and Kitchen Operations", "Bachelor of Science in Hospitality Management major in Hotel and Restaurant Administration", "Bachelor of Science in Tourism Management major in Travel Operations"];
    }else if (department == "CBA"){
        courses = ["","Bachelor of Science in Accountancy", "Bachelor of Science in Accounting Technology", "Bachelor of Science in Business Administration with majors in Financial Management, Marketing Management, Operations Management, Human Resource Development Management, Business Economics and Banking."];
    }else if (department == "CAS"){
        courses = ["","Bachelor of Arts in Communication ", "Bachelor of Arts in Political Science", "Bachelor of Arts in Psychology", "Bachelor of Arts in Theology", "Bachelor of Science in Psychology", "Bachelor of Science in Biology", "Bachelor of Science in Social Work"];
    }else if (department == "CoEd"){
        courses = ["","BSHRM", "BSECE", "BSCpE"];
    }else if (department == "CCJE"){
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

  useEffect(() => {
    refreshToken();
    getStudent();
    
  },[token]);

  const checkForm = () =>{
    if (last_name != undefined){
      studentFormData["last_name"] = last_name;
      console.log(studentFormData);
    }if (first_name != undefined){
      studentFormData["first_name"] = first_name;
      console.log(studentFormData);
    }if (middle_name != undefined){
      studentFormData["middle_name"] = middle_name;
      console.log(studentFormData);
    }if (department != undefined){
      studentFormData["department"] = department;
      console.log(studentFormData);
    }if (course != undefined){
      studentFormData["course"] = course;
      console.log(studentFormData);
    }if (year != undefined){
      studentFormData["year"] = year;
      console.log(studentFormData);
    }if (contact_no != undefined){
      studentFormData["contact_no"] = contact_no;
      console.log(studentFormData);
    }if (email != undefined){
      studentFormData["email"] = email;
      console.log(studentFormData);
    }if (student_id != undefined){
      studentFormData["student_id"] = student_id;
      console.log(studentFormData);
    }
  }

  const getStudent = async (id) => {
    id = student_id;
    const response = await axios.get(`http://localhost:5000/student/details/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
  });

    setStudent(response.data);
    setLastName(student.last_name);
    setFirstName(student.first_name);
    setMiddleName(student.middle_name);
    setDepartment(student.department);
    setCourse(student.course);
    setYear(student.year);
    setContactNo(student.contact_no);
    setEmail(student.email);
    console.log(first_name == '');
  }

  const editStudent = async (id) => {
    checkForm();
    id = student_id;
    await axios.patch(`http://localhost:5000/update/student/details/${id}`,
      studentFormData);
  }

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get('http://localhost:5000/student/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.first_name + ' ' + decoded.last_name);
      setStudentId(decoded.studentId);
      console.log(student_id);
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
      const response = await axios.get('http://localhost:5000/student/token');
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.last_name);
      setStudentId(decoded.studentId);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
      return Promise.reject(error);
  });

  

  return (
    <>
      <Layout>
        <div className="user-details-container">
          <h1>Personal Information</h1>
          <form>
            <div>
              <label htmlFor="last_name">Last Name: </label>
              <input defaultValue={student.last_name} name="last_name" type="text" placeholder="Enter your last name" required onChange={(e)=> setLastName(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="first_name">First Name:</label>
              <input defaultValue={student.first_name} name="first_name" type="text" placeholder="Enter your first name" required onChange={(e)=> setFirstName(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="middle_name">Middle Name:</label>
              <input defaultValue={student.middle_name} name="middle_name" type="text" placeholder="Enter your middle name" required onChange={(e)=> setMiddleName(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="department">Department: </label>
              <select defaultValue={student.department} name="department" type="text" placeholder="Enter your department" required onChange={(e)=> setDepartment(e.target.value)}>
                {dept_options}
              </select>
            </div>
            <div>
              <label htmlFor="course">Course: </label>
              <select defaultValue={student.course} name="course" type="text" placeholder="Enter your cousre" required onChange={(e)=> setCourse(e.target.value)}>
                {course_options}
              </select>
            </div>
            <div>
              <label htmlFor="year">Year: </label>
              <input defaultValue={student.year} name="year" type="number" placeholder="Enter your year" required onChange={(e)=> setYear(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="contact_no">Contact no.: </label>
              <input defaultValue={student.contact_no} name="contact_no" type="text" placeholder="Enter your contact no" required onChange={(e)=> setContactNo(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="email">Email: </label>
              <input defaultValue={student.email} name="email" type="email" placeholder="Enter your email" required onChange={(e)=> setEmail(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="student_id">Student ID: </label>
              <input defaultValue={student.student_id} name="student_id" type="text" placeholder="Enter your Student ID" required onChange={(e)=> setStudentId(e.target.value)}/>
            </div>
            <button type='button' onClick={editStudent}>UPDATE ACCOUNT DETAILS</button>
          </form>
        </div>
      </Layout>
    </>
  )
}

export default AccountDetails