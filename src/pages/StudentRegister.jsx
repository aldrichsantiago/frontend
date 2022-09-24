import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import Logo from '../assets/logo.png'
import './styles/StudentRegister.css'

function StudentRegister() {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [course, setCourse] = useState('');
    const [year, setYear] = useState('');
    const [block, setBlock] = useState('');
    const [studId, setStudId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const departments = ["Choose dept","CECT", "CONAMS", "CBA", "CHTM"];
    const courses = ["Choose course","BSIT", "BSECE", "BSCpE", "BSCS"];

    const dept_options = departments.map((dept) =>
        <option key={dept}>{dept}</option>
    );

    const course_options = courses.map((course) =>
        <option key={course}>{course}</option>
    );

    const jsonObject = {
        lastName,
        firstName, 
        middleName,
        contactNo, 
        email,
        department,
        course,
        year,
        studId, 
        password,
        confirmPassword
    }

    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register/student', {
                last_name: lastName,
                first_name: firstName, 
                middle_name: middleName,
                contact_no: contactNo, 
                email: email,
                department: department,
                course: course,
                year: year,
                student_id: studId, 
                password: password,
                confPassword: confirmPassword
            });
            console.log(jsonObject);
            navigate("/");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
  
    return (
    <>
        <Navbar lg="WUPSCHOLARSHIP"></Navbar>
        <div className='register-container'>
            <h1>REGISTER</h1>
            <div className="register-form-con">
                <form onSubmit={Register}>
                    <img src={Logo} alt="Logo goes here" width={120}/>
                    <div className="personal-info">
                        <h2>Personal Info</h2>
                        <div>
                            <label htmlFor="last_name">Last Name: </label><br />
                            <input type="text" name='last_name' placeholder='Last name' value={lastName} onChange={(e)=> setLastName(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="first_name">First Name:</label><br />
                            <input type="text" name='first_name' placeholder='First name' value={firstName} onChange={(e)=> setFirstName(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="middle_name">Middle Name:</label><br />
                            <input type="text" name='middle_name' placeholder='Middle name' value={middleName} onChange={(e)=> setMiddleName(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="contact_no">Contact No:</label><br />
                            <input type="text" name='contact_no' placeholder='Contact no.' value={contactNo} onChange={(e)=> setContactNo(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label><br />
                            <input type="text" name='email' placeholder='Email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="depts">Department:</label><br />
                            <select name="depts" id="dept" value={department} onChange={(e)=> setDepartment(e.target.value)}>
                                {dept_options}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="course">Course:</label><br />
                            <select name="course" id="course" value={course} onChange={(e)=> setCourse(e.target.value)}>
                                {course_options}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="year">Year: </label><br />
                            <input type="number" name="year" placeholder='Year' value={year} onChange={(e)=> setYear(e.target.value)}/>
                        </div>
                        
                        
                    </div><br />
                    <div className="login-info">
                        <h2>Login Info</h2>
                        <div>
                            <label htmlFor="id_no">Student ID No:</label><br />
                            <input type="text" name='id_no' placeholder='12-3456-789' value={studId} onChange={(e)=> setStudId(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="passwd">Password:</label><br />
                            <input type="password" name='passwd' placeholder='Password' value={password} onChange={(e)=> setPassword(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="confirm_passwd">Confirm Password: </label><br />
                            <input type="password" name='confirm_passwd' placeholder='Re-enter password' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)}/>
                        </div>
                        
                    </div>
                    <br />
                    <input type="button" value="REGISTER" onClick={Register}/>
                </form>
            </div>
        </div>
    </>
    
  )
}

export default StudentRegister