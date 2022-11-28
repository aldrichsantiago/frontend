import React, {useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Navbar from '../components/Navbar'
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
            await axios.post(`${import.meta.env.VITE_API_URL}/admin`, {
                admin_id: id,
                password: password
            });
            navigate("/admin/home");
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

export default AdminLogin