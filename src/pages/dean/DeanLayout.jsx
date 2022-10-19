import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import Navbar from '../../components/Navbar'
import './styles/DeanLayout.css'
import Menu from '../../assets/menu.png'


function Layout({children}) {

  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [users, setUsers] = useState([]);
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
      const response = await axios.get('http://localhost:5000/dean/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.first_name + ' ' + decoded.last_name);
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
      const response = await axios.get('http://localhost:5000/dean/token');
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
      await axios.delete('http://localhost:5000/dean/logout');
      navigate("/"); 
    } catch (error) {
        console.log(error);
      }
  }

  return (
    <>
        <Navbar sm="WUPSCHOLARSHIP" user={name} />
        <div className="content-container">
          <div className="sidebar">
              <Link to="/dean/home">HOME</Link><br />
              <Link to="/dean/applications">VIEW APPLICATIONS</Link><br />
              <Link to="/dean/details">ACCOUNT DETAILS</Link><br />
              <Link to="/" onClick={Logout}>LOGOUT</Link>
          </div>
            <input type="checkbox" name="burg" id="burg" onChange={handleChange}/>
            <label htmlFor="burg"><img src={Menu} alt="menu-icon"/></label>
            
          <div className="burger-links" style={{'display': {isChecked}}}>
            <Link to="/dean/home">HOME</Link><br />
            <Link to="/dean/applications">VIEW APPLICATIONS</Link><br />
            <Link to="/dean/details">ACCOUNT DETAILS</Link><br />
            <Link to="/" onClick={Logout}>LOGOUT</Link>
          </div>
          <main>{children}</main>
        </div>
        <div className="footer">
          <div className="foo-contact-info">
            <p>Mabini Extension, Cabanutan City,</p>
            <p>Nueva Ecija, 3100, Philippines</p>
            <p>+63 (044) 463-2162 / 463-2074</p>
          </div>
          
        </div>
        
    </>
  )
}

export default Layout