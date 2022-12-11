import React from 'react'
import { useState, useEffect, useLocation } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import Layout from './Layout'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/AccountDetails.css'

function AccountDetails() {
  const [token, setToken] = useState();
  const [name, setName] = useState('');
  const [expire, setExpire] = useState('');
  const [student, setStudent] = useState({});
  const [student_id, setStudentId] = useState('');
  const [msg, setMsg] = useState('');
  const [last_name, setLastName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [middle_name, setMiddleName] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [contact_no, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [studentFormData, setStudentFormData] = useState({});
  const [changePassModal, setChangePassModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    student_id: student_id
  });


  const departments = ["","CECT", "CONAMS", "CBA", "CHTM", "CAS", "CoEd", "CCJE", "Medicine", "JWSLG", "High School", "Elementary"];
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
      courses = ["","Bachelor of Elementary Education", "Bachelor of Physical Education"];
  }else if (department == "CCJE"){
      courses = ["","Bachelor of Science in Criminology"];
  }else if (department == "Medicine"){
    courses = ["",""];
  }else if (department == "JWSLG"){
      courses = ["",""];
  }else if (department == "High School"){
      courses = ["","Junior High School", "Senior High School"];
  }else if (department == "Elementary"){
      courses = ["","GRADE 1 to 3 ( Primary Level )", "GRADE 4 to 6 ( Intermediate Level )"];
  }else{
      courses = [""];
  }

  let all_courses =["","Bachelor of Science in Information Technology", 
  "Bachelor of Science in Electronics Engineering", 
  "Bachelor of Science in Computer Engineering",
  "Bachelor of Science in Nursing",
   "Bachelor of Science in Radiologic Technology",
   "Bachelor of Science in Medical Technology",
   "Bachelor of Science in Physical Therapy",
   "Bachelor of Science in Pharmacy",
  "Bachelor of Science in Hospitality Management major in Culinary and Kitchen Operations",
   "Bachelor of Science in Hospitality Management major in Hotel and Restaurant Administration",
   "Bachelor of Science in Tourism Management",
  "Bachelor of Science in Accountancy",
   "Bachelor of Science in Accounting Technology",
   "Bachelor of Science in Business Administration",
  "Bachelor of Arts in Communication ",
   "Bachelor of Arts in Political Science",
   "Bachelor of Arts in Psychology",
   "Bachelor of Arts in Theology",
   "Bachelor of Science in Psychology",
   "Bachelor of Science in Biology",
   "Bachelor of Science in Social Work",
  "Bachelor of Elementary Education",
   "Bachelor of Physical Education",
  "Bachelor of Science in Criminology",
   "Junior High School",
   "Senior High School",
  "GRADE 1 to 3 ( Primary Level )",
   "GRADE 4 to 6 ( Intermediate Level )"

  ]

  useEffect(() => {
    refreshToken();
    getStudent();
    
  },[token]);

  useEffect(()=>{
    if(msg == ''){
    }else{

    }
  },[msg]);

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

  const checkPassword = () => {
    if (passwordForm.password.length < 8) {
      setMsg("Password must be at least 8 characters");
      errNotify();
    }else if (passwordForm.password != passwordForm.confPassword){
      setMsg("Password does not match");
      errNotify();
    } else {
      changePassword();
      setChangePassModal(false);
    }
  };

  const getStudent = async () => {
    const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/student/details/${student_id}`, {
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

  const editStudent = async () => {
    checkForm();
    try{
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/update/student/details/${student.id}`,
      studentFormData, {headers: {
        Authorization: `Bearer ${token}`
      }});
      setMsg("Updated Successfully");
      notify();
    }catch(e){
      setMsg(e.response.data.msg);
      errNotify();
    }
  }

  const changePassword = async () => {
    try{
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/change/student/details/password`, passwordForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }});
      setMsg("Password has been changed");
      notify();
    }catch(e){
      setMsg(e.response.data.msg);
      errNotify();
      console.log(e);
    }
  }

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.first_name + ' ' + decoded.last_name);
      setStudentId(decoded.studentId);
      console.log(student_id);
      setExpire(decoded.exp);
    }
    catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
        navigate("/");

      }
    }
  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/token`);
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

  const dept_options = departments.map((dept) =>{
    if (dept == student.department)
      return <option key={dept} selected>{dept}</option>
    return <option key={dept}>{dept}</option>
  });

  const course_options = all_courses.map((c) => {
    if (c == student.course)
      return <option key={c} selected>{c}</option>
    return <option key={c}>{c}</option>
  });


  const handleChangePassFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...passwordForm };
    newFormData[fieldName] = fieldValue;

    setPasswordForm(newFormData);
};

  const handleChangePassword = () => {
    passwordForm.student_id = student_id;
    setChangePassModal(true);

  }
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    console.log(passwordForm);
    checkPassword();

  }

  const notify = () => toast.success(msg, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const errNotify = () => toast.error(msg, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

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
              <p name="student_id">{student_id}</p>
            </div>
            <div>
              <button style={{padding: '1em'}}type="button" onClick={handleChangePassword}>Change Password</button>
            </div>
            <button type='button' onClick={editStudent}>UPDATE ACCOUNT DETAILS</button>
          </form>
        </div>
      </Layout>
      <Modal
        isOpen={changePassModal}
        style={customStyles}
        ariaHideApp={false}>
          <form onSubmit={handleChangePasswordSubmit} style={{display:'flex', flexDirection:'column', gap:'1em'}}>
            <input type="password" name='password' placeholder='Enter a Password' onChange={handleChangePassFormChange} required/>
            <input type="password" name='confPassword' placeholder='Confirm Password' onChange={handleChangePassFormChange} required/>
            <div style={{display:'flex', gap:'1em'}}>
              <button type="button" className='btnCancel' onClick={()=>setChangePassModal(false)}>Cancel</button>
              <button type="submit" className='btnChangePass'>Change Password</button>
            </div>
          </form>
      </Modal>
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
    </>
  )
}

export default AccountDetails