import React, {useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from '../components/Navbar'
import '../components/styles/userLogin.css'
import Logo from '../assets/logo.png'
import axios from 'axios';

function StudentLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 
    const Auth = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            await axios.post(`${import.meta.env.VITE_API_URL}/student`, {
                student_id: id,
                password: password
            });
            navigate("/student/home");
        } catch (error) {
            if (error.response) {
                notify(error.response.data.msg);
            }
        }
    }
    const notify = (msg) => toast.error(msg, {
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
    <div>
        <Navbar lg={"WUPSCHOLARSHIP"}></Navbar>
        
        <div className='login-container'>
            <h1>LOG IN</h1>
            <div className="login-form-con">
                <form onSubmit={Auth}>
                <img src={Logo} alt="LOGO" width="100px"/>

                    <input className="form-control py-3" type="text" placeholder='Student ID' value={id} onChange={(e) => setId(e.target.value)}/>
                    <input className="form-control py-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input className="btn" type="submit" value="LOG IN" />
                </form>
                <div>
                    <Link to='/register/student'>Create an account</Link>
                </div>
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
    </div>
  )
}

export default StudentLogin