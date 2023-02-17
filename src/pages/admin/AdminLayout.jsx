import React, {useState, useEffect} from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import Navbar from '../../components/Navbar'
import './styles/AdminLayout.css'
import Menu from '../../assets/menu.png'

function AdminLayout({children}) {

  const [name, setName] = useState();
  const [token, setToken] = useState();
  const [expire, setExpire] = useState('');
  const [isChecked, setIsChecked] = useState('none');
  const navigate = useNavigate();


  const handleChange = event => {
    if (event.target.checked) {
      setIsChecked('display');
      console.log('checked');
      document.querySelector('.burger-links').style.display = "block";
    } else {
      setIsChecked('none');
      console.log('not checked');
      document.querySelector('.burger-links').style.display = "none";
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.first_name + ' ' + decoded.last_name);
      setId(decoded.adminId);
      setExpire(decoded.exp);
    }
    catch (error) {
      if (error.response) {
        navigate("/");

      }
    }
  }

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/token`);
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.last_name);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
      return Promise.reject(error);
  });


    const Logout = async () => {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/logout`);
        navigate("/"); 
      } catch (error) {
          console.log(error);
        }
    }



  return (
    <>
        <Navbar sm="WUPSCHOLARSHIP" user="Office of Student Affairs (ADMINISTRATOR)" />
        <div className="content-container">
          <div className="sidebar">
              <Link to="/admin/home">HOME</Link><br />
              <NavLink style={({ isActive }) =>
              isActive
                ? { background: '#74112e'}
                : { background: '#B91646'}
            } to="/admin/applications">VIEW APPLICATIONS</NavLink><br />
              <NavLink style={({ isActive }) =>
              isActive
                ? { background: '#74112e'}
                : { background: '#B91646'}
            } to="/admin/users">MANAGE USER ACCOUNTS</NavLink><br />
              <NavLink style={({ isActive }) =>
              isActive
                ? { background: '#74112e'}
                : { background: '#B91646'}
            } to="/admin/site">UPDATE SITE CONTENT</NavLink><br />
              <Link to="/" onClick={Logout}>LOGOUT</Link>
          </div>
            <input type="checkbox" name="burg" id="burg" onChange={handleChange}/>
            <label htmlFor="burg"><img src={Menu} alt="menu-icon"/></label>
            
          <div className="burger-links" style={{'display': {isChecked}}}>
            <Link to="/admin/home">HOME</Link><br />
            <Link to="/admin/applications">VIEW APPLICATIONS</Link><br />
            <Link to="/admin/users">MANAGE USER ACCOUNTS</Link><br />
            <Link to="/admin/site">UPDATE SITE CONTENT</Link><br />
            <Link to="/" onClick={Logout}>LOGOUT</Link>
          </div>
          <main>{children}</main>
        </div>
        <div className="footer-info">
          <div className="foo-contact-info">
            <p>Mabini Extension, Cabanutan City,</p>
            <p>Nueva Ecija, 3100, Philippines</p>
            <p>+63 (044) 463-2162 / 463-2074</p>
          </div>
          
        </div>
        
    </>
  )
}

export default AdminLayout