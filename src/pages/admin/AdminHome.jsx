import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import UserHomeLayout from '../UserHomeLayout'


function AdminHome() {
  const [token, setToken] = useState();
  const [name, setName] = useState();
  const [expire, setExpire] = useState('');
  const navigate = useNavigate();


  // useEffect(() => {
  // refreshToken();
  // }, []);

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get('http://localhost:5000/admin/token');
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
      const response = await axios.get('http://localhost:5000/admin/token');
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
      await axios.delete('http://localhost:5000/admin/logout');
      navigate("/"); 
    } catch (error) {
        console.log(error);
      }
  }

  return (
    <UserHomeLayout 
    user="A D M I N I S T R A T O R" 
    toGreen="/admin/applications" 
    greenName="MANAGE SCHOLARSHIP APPLICATIONS"
    display='none'
    logout={Logout}>

    </UserHomeLayout>
  )
}

export default AdminHome