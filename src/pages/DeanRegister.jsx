import React, { useState, useEffect } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
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
    const [deanId, setDeanId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();


    const departments = ["Choose dept","CECT", "CONAMS", "CBA", "CHTM"];
    const dept_options = departments.map((dept) =>
        <option key={dept}>{dept}</option>
    );

    const jsonObject = {
        lastName,
        firstName, 
        middleName,
        contactNo, 
        email,
        department,
        deanId, 
        password,
        confirmPassword
    }


    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register/dean', {
                last_name: lastName,
                first_name: firstName, 
                middle_name: middleName,
                contact_no: contactNo, 
                email: email,
                department: department,
                dean_id: deanId, 
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

    useEffect(()=>{
        if(!msg){

        }else{
        notify();

        }
    },[msg]);

    const notify = () => toast.error(msg, {
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
                            <input type="text" name='last_name' placeholder='Last name' value={lastName}onChange={(e)=> setLastName(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="first_name">First Name:</label><br />
                            <input type="text" name='first_name' placeholder='First name' value={firstName} onChange={(e)=> setFirstName(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="middle_name">Middle Name:</label><br />
                            <input type="text" name='middle_name' placeholder='Middle name' value={middleName} onChange={(e)=> setMiddleName(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="contact_no">Contact No:</label><br />
                            <input type="text" name='contact_no' placeholder='Contact no.' value={contactNo} onChange={(e)=> setContactNo(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label><br />
                            <input type="text" name='email' placeholder='Email' value={email} onChange={(e)=> setEmail(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="depts">Department:</label><br />
                            <select name="depts" id="dept" value={department} onChange={(e)=> setDepartment(e.target.value)} required>
                                {dept_options}
                            </select>
                        </div>
                        
                        
                    </div><br />
                    <div className="login-info">
                        <h2>Login Info</h2>
                        <div>
                            <label htmlFor="id_no">Dean ID No:</label><br />
                            <input type="text" name='id_no' placeholder='12-3456-789' value={deanId} onChange={(e)=> setDeanId(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="passwd">Password:</label><br />
                            <input type="password" name='passwd' placeholder='Password' value={password} onChange={(e)=> setPassword(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="confirm_passwd">Confirm Password: </label><br />
                            <input type="password" name='confirm_passwd' placeholder='Re-enter password' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required/>
                        </div>
                        
                    </div>
                    <br />
                    <button type="submit" onClick={Register}>REGISTER</button>
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