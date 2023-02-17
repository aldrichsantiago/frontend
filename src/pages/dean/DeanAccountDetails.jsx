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
  },[]);

  useEffect(() => {
    if(!dean_id){
      refreshToken();
    }else{ 
      getDean(); 
    }
  },[token]);

  const validateForm = () => {
    const {id, dean_id, last_name, first_name, middle_name, email, contact_no} = dean;
    deanFormData.id = id;
    deanFormData.dean_id = dean_id;
    deanFormData.last_name = last_name;
    deanFormData.first_name = first_name;
    deanFormData.middle_name = middle_name;
    deanFormData.email = email;
    deanFormData.contact_no = contact_no;
    if(!deanFormData.last_name || deanFormData.last_name.length > 30){
      errNotify("Enter a valid last name");
    }else if(!deanFormData.first_name || deanFormData.first_name.length > 30){
      errNotify("Enter a valid first name");
    }else if(deanFormData.middle_name > 30){
      errNotify("Enter a valid middle name");
    }else if(!deanFormData.email|| deanFormData.email.length > 30 || !deanFormData.email.includes('@')){
      errNotify("Enter a valid email");
    }else if(deanFormData.contact_no == "" || deanFormData.contact_no.length > 14){
      errNotify("Enter a valid contact number");
    }else{
      editDean();
    }
    console.log(deanFormData);
  }

  const getDean = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/dean/details/${dean_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setDean(response.data);
    setLastName(dean.last_name);
    setFirstName(dean.first_name);
    setMiddleName(dean.middle_name);
    setContactNo(dean.contact_no);
    setEmail(dean.email);
  }

  const editDean = async () => {
    try{
      console.log(deanFormData);
      await axios.patch(`${import.meta.env.VITE_API_URL}/update/dean/details/${dean.id}`,
        deanFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      notify("Updated Successfully");
    } catch (e) {
      setMsg(e.response.data.msg);
      errNotify(e.response.data.msg);
    }
  }

  const changePassword = () => {
    try{
      axios.patch(`${import.meta.env.VITE_API_URL}/change/dean/details/password`, passwordForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }});
      setMsg("Password has been changed");
      notify("Password has been changed");
      setChangePassModal(false);

    } catch (e) {
      setMsg(e.response.data.msg);
      errNotify(e.response.data.msg);
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


  const handleUpdateFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...dean };
    newFormData[fieldName] = fieldValue;

    setDean(newFormData);
    console.log(dean)
  };

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
      errNotify("Password must be at least 8 characters");
    }else if (passwordForm.password != passwordForm.confPassword){
      setMsg("Password does not match");
      errNotify("Password does not match");
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

  const notify = (msg) => toast.success(msg, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});

  const errNotify = (msg) => toast.error(msg, {
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
              <input defaultValue={dean.last_name} onChange={handleUpdateFormChange} name="last_name" type="text" placeholder="Enter your last name" required/>
            </div>
            <div>
              <label htmlFor="first_name">First Name:</label>
              <input defaultValue={dean.first_name} onChange={handleUpdateFormChange} name="first_name" type="text" placeholder="Enter your first name" required/>
            </div>
            <div>
              <label htmlFor="middle_name">Middle Name:</label>
              <input defaultValue={dean.middle_name} onChange={handleUpdateFormChange} name="middle_name" type="text" placeholder="Enter your middle name" required/>
            </div>
            
            <div>
              <label htmlFor="contact_no">Contact no.: </label>
              <input defaultValue={dean.contact_no} onChange={handleUpdateFormChange} name="contact_no" type="text" placeholder="Enter your contact no" required/>
            </div>
            <div>
              <label htmlFor="email">Email: </label>
              <input defaultValue={dean.email} onChange={handleUpdateFormChange} name="email" type="email" placeholder="Enter your email" required/>
            </div>
            <div>
              <label htmlFor="department">Department: </label>
              <p>{dean.department?.dept_code}</p>
            </div>
            <div>
              <label htmlFor="dean_id">Dean ID: </label>
              <p>{dean.dean_id}</p> 
            </div>
            <div className='flex flex-row'>
              <button className='btn border border-dark mx-6 px-3' type="button" onClick={handleChangePassword}>Change Password</button>
              <button className='btn border border-dark mx-6 px-3' type='button' onClick={validateForm}>UPDATE ACCOUNT DETAILS</button>
            </div>
          </form>
        </div>
        <Modal
        isOpen={changePassModal}
        style={customStyles}
        ariaHideApp={false}>
          <form onSubmit={handleChangePasswordSubmit} style={{display:'flex', flexDirection:'column', gap:'1em'}}>
            <input className='form-control p-3' type="password" name='password' placeholder='Enter a Password' onChange={handleChangePassFormChange}/>
            <input className='form-control p-3' type="password" name='confPassword' placeholder='Confirm Password' onChange={handleChangePassFormChange}/>
            <div style={{display:'flex', gap:'1em'}}>
              <button className='btn btnCancel border border-dark' type="button" onClick={()=>setChangePassModal(false)}>Cancel</button>
              <button className='btn btnChangePass' type="submit">Change Password</button>
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