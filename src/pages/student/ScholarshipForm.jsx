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
            <label >{requirement}: &nbsp;</label>
            <input 
            type="file"
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
    const [schoolyear1, setSchoolyear1] = useState();
    const [schoolyear2, setSchoolyear2] = useState();
    const [requirements, setRequirements] = useState();
    const [signModal, setSignModal] = useState(false);
    const [attachments, setAttachments]= useState({});
    const [subjects, setSubjects]= useState([]);
    const [maxSubjNo, setmaxSubjNo]= useState([1,2,3,4,5,6,7,8,9,10,11,12]);
    const [units, setUnits]= useState([1,2,3,4,5,6]);
    const [subjCodesUnits, setSubjCodesUnits] = useState({
        subject_code_1: '',subject_code_2: '',
        subject_code_3: '',subject_code_4: '',
        subject_code_5: '',subject_code_6: '',
        subject_code_7: '',subject_code_8: '', 
        subject_code_9: '',subject_code_10: '',
        subject_code_11: '',subject_code_12: '',
        unit_1: 0, unit_2: 0,
        unit_3: 0, unit_4: 0,
        unit_5: 0, unit_6: 0,
        unit_7: 0, unit_8: 0, 
        unit_9: 0, unit_10: 0,
        unit_11: 0, unit_12: 0,
        semester:'', school_year: schoolyear1 +" - "+ schoolyear2
    });
    const [sigData, setSigData] = useState('');
    const [token, setToken] = useState('');
    const [studentId, setStudentId] = useState('');
    const [expire, setExpire] = useState('');
    const [totalUnits, setTotalUnits] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState([]);
    const navigate = useNavigate();
    let student_sig = '';
    let maxUnits = 12;

    useEffect(()=>{
        if(!studentId){
            refreshToken();
        }else{
            getStudent();
        }
    },[]);

    useEffect(()=>{
        getScholarship();
    },[id]);

    useEffect(()=>{
        alreadySubmitted();
        getCourseSubjects(student.course_id);
    },[student]);


    useEffect(()=>{
        setRequirements(scholarship.requirements?.split(","));
    },[scholarship]);


    const subject_options = subjects?.map((subject)=>{
        return (
            <option key={subject.subject_code} value={subject.subject_code}>{subject.subject_code} --- {subject.subject_name}</option>
        )

    })

    const unit_options = units?.map((unit)=>{
        return (
            <option key={unit} value={unit}>{unit}</option>
        )
    })



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
            const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/student/min/details/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
        });
            setStudent(response.data);
            getCourseSubjects(response.data.course_id);
            console.log(response.data.course_id);
            
        }catch(e){
            console.log(e);
        }
       
    }

    const getCourseSubjects = async(course_id) => {
        try{
            const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/subjects/get/${course_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
        });
            setSubjects(response.data);
        }catch(e){
            console.log(e);
        }

    }

    const alreadySubmitted = async() => {
        try{
            const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/has/submitted/${student.id}`, {
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
        alreadySubmitted();
        getStudent();
        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;
        const newFormData = { ...subjCodesUnits };
        newFormData[fieldName] = fieldValue;
        setSubjCodesUnits(newFormData);
        console.log(subjCodesUnits);
        console.log(attachments);
        const {unit_1, unit_2, unit_3, unit_4, unit_5, unit_6, unit_7, unit_8, unit_9, unit_10, unit_11, unit_12} = subjCodesUnits;
        setTotalUnits(Number(unit_1)+ Number(unit_2)+ Number(unit_3)+ Number(unit_4)+ Number(unit_5)+ Number(unit_6)+ Number(unit_7)+ Number(unit_8)+ Number(unit_9)+ Number(unit_10)+ Number(unit_11)+ Number(unit_12));
    };

    const handleFileInputChange = e => {
        alreadySubmitted();

        if(e.target.files[0].size > 1048576){
            alert("File is too big! Please keep it below 1MB");
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
        dataToPass = {...subjCodesUnits, ...attachments, student_id: student.id, scholarship_id: scholarship.scholarship_id};
        console.log(dataToPass);
        try{
            await axiosJWT.post(`${import.meta.env.VITE_API_URL}/submit/student/application`, dataToPass, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
              }});
            notify('Application Submitted');
        }catch(e){
            console.log(e);

        }
    };


    const validateAndSubmit = async() => {
        subjCodesUnits.school_year = schoolyear1+"-"+schoolyear2;
        alreadySubmitted();
        const {unit_1, unit_2, unit_3, unit_4, unit_5, unit_6, unit_7, unit_8, unit_9, unit_10, unit_11, unit_12, semester, school_year} = subjCodesUnits;
        setTotalUnits(Number(unit_1)+ Number(unit_2)+ Number(unit_3)+ Number(unit_4)+ Number(unit_5)+ Number(unit_6)+ Number(unit_7)+ Number(unit_8)+ Number(unit_9)+ Number(unit_10)+ Number(unit_11)+ Number(unit_12));
        console.log(subjCodesUnits);
        
        if (isSubmitted.length != 0 ){
            errNotify('You have already submitted an application');
            console.log(subjCodesUnits.school_year)
        } else if (totalUnits < 18){
            console.log(subjCodesUnits);
            errNotify("Total Units should be at least 18");
            console.log(totalUnits);
        } else if (totalUnits > 29){
            errNotify("Total Units should be 29 or less");
            console.log(totalUnits);
        } else if (!semester){
            errNotify("Please enter a semester");
        } else if (!school_year){
            errNotify("Please enter a school year");
        } else if (!attachments.req_1){
            errNotify("Please upload the requirements");
        } else if (attachments.student_sign == undefined) {
            errNotify('Student Signature is Required')
        } else{
            submitForm();
            navigate('/student/status');

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

    const subject_select = maxSubjNo?.map((no)=>{
        let select_name = "subject_code_" + no;
        return (
            <select className='custom-select' key={no} name={select_name} type="text" onChange={handleFormChange} onClick={getStudent}>
                <option value=""></option>
                {subject_options}
            </select>
        )
    })

    const unit_select = maxSubjNo?.map((no)=>{
        let select_name = "unit_" + no;
        return (
            <select className='custom-select' key={no} name={select_name} type="text" onChange={handleFormChange}>
                <option value=""></option>
                {unit_options}
            </select>
        )
    })


    if (scholarship){

    return (
    <Layout>
        <div className="scholarship-form-container">
            <h1>{id}</h1>
            <form className='scholarship-form'>
                <div className="flex">
                    <div className="subject-codes">
                        <label htmlFor="subject">Subject Codes</label>
                        {subject_select}
                    </div>
                    <div className="units">
                        <label>Units</label>
                        {unit_select}
                        <p>TOTAL UNITS: {totalUnits}</p>
                        <p>Note: 18 Units is the minimum for an application</p>
                    </div>
                    <div className="other-info">
                        <label htmlFor="semester">Semester: </label>
                        <select className='custom-select' name="semester" onChange={handleFormChange} required>
                            <option value=""></option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="Summer">Summer</option>
                        </select>
                        <label htmlFor="schoolyear-container">School Year: </label>
                        <div className="schoolyear-container">
                        <select className='custom-select' name="school_year_1" onChange={(e)=>{setSchoolyear1(e.target.value); setSchoolyear2(Number(e.target.value)+1)}} required value={schoolyear1}>
                            <option value=""></option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                        </select>
                        <p> - </p>
                        <select className='custom-select' name="school_year_2" onChange={(e)=>{setSchoolyear2(e.target.value); setSchoolyear1(Number(e.target.value)-1);}} required value={schoolyear2}>
                            <option value=""></option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                        </select>
                        </div>
                        
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
                        <button className='btn btn-dark px-4' type="button" onClick={sign}>SIGN</button>
                        <p>Note: When you use the digital signature be sure to press save after you sign</p>
                    </div>
                </div>
                <button className='scholarFormSubmit btn border border-dark' onClick={validateAndSubmit} type='button'>SUBMIT APPLICATION</button>
                
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
                <button className='btn btn-danger' type="button" onClick={()=>setSignModal(false)}>CLOSE</button>
                <button className='btn btn-dark' type="button" onClick={sigClear}>CLEAR</button>
                <button className='btn btn-success' type="button" onClick={sigSave}>SAVE</button>
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