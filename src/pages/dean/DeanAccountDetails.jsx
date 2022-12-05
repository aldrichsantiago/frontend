import axios from 'axios';
import jwt_decode from 'jwt-decode'
import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import DeanLayout from './DeanLayout'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/DeanAccountDetails.css'


function DeanAccountDetails() {

  const [dean, setDean] = useState({});
  const [msg, setMsg] = useState('');
  const [last_name, setLastName] = useState(dean.last_name);
  const [first_name, setFirstName] = useState('');
  const [middle_name, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [contact_no, setContactNo] = useState('');
  const [department, setDepartment] = useState('');
  const [dean_id, setDeanId] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const [deanFormData, setDeanFormData] = useState({});
  const [changePassModal, setChangePassModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    dean_id: dean_id
  });


  useEffect(() => {
    refreshToken();
    getDean();
  },[token]);

  useEffect(()=>{
    if(!msg){
    }else{
        errNotify();
    }
  },[msg]);


  const departments = ["","CECT", "CONAMS", "CBA", "CHTM", "CAS", "CoEd", "CCJE", "Medicine", "JWSLG", "High School", "Elementary"];

  const dept_options = departments.map((dept) =>{
    if (dept == dean.department)
      return <option key={dept} selected>{dept}</option>
    return <option key={dept}>{dept}</option>
  }
  );

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
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/dean/details/${id}`, {
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
    try{
      id = dean.id;
      await axios.patch(`${import.meta.env.VITE_API_URL}/update/dean/details/${id}`,
        deanFormData, {
        headers: {
          Authorization: `Bearer ${token}`
        }});
      setMsg("Updated Successfully");
      notify();

    } catch (e) {
      setMsg(e.response.data.msg);
      errNotify();
    }
  }

  const changePassword = () => {
    try{
      axios.patch(`${import.meta.env.VITE_API_URL}/change/dean/details/password`, passwordForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }});
      setMsg("Password has been changed");
      notify();
      setChangePassModal(false);

    } catch (e) {
      setMsg(e.response.data.msg);
      errNotify();
      console.log(e);
    }
  }

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dean/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setLastName(decoded.first_name + ' ' + decoded.last_name);
      setDeanId(decoded.deanId);
      console.log(dean_id);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");

      }
    }
  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dean/token`);
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

  const handleChangePassFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...passwordForm };
    newFormData[fieldName] = fieldValue;

    setPasswordForm(newFormData);
    console.log(passwordForm);

  };

  const checkPassword = () => {
    if (passwordForm.password.length < 8) {
      setMsg("Password must be at least 8 characters");
      errNotify();
    }else if (passwordForm.password != passwordForm.confPassword){
      setMsg("Password does not match");
      errNotify();
    } else {
      changePassword();
    }
  };

  const handleChangePassword = () => {
    passwordForm.dean_id = dean_id;
    setChangePassModal(true);

  }
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    passwordForm.dean_id = dean_id;
    console.log(passwordForm);
    checkPassword();

  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const notify = () => toast.success(msg, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});

const errNotify = () => toast.error(msg, {
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
              <select defaultValue={dean.department} onChange={(e)=>setDepartment(e.target.value)} name="department" type="text" placeholder="Enter your department" required>
                {dept_options}
              </select>
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
            <div>
              <button style={{padding: '0.5em'}}type="button" onClick={handleChangePassword}>Change Password</button>
            </div>
            <button type='submit' onClick={editDean}>UPDATE ACCOUNT DETAILS</button>
          </form>
        </div>
        <Modal
        isOpen={changePassModal}
        style={customStyles}
        ariaHideApp={false}>
          <form onSubmit={handleChangePasswordSubmit} style={{display:'flex', flexDirection:'column', gap:'1em'}}>
            <input type="password" name='password' placeholder='Enter a Password' onChange={handleChangePassFormChange}/>
            <input type="password" name='confPassword' placeholder='Confirm Password' onChange={handleChangePassFormChange}/>
            <div style={{display:'flex', gap:'1em'}}>
              <button className='btnCancel' type="button" onClick={()=>setChangePassModal(false)}>Cancel</button>
              <button className='btnChangePass' type="submit">Change Password</button>
            </div>
          </form>
      </Modal>
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
    </DeanLayout>
  )
}

export default DeanAccountDetails