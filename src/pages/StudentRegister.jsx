import React, { useState } from 'react'

import Navbar from '../components/Navbar'

import Logo from '../assets/logo.png'
import './styles/StudentRegister.css'

function StudentRegister() {
    const [lastName, setLastName] = useState();
    const [firstName, setFristName] = useState();
    const [middleName, setMiddleName] = useState();
    const [contactNo, setContactNo] = useState();
    const [email, setEmail] = useState();
    const [department, setDepartment] = useState();
    const [course, setCourse] = useState();
    const [year, setYear] = useState();
    const [block, setBlock] = useState();
    const [studId, setStudId] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    
    
    const departments = ["Choose dept","CECT", "CONAMS", "CBA", "CHTM"];
    const courses = ["Choose course","BSIT", "BSECE", "BSCpE", "BSCS"];
    const dept_options = departments.map((dept) =>
        <option key={dept}>{dept}</option>
    );
    const course_options = courses.map((course) =>
        <option key={course}>{course}</option>
    );
  
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
                            <label htmlFor="id_no">Last Name: </label><br />
                            <input type="text" name='id_no' placeholder='Last name'/>
                        </div>
                        <div>
                            <label htmlFor="id_no">First Name:</label><br />
                            <input type="text" name='id_no' placeholder='First name'/>
                        </div>
                        <div>
                            <label htmlFor="id_no">Middle Name:</label><br />
                            <input type="text" name='id_no' placeholder='Middle name'/>
                        </div>
                        <div>
                            <label htmlFor="id_no">Contact No:</label><br />
                            <input type="text" name='id_no' placeholder='Contact no.'/>
                        </div>
                        <div>
                            <label htmlFor="id_no">Email:</label><br />
                            <input type="text" name='id_no' placeholder='Email'/>
                        </div>
                        <div>
                            <label htmlFor="depts">Department:</label><br />
                            <select name="depts" id="dept" defaultValue="">
                                {dept_options}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="course">Course:</label><br />
                            <select name="course" id="course">
                                {course_options}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="year">Year: </label><br />
                            <input type="number" name="year" placeholder='Year'/>
                        </div>
                        <div>
                            <label htmlFor="block">Block: </label><br />
                            <input type="number" name="block" placeholder='Block'/>
                        </div>
                        
                    </div><br />
                    <div className="login-info">
                        <h2>Login Info</h2>
                        <div>
                            <label htmlFor="id_no">Student ID No:</label><br />
                            <input type="text" name='id_no' placeholder='12-3456-789'/>
                        </div>
                        <div>
                            <label htmlFor="passwd">Password:</label><br />
                            <input type="password" name='passwd' placeholder='Password'/>
                        </div>
                        <div>
                            <label htmlFor="confirm_passwd">Confirm Password: </label><br />
                            <input type="password" name='confirm_passwd' placeholder='Re-enter password'/>
                        </div>
                        
                    </div>
                    <br />
                    <input type="button" value="REGISTER" />
                </form>
            </div>
        </div>
    </>
    
  )
}

export default StudentRegister