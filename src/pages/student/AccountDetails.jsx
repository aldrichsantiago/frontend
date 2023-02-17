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
  const [studentUpdateData, setStudentUpdateData] = useState({});
  const [changePassModal, setChangePassModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({student_id: student_id});
  const [departments, setDepartments] = useState();
  const [courses, setCourses] = useState();

  useEffect(() => {
    refreshToken();
    getDepartments();
  },[]);
  
  useEffect(() => {
    if(student_id){
      getStudent();
    }
  },[token]);

  useEffect(()=>{
    if(student.department){
      getAllCourses();
      getCourses(student.dept_id);

    }else{
      student.department = student.dept_id
      getAllCourses();
    }
  }, [student.department, departments, student.dept_id]);


  const dept_options = departments?.map((dept) => {
    if (student.department?.dept_code == dept.dept_code){
      return <option key={dept.dept_code} value={dept.dept_id} selected>{dept.dept_code}</option>
    }else {
      return <option key={dept.dept_code} value={dept.dept_id}>{dept.dept_code}</option>
    }
  });

  const course_options = courses?.map((course) =>{
    if (course?.course_id == student.course){
      return <option key={course.course_id} value={course.course_id} selected>{course.course_code}</option>
    }else {
      return <option key={course.course_id} value={course.course_id}>{course.course_code} --- {course.course_name}</option>
    }
  });



  const getDepartments = async () => {
    try{
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/departments`);
      setDepartments(response.data);

      getCourses();

    }catch(e){console.log(e)}
  }

  const getCourses = async (deptid) => {
    try{
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/courses/${deptid}`);
      setCourses(response.data);
    }catch(e){console.log(e)}
  }

  const getAllCourses = async () => {
    try{
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/all/courses`);
      setCourses(response.data);
    }catch(e){console.log(e)}
  }

  const checkPassword = () => {
    if (passwordForm.password.length < 8) {
      setMsg("Password must be at least 8 characters");
      errNotify("Password must be at least 8 characters");
    }else if (passwordForm.password != passwordForm.confPassword){
      setMsg("Password does not match");
      errNotify("Password does not match");
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
    setStudentUpdateData(response.data);
    setStudent(response.data);
    // setLastName(student.last_name);
    // setFirstName(student.first_name);
    // setMiddleName(student.middle_name);
    // setDepartment(student.department);
    // setCourse(student.course);
    // setYear(student.year);
    // setContactNo(student.contact_no);
    // setEmail(student.email);
    student.department = student.dept_id;
  }

  const validateFormData = () => {
    const {id, student_id, last_name, first_name, middle_name, dept_id, course_id, year, email, contact_no} = student;
    studentFormData.id = id;
    studentFormData.student_id = student_id;
    studentFormData.last_name = last_name;
    studentFormData.first_name = first_name;
    studentFormData.middle_name = middle_name;
    studentFormData.dept_id = dept_id;
    studentFormData.email = email;
    studentFormData.contact_no = contact_no;
    studentFormData.course_id = course_id;
    studentFormData.year = year;
    if(!studentFormData.last_name || studentFormData.last_name.length > 30){
      errNotify("Enter a valid last name");
    }else if(!studentFormData.first_name || studentFormData.first_name.length > 30){
      errNotify("Enter a valid first name");
    }else if(studentFormData.middle_name.length > 30){
      errNotify("Enter a valid first name");
    }else if(!studentFormData.dept_id){
      errNotify("Enter a valid department");
    }else if(!studentFormData.course_id){
      errNotify("Enter a valid course");
    }else if(!studentFormData.year){
      errNotify("Enter a valid year");
    }else if(!studentFormData.email || !studentFormData.email.includes('@')){
      errNotify("Enter a valid email");
    }else if(!studentFormData.contact_no || studentFormData.contact_no.length < 6 || studentFormData.contact_no.length > 14){
      errNotify("Enter a valid contact number");
    }else{
      editStudent();
    }
    console.log(studentFormData);
  }

  const editStudent = async () => {
    try{
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/update/student/details/${student.id}`,
      studentFormData, 
      { 
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      notify("Updated Successfully");
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
      notify("Password has been changed");
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


  const handleUpdateFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...student };
    newFormData[fieldName] = fieldValue;

    setStudent(newFormData);
    console.log(student)
  };

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

  console.log(student)
  return (
    <>
      <Layout>
        <div className="user-details-container">
          <h1>Personal Information</h1>
          <form className='form-group'>
            <div>
              <label htmlFor="last_name">Last Name: </label>
              <input class="form-control" defaultValue={student.last_name} name="last_name" type="text" placeholder="Enter your last name" required onChange={handleUpdateFormChange}/>
            </div>
            <div>
              <label htmlFor="first_name">First Name:</label>
              <input class="form-control" defaultValue={student.first_name} name="first_name" type="text" placeholder="Enter your first name" required onChange={handleUpdateFormChange}/>
            </div>
            <div>
              <label htmlFor="middle_name">Middle Name:</label>
              <input class="form-control" defaultValue={student.middle_name} name="middle_name" type="text" placeholder="Enter your middle name" required onChange={handleUpdateFormChange}/>
            </div>
            <div>
              <label htmlFor="dept_id">Department: </label>
              <select class="form-select custom-select" aria-label="Default select example" defaultValue={student.dept_id} name="dept_id" type="text" placeholder="Enter your department" required onChange={handleUpdateFormChange}>
                <option value=""> </option>
                {dept_options}
              </select>
            </div>
            <div>
              <label htmlFor="course_id">Course: </label>
              <select class="form-select custom-select" aria-label="Default select example" value={student.course_id} name="course_id" type="text" placeholder="Enter your cousre" required onChange={handleUpdateFormChange}>
                <option value=""> </option>
                {course_options}
              </select>
            </div>
            <div>
              <label htmlFor="year">Year: </label>
              <select class="form-select custom-select" aria-label="Default select example" value={student.year} name="year" type="text" placeholder="Enter your year" required onChange={handleUpdateFormChange}>
                <option value=""></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div>
              <label htmlFor="contact_no">Contact no.: </label>
              <input class="form-control" defaultValue={student.contact_no} name="contact_no" type="text" placeholder="Enter your contact no" required onChange={handleUpdateFormChange}/>
            </div>
            <div>
              <label htmlFor="email">Email: </label>
              <input class="form-control" defaultValue={student.email} name="email" type="email" placeholder="Enter your email" required onChange={handleUpdateFormChange}/>
            </div>
            <div>
              <label htmlFor="student_id">Student ID: </label>
              <p name="student_id">{student_id}</p>
            </div>
            <div>
              <button className='btn p-3 border border-dark' type="button" onClick={handleChangePassword}>Change Password</button>
            </div>
            <button className='btn border border-dark' type='button' onClick={validateFormData}>UPDATE ACCOUNT DETAILS</button>
          </form>
        </div>
      </Layout>
      <Modal
        isOpen={changePassModal}
        style={customStyles}
        ariaHideApp={false}>
          <form onSubmit={handleChangePasswordSubmit} style={{display:'flex', flexDirection:'column', gap:'1em'}}>
            <input className='form-control py-3' type="password" name='password' placeholder='Enter a Password' onChange={handleChangePassFormChange} required/>
            <input className='form-control py-3' type="password" name='confPassword' placeholder='Confirm Password' onChange={handleChangePassFormChange} required/>
            <div style={{display:'flex', gap:'1em'}}>
              <button type="button" className='btn btnCancel border border-dark' onClick={()=>setChangePassModal(false)}>Cancel</button>
              <button type="submit" className='btn btnChangePass'>Change Password</button>
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