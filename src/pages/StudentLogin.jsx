import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import '../components/styles/userLogin.css'
import Logo from '../assets/logo.png'
import axios from 'axios';

function StudentLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
 
    const Auth = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            await axios.post('http://localhost:5000/student', {
                student_id: id,
                password: password
            });
            navigate("/student/home");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

  return (
    <div>
        <Navbar lg={"WUPSCHOLARSHIP"}></Navbar>
        
        <div className='login-container'>
            <h1>LOG IN</h1>
            <div className="login-form-con">
                <form onSubmit={Auth}>
                <img src={Logo} alt="LOGO" width="100px"/>

                    <input type="text" placeholder='Student ID' value={id} onChange={(e) => setId(e.target.value)}/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input type="submit" value="LOG IN" onClick={Auth}/>
                </form>
                <div>
                    <a href="#" >Forgot my password</a><br />
                    <a href='register/student'>Create an account</a>
                </div>
            </div>
        
        </div>
    </div>
  )
}

export default StudentLogin