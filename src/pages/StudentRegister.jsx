import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../components/Navbar'

import Logo from '../assets/logo.png'
import './styles/StudentRegister.css'

function StudentRegister() {
    const [msg, setMsg] = useState('');
    const [departments, setDepartments] = useState();
    const [courses, setCourses] = useState();
    const [registerForm, setRegisterForm] = useState({});
    const navigate = useNavigate();


    const dept_options = departments?.map((dept) =>
        <option key={dept.dept_code} value={dept.dept_id}>{dept.dept_code}</option>
    );

    const course_options = courses?.map((course) =>
        <option key={course.course_name} value={course.course_id}>{course.course_name}</option>
    );

    useEffect(()=>{
        getDepartments();
    }, []);
    useEffect(()=>{
        getCourses();
    }, [registerForm.department, departments]);

    const getDepartments = async () => {
        try{
           const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/departments`);
           setDepartments(response.data);
        }catch(e){console.log(e)}
    }

    const getCourses = async () => {
        try{
           const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/courses/${registerForm.department}`);
           setCourses(response.data);
        }catch(e){console.log(e)}
    }

    const Register = async () => {
        console.log(registerForm)
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/register/student`, registerForm);
            navigate("/");
            errNotify("Account Registered; Pending for Approval");
        } catch (error) {
            if (error.response) {
                errNotify(error.response.data.msg);
            }
        }
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
    console.log(msg);
    console.log(registerForm);
    console.log(courses);

    const handleRegisterFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...registerForm };
        newFormData[fieldName] = fieldValue;

        setRegisterForm(newFormData);
        console.log(registerForm);
    };

    const validateForm = async(e) => {
        e.preventDefault();
        const {last_name, first_name, middle_name, contact_no, email, department, course, year, student_id, password, confPassword} = registerForm;

        if(student_id.length < 5 || student_id.length >= 12){
            errNotify('Please enter a valid Student ID');
        } else if(!password || password.length < 8){
            errNotify('Password should be at least 8 characters');
        } else if(!confPassword || password != confPassword){
            errNotify('Password does not match');
        } else if(!last_name || last_name.length < 2){
            errNotify('Enter a valid Last Name');
        } else if(!first_name || first_name.length < 2){
            errNotify('Enter a valid First Name');
        } else if(!middle_name || middle_name.length < 2){
            errNotify('Enter a valid Middle Name');
        } else if(!contact_no || contact_no.length < 6 || contact_no.length > 11){
            errNotify('Enter a valid contact number');
        } else if(!email || email.length < 6 || !email.includes('@')){
            errNotify('Enter a valid email');
        } else if(!year || year.length < 1 ){
            errNotify('Enter a valid year');
        } else if(!department || department.length < 1){
            errNotify('Enter a valid departement');
        } else if(!course || course.length < 1){
            errNotify('Enter a valid course');
        } else {
            Register();
        }
    }



    return (
    <>
        <Navbar lg="WUPSCHOLARSHIP"></Navbar>
        <div className='register-container'>
            <h1>REGISTER</h1>
            <div className="register-form-con">
                <form>
                    <img src={Logo} alt="Logo goes here" width={120}/>
                    <div className="personal-info">
                        <h2>Personal Info</h2>
                        <div>
                            <label htmlFor="last_name">Last Name: </label><br />
                            <input className="form-control" type="text" name='last_name' placeholder='Last name' onChange={handleRegisterFormChange}/>
                        </div>
                        <div>
                            <label htmlFor="first_name">First Name:</label><br />
                            <input className="form-control" type="text" name='first_name' placeholder='First name' onChange={handleRegisterFormChange}/>
                        </div>
                        <div>
                            <label htmlFor="middle_name">Middle Name:</label><br />
                            <input className="form-control" type="text" name='middle_name' placeholder='Middle name' onChange={handleRegisterFormChange}/>
                        </div>
                        <div>
                            <label htmlFor="contact_no">Contact No:</label><br />
                            <input className="form-control" type="text" name='contact_no' placeholder='Contact no.' onChange={handleRegisterFormChange}/>
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label><br />
                            <input className="form-control" type="text" name="email" placeholder="Email" onChange={handleRegisterFormChange}/>
                        </div>
                        <div>
                            <label htmlFor="department">Department:</label><br />
                            <select name="department" id="department" onChange={handleRegisterFormChange}>
                                <option value=""></option>
                                {dept_options}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="course">Course:</label><br />
                            <select name="course" id="course" onChange={handleRegisterFormChange}>
                                <option value=""></option>
                                {course_options}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="year">Year: </label><br />
                            <select type="number" name="year" placeholder='Year'onChange={handleRegisterFormChange}>
                                <option value=""></option>    
                                <option value="1">1</option>    
                                <option value="2">2</option>    
                                <option value="3">3</option>    
                                <option value="4">4</option>    
                                <option value="5">5</option>    
                            </select>
                        </div>
                        
                        
                    </div><br />
                    <div className="login-info">
                        <h2>Login Info</h2>
                        <div>
                            <label htmlFor="student_id">Student ID No:</label><br />
                            <input className="form-control" type="text" name='student_id' placeholder='12-3456-789' onChange={handleRegisterFormChange}/>
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label><br />
                            <input className="form-control" type="password" name='password' placeholder='Password' onChange={handleRegisterFormChange}/>
                        </div>
                        <div>
                            <label htmlFor="confPassword">Confirm Password: </label><br />
                            <input className="form-control" type="password" name='confPassword' placeholder='Re-enter password' onChange={handleRegisterFormChange}/>
                        </div>
                        
                    </div>
                    <br />
                    <button type="submit" onClick={validateForm}>REGISTER</button>
                </form>
            </div>
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
    </>
    
  )
}

export default StudentRegister