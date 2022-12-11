import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import SignaturePad from 'react-signature-canvas'
import Modal from 'react-modal'

import Layout from './Layout'
import 'react-toastify/dist/ReactToastify.css';
import'./styles/ScholarshipForm.css'

const AttachementInputs = ({requirement, index, handleFileInputChange}) =>{
    let req_no = index + 1;
    let nameOfInput = `req_${req_no}`
    return(
        <div key={index}>
            <label >{requirement}: </label>
            <input type="file"
            accept='.jpeg, .jpg, .png'
            onChange={handleFileInputChange}
            name={nameOfInput}
            required
            />
            <br />
        </div>
    )
}

function ScholarshipForm() {
    let sigPad = useRef({});
    let {id} = useParams();
    let dataToPass = {};
    const [scholarship, setScholarship] = useState({});
    const [student, setStudent] = useState({});
    const [requirements, setRequirements] = useState();
    const [signModal, setSignModal] = useState(false);
    const [attachments, setAttachments]= useState({});
    const [subjCodesUnits, setSubjCodesUnits] = useState({
        subj_1: '',subj_2: '',
        subj_3: '',subj_4: '',
        subj_5: '',subj_6: '',
        subj_7: '',subj_8: '', 
        subj_9: '',subj_10: '',
        subj_11: '',subj_12: '',
        units_1: 0, units_2: 0,
        units_3: 0, units_4: 0,
        units_5: 0, units_6: 0,
        units_7: 0, units_8: 0, 
        units_9: 0, units_10: 0,
        units_11: 0, units_12: 0
    });
    const [userInfo, setUserInfo] = useState({
        student_id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        middle_name: student.middle_name,
        department: student.department,
        course: student.course,
        year: student.year,
        email: student.email,
        contact_no: student.contact_no,
    });
    const [sigData, setSigData] = useState('');
    const [token, setToken] = useState('');
    const [studentId, setStudentId] = useState('');
    const [expire, setExpire] = useState('');
    const [msg, setMsg] = useState('');
    const [totalUnits, setTotalUnits] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState();
    const navigate = useNavigate();
    let student_sig = '';

    useEffect(()=>{
        refreshToken();
    },[]);

    useEffect(()=>{
        getScholarship();
    },[id]);

    useEffect(()=>{
        setRequirements(scholarship.requirements?.split(","));
        console.log(scholarship);
    },[scholarship]);


    const refreshToken = async () => {
        axios.defaults.withCredentials = true;
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/token`);
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setStudentId(decoded.studentId);
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
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/token`);
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setStudentId(decoded.studentId);
            setExpire(decoded.exp);
        }
        return config;
      }, (error) => {
          return Promise.reject(error);
      });


    const getScholarship = async() => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/scholarships/get/${id}`, {
    });
        setScholarship(response.data);
    }

    const getStudent = async() => {
        try{
            const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/student/details/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
        });
            setStudent(response.data);
            setUserInfo({
                student_id: student.student_id,
                first_name: student.first_name,
                last_name: student.last_name,
                middle_name: student.middle_name,
                department: student.department,
                course: student.course,
                year: student.year,
                email: student.email,
                contact_no: student.contact_no,
            });
            
        }catch(e){
            console.log(e);
        }
       
    }

    const alreadySubmitted = async() => {
        try{
            const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/already/submitted/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setIsSubmitted(response.data);
        }catch(e){
            console.log(e);
        }
       
    }

    function sigClear(){
        sigPad.current.clear();

    }

    function sigSave(){
        student_sig = (sigPad.current.getTrimmedCanvas().toDataURL("image/png"));
        console.log(student_sig);
        attachments.student_sign = student_sig;
        console.log(attachments.student_sig);
        setSignModal(false);
    }

    function sign(){
        setSignModal(true);
        console.log(sigData);
    }

    const handleFormChange = (event) => {
        event.preventDefault();
        getStudent();
        alreadySubmitted();
        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;
        const newFormData = { ...subjCodesUnits };
        newFormData[fieldName] = fieldValue;
        setSubjCodesUnits(newFormData);
        console.log(subjCodesUnits)
        const {units_1, units_2, units_3, units_4, units_5, units_6, units_7, units_8, units_9, units_10, units_11, units_12} = subjCodesUnits;
        setTotalUnits(Number(units_1)+ Number(units_2)+ Number(units_3)+ Number(units_4)+ Number(units_5)+ Number(units_6)+ Number(units_7)+ Number(units_8)+ Number(units_9)+ Number(units_10)+ Number(units_11)+ Number(units_12));
    };

    const handleFileInputChange = e => {
        if(e.target.files[0].size > 1048576){
            alert("File is too big! Pls keep it below 1MB");
            e.target.value = "";
        }else{
            console.log(e.target.files[0]);
            const fieldName = e.target.getAttribute("name");
            const fieldValue = e.target.files[0];

            

            let file = e.target.files[0];
            let baseURL = "";
            // Make new FileReader
            let reader = new FileReader();
            // Convert the file to base64 text
            reader.readAsDataURL(file);
            reader.onload = () => {
                baseURL = reader.result;
                attachments[fieldName] = baseURL;
            }
            console.log(attachments);
            setSignModal(false);
        }
        
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

    const submitForm = async () => {
        dataToPass = {...subjCodesUnits, ...attachments, ...userInfo, scholarship_type: scholarship.scholarship_name};
        console.log(dataToPass);
        try{
            await axios.post(`${import.meta.env.VITE_API_URL}/submit/student/application`, dataToPass, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
              }});
            notify('Application Submitted');
            navigate('/student/status');
        }catch(e){
            console.log(e);

        }
    };


    const validateAndSubmit = async() => {
        const {units_1, units_2, units_3, units_4, units_5, units_6, units_7, units_8, units_9, units_10, units_11, units_12} = subjCodesUnits;
        setTotalUnits(Number(units_1)+ Number(units_2)+ Number(units_3)+ Number(units_4)+ Number(units_5)+ Number(units_6)+ Number(units_7)+ Number(units_8)+ Number(units_9)+ Number(units_10)+ Number(units_11)+ Number(units_12));
        
        if (isSubmitted.length != 0 ){
            errNotify('You have already submitted an application');
        } else if (totalUnits < 18){
            errNotify("Total Units should be at least 18");
            console.log(totalUnits);
        } else if (attachments.student_sign == undefined) {
            errNotify('Student Signature is Required')
        } else{
            submitForm();
        }
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

    if (scholarship){
    return (
    <Layout>
        <div className="scholarship-form-container">
            <h1>{id}</h1>
            <form className='scholarship-form'>
                <div className="flex">
                    <div className="subject-codes">
                        <label htmlFor="subject">Subject Codes</label>
                        <input type="text" name="subj_1" onChange={handleFormChange} required/>
                        <input type="text" name="subj_2" onChange={handleFormChange}/>
                        <input type="text" name="subj_3" onChange={handleFormChange}/>
                        <input type="text" name="subj_4" onChange={handleFormChange}/>
                        <input type="text" name="subj_5" onChange={handleFormChange}/>
                        <input type="text" name="subj_6" onChange={handleFormChange}/>
                        <input type="text" name="subj_7" onChange={handleFormChange}/>
                        <input type="text" name="subj_8" onChange={handleFormChange}/>
                        <input type="text" name="subj_9" onChange={handleFormChange}/>
                        <input type="text" name="subj_10" onChange={handleFormChange}/>
                        <input type="text" name="subj_11" onChange={handleFormChange}/>
                        <input type="text" name="subj_12" onChange={handleFormChange}/>
                    </div>
                    <div className="units">
                        <label>Units</label>
                        <input type="number" name="units_1" onChange={handleFormChange} required/>
                        <input type="number" name="units_2" onChange={handleFormChange}/>
                        <input type="number" name="units_3" onChange={handleFormChange}/>
                        <input type="number" name="units_4" onChange={handleFormChange}/>
                        <input type="number" name="units_5" onChange={handleFormChange}/>
                        <input type="number" name="units_6" onChange={handleFormChange}/>
                        <input type="number" name="units_7" onChange={handleFormChange}/>
                        <input type="number" name="units_8" onChange={handleFormChange}/>
                        <input type="number" name="units_9" onChange={handleFormChange}/>
                        <input type="number" name="units_10" onChange={handleFormChange}/>
                        <input type="number" name="units_11" onChange={handleFormChange}/>
                        <input type="number" name="units_12" onChange={handleFormChange}/>
                        <p>TOTAL UNITS: {totalUnits}</p>
                        <p>Note: 18 Units is the minimum for an application</p>
                    </div>
                    <div className="other-info">
                        <label htmlFor="semester">Semester: </label>
                        <input type="text" name="semester" placeholder='e.g. 1st' onChange={handleFormChange} required/>
                        <label htmlFor="school_year">School Year: </label>
                        <input type="text" name="school_year" placeholder='e.g. 2021-2022' onChange={handleFormChange} required/>
                    </div>
                    <div className="scholar-attachments">
                        {requirements?.map((requirement, index)=>(
                            <AttachementInputs
                            requirement={requirement}
                            index={index}
                            handleFileInputChange={handleFileInputChange}
                            />
                        ))}
                        <br />
                        <button type="button" onClick={sign}>SIGN</button>
                        <p>Note: When you use the digital signature be sure to press save after you sign</p>
                    </div>
                </div>
                <button className='scholarFormSubmit'  onClick={validateAndSubmit} type='submit'>SUBMIT APPLICATION</button>
                
            </form>
        </div>
        <Modal
        isOpen={signModal}
        style={customStyles}
        ariaHideApp={false}>
            <SignaturePad
            canvasProps={{className: "sigPad"}}
            ref={sigPad}
            />
            <div className='flex sign-buttons' style={{ "fontFamily": "Arial"}}>
                <button type="button" onClick={sigClear}>CLEAR</button>
                <button type="button" onClick={()=>setSignModal(false)}>CLOSE</button>
                <button type="button" onClick={sigSave}>SAVE</button>
            </div>
            <hr />
            <p style={{"textAlign":"center", "fontFamily": "Arial"}}>or upload a signature</p>
            <div className='flex'>
                <input type="file" accept='.jpeg, .jpg, .png' name="student_sign" onChange={handleFileInputChange}/>
            </div>

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
    </Layout>
    
    )}else{
        return <h1>SCHOLARSHIP DOES NOT EXISTS</h1>
    }
}

export default ScholarshipForm