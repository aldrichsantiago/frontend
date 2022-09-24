import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Logo from '../assets/logo.png'
import '../components/styles/userLogin.css'


function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
 
    const Auth = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/admin', {
                admin_id: id,
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

                    <input type="text" placeholder='Admin ID' value={id} onChange={(e) => setId(e.target.value)}/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input type="submit" value="LOG IN" onClick={Auth}/>
                </form>
            </div>
        
        </div>
    </div>
  )
}

export default AdminLogin