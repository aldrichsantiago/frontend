import axios from 'axios';
import jwt_decode from 'jwt-decode'
import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeanLayout from './DeanLayout'
import './styles/DeanAccountDetails.css'


function DeanAccountDetails() {

  const [dean, setDean] = useState({});
  const [last_name, setLastName] = useState(dean.last_name);
  const [first_name, setFirstName] = useState('');
  const [middle_name, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [contact_no, setContactNo] = useState('');
  const [department, setDepartment] = useState('');
  const [dean_id, setDeanId] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const [deanFormData, setDeanFormData] = useState({
  
  });


  useEffect(() => {
    refreshToken();
    getDean();
    
  },[token]);

  const checkForm = () =>{
    if (last_name != undefined){
      deanFormData["last_name"] = last_name;
      console.log(deanFormData);
    }if (first_name != undefined){
      deanFormData["first_name"] = first_name;
      console.log(deanFormData);
    }if (middle_name != undefined){
      deanFormData["middle_name"] = middle_name;
      console.log(deanFormData);
    }if (department != undefined){
      deanFormData["department"] = department;
      console.log(deanFormData);
    }if (contact_no != undefined){
      deanFormData["contact_no"] = contact_no;
      console.log(deanFormData);
    }if (email != undefined){
      deanFormData["email"] = email;
      console.log(deanFormData);
    }if (dean_id != undefined){
      deanFormData["dean_id"] = dean_id;
      console.log(deanFormData);
    }
  }

  const getDean = async (id) => {
    id = dean_id;
    const response = await axios.get(`http://localhost:5000/dean/details/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setDean(response.data);
    setLastName(dean.last_name);
    setFirstName(dean.first_name);
    setMiddleName(dean.middle_name);
    setDepartment(dean.department);
    setContactNo(dean.contact_no);
    setEmail(dean.email);
  }

  const editDean = async (id) => {
    checkForm();
    id = dean_id;
    await axios.patch(`http://localhost:5000/update/dean/details/${id}`,
      deanFormData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  }

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get('http://localhost:5000/dean/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setLastName(decoded.first_name + ' ' + decoded.last_name);
      setDeanId(decoded.deanId);
      console.log(dean_id);
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
      setLastName(decoded.last_name);
      setDeanId(decoded.deanId);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
      return Promise.reject(error);
  });

  console.log(dean_id);

  return (
    <DeanLayout>
        <h1 className='layout-header'>ACCOUNT DETAILS</h1>
        <div className="user-details-container">
          <h1>Personal Information</h1>
          <form>
            <div>
              <label htmlFor="last_name">Last Name: </label>
              <input defaultValue={dean.last_name} onChange={(e)=>setLastName(e.target.value)} name="last_name" type="text" placeholder="Enter your last name" required/>
            </div>
            <div>
              <label htmlFor="first_name">First Name:</label>
              <input defaultValue={dean.first_name} onChange={(e)=>setFirstName(e.target.value)} name="first_name" type="text" placeholder="Enter your first name" required/>
            </div>
            <div>
              <label htmlFor="middle_name">Middle Name:</label>
              <input defaultValue={dean.middle_name} onChange={(e)=>setMiddleName(e.target.value)} name="middle_name" type="text" placeholder="Enter your middle name" required/>
            </div>
            <div>
              <label htmlFor="department">Department: </label>
              <input defaultValue={dean.department} onChange={(e)=>setDepartment(e.target.value)} name="department" type="text" placeholder="Enter your department" required/>
            </div>
            <div>
              <label htmlFor="contact_no">Contact no.: </label>
              <input defaultValue={dean.contact_no} onChange={(e)=>setContactNo(e.target.value)} name="contact_no" type="text" placeholder="Enter your contact no" required/>
            </div>
            <div>
              <label htmlFor="email">Email: </label>
              <input defaultValue={dean.email} name="email" type="email" placeholder="Enter your email" required/>
            </div>
            <div>
              <label htmlFor="dean_id">Dean ID: </label>
              <input defaultValue={dean.dean_id} name="dean_id" type="text" placeholder="Enter your Dean ID" required/>
            </div>
            <button type='submit' onClick={editDean}>UPDATE ACCOUNT DETAILS</button>
          </form>
        </div>
    </DeanLayout>
  )
}

export default DeanAccountDetails