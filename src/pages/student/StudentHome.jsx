import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import UserHomeLayout from '../UserHomeLayout'
import './styles/StudentHome.css'


function StudentHome() {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [data, setData] = useState([]);

  const [id, setId] = useState();
  const navigate = useNavigate();


  useEffect(() => {
    refreshToken();
    setData(id)
  
  }, []);

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get('http://localhost:5000/student/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.first_name + ' ' + decoded.last_name);
      setId(decoded.studentId);
      setExpire(decoded.exp);
    }
    catch (error) {
      if (error.response) {
        navigate("/student");

      }
    }
  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:5000/student/token');
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
        await axios.delete('http://localhost:5000/student/logout');
        navigate("/"); 
      } catch (error) {
          console.log(error);
        }
    }

  return (
    <UserHomeLayout 
    user="SCHOLARSHIP APPLICATION" 
    toGreen="/student/status" 
    toYellow="/student/scholarships"
    greenName="VIEW SCHOLARSHIP STATUS"
    yellowName="APPLY SCHOLARSHIP HERE"
    logout={Logout}>
    </UserHomeLayout>
  )
}

export default StudentHome