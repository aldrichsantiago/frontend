import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import SignaturePad from 'react-signature-canvas'
import Modal from 'react-modal'


const EachApplication = ({application, handleAcceptApplication, handleRejectApplication}) => {
  return(
    <tr key={application.id}>
      <td>{application.student_id}</td>
      <td>{application.first_name} {application.last_name}</td>
      <td className='dean-view-apps-container'>
        <a href={`/dean/applications/review/${application.id}`} target="_blank">View Application</a>
      </td>
      <td>
          <button onClick={()=>handleAcceptApplication(application.id)}>APPROVE</button>
          <button onClick={()=>handleRejectApplication(application.id)}>REJECT</button>
      </td>
    </tr>
  )
} 

function DeanPendingApplications() {
  const [deanId, setDeanId] = useState('');
  const [department, setDepartment] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [deanModal, setDeanModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectChange, setSelectChange] = useState('');
  const [applications, setApplications] = useState([]);
  const [applicantData, setApplicantData] = useState([]);
  const [rejectReason, setRejectReason] = useState('');
  const [dean_signatures, setDeanSignatures] = useState({});
  const [search, setSearch] = useState('');
  let dateSubmitted = '';
  let deanSig = 'd';
  let dataToPass = {};


  const navigate = useNavigate();

  let sigPad = useRef({});

  let courses = [""];

  if (department == "CECT"){
      courses = ["","Bachelor of Science in Information Technology", "Bachelor of Science in Electronics Engineering", "Bachelor of Science in Computer Engineering"];
  }else if (department == "CONAMS"){
      courses = ["","Bachelor of Science in Nursing", "Bachelor of Science in Radiologic Technology", "Bachelor of Science in Medical Technology", "Bachelor of Science in Physical Therapy", "Bachelor of Science in Pharmacy"];
  }else if (department == "CHTM"){
      courses = ["","Bachelor of Science in Hospitality Management major in Culinary and Kitchen Operations", "Bachelor of Science in Hospitality Management major in Hotel and Restaurant Administration", "Bachelor of Science in Tourism Management"];
  }else if (department == "CBA"){
      courses = ["","Bachelor of Science in Accountancy", "Bachelor of Science in Accounting Technology", "Bachelor of Science in Business Administration"];
  }else if (department == "CAS"){
      courses = ["","Bachelor of Arts in Communication ", "Bachelor of Arts in Political Science", "Bachelor of Arts in Psychology", "Bachelor of Arts in Theology", "Bachelor of Science in Psychology", "Bachelor of Science in Biology", "Bachelor of Science in Social Work"];
  }else if (department == "CoEd"){
      courses = ["","BSHRM", "BSECE", "BSCpE"];
  }else if (department == "CCJE"){
      courses = ["","Bachelor of Science in Criminology"];
  }else if (department == "Medicine"){
      courses = ["",""];
  }else if (department == "JWSLG"){
      courses = ["",""];
  }else if (department == "High School"){
      courses = ["","Junior High School", "Senior High School)"];
  }else if (department == "Elementary"){
      courses = ["","GRADE 1 to 3 ( Primary Level )", "GRADE 4 to 6 ( Intermediate Level )"];
  }else{
      courses = [""];
  }

  useEffect(()=>{
    refreshToken();
  },[]);

  useEffect(()=>{
    getDean();
  },[deanId]);

  useEffect(()=>{
    getApplications();
  },[department]);


  useEffect(()=>{
    if (selectChange == '' && search == ''){
      getApplications();
    }else if (search != '' && selectChange == ''){
      getSearchedApplications();
    }else if (search == '' && selectChange != ''){
      getFilteredApplications();
    } else {
      getNameCourseApplications();
    }
  },[search, selectChange]);

  

  const course_options = courses.map((course) =>
    <option key={course}>{course}</option>
  );

  const getDean = async () => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/details/${deanId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setDepartment(response.data.department);
    }catch(e){
      console.log(e)
    }
  }

  const getApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/applications/dept/${department}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getFilteredApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/applications/course/${selectChange}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getSearchedApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/applications/name/${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getNameCourseApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/applications/filter/${search}/${selectChange}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }


  const getApplicantData = async(id) => {
    try {
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/applications/review/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
      });
        setApplicantData(response.data);
    } catch (error) {
        console.log(error);
    }
  }

  const acceptApplication = async (id) => {
    try {
      dataToPass = {
        subj_1: applicantData.subj_1,subj_2: applicantData.subj_2,
        subj_3: applicantData.subj_3,subj_4: applicantData.subj_4,
        subj_5: applicantData.subj_5,subj_6: applicantData.subj_6,
        subj_7: applicantData.subj_7,subj_8: applicantData.subj_8, 
        subj_9: applicantData.subj_9,subj_10: applicantData.subj_10,
        subj_11: applicantData.subj_11,subj_12: applicantData.subj_12,
        units_1: applicantData.units_1, units_2: applicantData.units_2,
        units_3: applicantData.units_3, units_4: applicantData.units_4,
        units_5: applicantData.units_5, units_6: applicantData.units_6,
        units_7: applicantData.units_7, units_8: applicantData.units_8, 
        units_9: applicantData.units_9, units_10: applicantData.units_10,
        units_11: applicantData.units_11, units_12: applicantData.units_12,
        semester: applicantData.semester,
        school_year: applicantData.school_year,
        scholarship_type: applicantData.scholarship_type,
        req_1: applicantData.req_1,
        req_2: applicantData.req_2,
        req_3: applicantData.req_3,
        req_4: applicantData.req_4,
        req_5: applicantData.req_5,
        req_6: applicantData.req_6,
        req_7: applicantData.req_7,
        req_8: applicantData.req_8,
        req_9: applicantData.req_9,
        req_10: applicantData.req_10,
        student_sign: applicantData.student_sign,
        student_id: applicantData.student_id,
        first_name: applicantData.first_name,
        last_name: applicantData.last_name,
        middle_name: applicantData.middle_name,
        department: applicantData.department,
        course: applicantData.course,
        year: applicantData.year,
        email: applicantData.email,
        contact_no: applicantData.contact_no,
        id: applicantData.id,
        date_submitted: dateSubmitted,
        ...dataToPass
      };
      await axiosJWT.post(`${import.meta.env.VITE_API_URL}/create/review/application`,{
        ...dataToPass
    }, { headers: {
      Authorization: `Bearer ${token}`
    }});
    deleteFromSubmittedApps(id);
    } catch (error) {
        console.log(error);
    }
  }

  const rejectApplication = async (id) => {
    try {
        axiosJWT.post(`${import.meta.env.VITE_API_URL}/create/rejected/application`,{
          student_id: applicantData.student_id,
          date_submitted: applicantData.createdAt,
          scholarship_type: applicantData.scholarship_type,
          first_name: applicantData.first_name,
          last_name: applicantData.last_name,
          department: applicantData.department,
          email: applicantData.email,
          contact_no: applicantData.contact_no,
          id: applicantData.id,
          rejected_by: department + " DEAN",
          reason_of_rejection: rejectReason
    },{headers: {
      Authorization: `Bearer ${token}`
    }});
      deleteFromSubmittedApps(id);
    } catch (error) {
        console.log(error);
    }
  }

  const deleteFromSubmittedApps = async (id) => {
    try{
      await axiosJWT.delete(`${import.meta.env.VITE_API_URL}/delete/submitted/application/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      getApplications();
    }catch(e){
      console.log(e);
    }
  }

  const handleAcceptApplication = (id) => {
    getApplicantData(id);
    setDeanModal(true);
  }
  const handleRejectApplication = (id) => {
    getApplicantData(id);
    setRejectModal(true);

  }

  function sigClear(){
    sigPad.current.clear();

  }

function sigSave(){
    deanSig = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
    dateSubmitted = applicantData.createdAt;
    setDeanSignatures({dean_sign: deanSig})
    dataToPass.dean_sign = deanSig;
    console.log(dean_signatures);
    setDeanModal(false);
    acceptApplication(applicantData.id);
}


  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dean/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setDeanId(decoded.deanId);
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dean/token`);
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setDeanId(decoded.deanId);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
      return Promise.reject(error);
  });

  const selectValue = () => {
    console.log(selectChange);
  }
  selectValue();

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

  const logReason = async () => {
    console.log(rejectReason);
    idOfStudent = applicantData.student_id;
    rejectApplication(applicantData.id)
    setRejectModal(false);
    setRejectReason('');
  }

  const handleFileInputChange = (e) => {
    if(e.target.files[0].size > 1048576){
      alert("File is too big! Pls keep it below 1MB");
      e.target.value = "";
      
    } else {
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
        dean_signatures[fieldName] = baseURL;
        deanSig = baseURL;
        console.log(deanSig);
        dataToPass.dean_sign = baseURL;
        dateSubmitted = applicantData.createdAt;
      }
    }
  }

  const acceptUpload = () => {
    dateSubmitted = applicantData.createdAt;
    setDeanModal(false)
    console.log(deanSig);
    acceptApplication(applicantData.id);
  }

  return (
      <>
        <div className="dean-view-applications">
        <div className="dean-view-header">
          <h2>Pending Applications</h2>
          <div>
            <label htmlFor="searchField">Search Student ID or Name:  </label>
            <input type="text" name="searchField" className='search-input' placeholder='e.g. Juan Dela Cruz' onChange={(e)=>{setSearch(e.target.value)}}/>
          </div>
          <div>
            <label htmlFor="applications-course">COURSE: </label>
            <select name="applications-course" className='course-select' id='dean-select-course' onChange={(e)=>setSelectChange(e.target.value)} value={selectChange}>
              {course_options} 
            </select>
          </div>
        </div>
        <div className="dean-view-body">
          <table>
            <thead>
              <tr>
                <td>Student ID</td>
                <td>Student Name</td>
                <td>Applications</td>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody>
              {applications.map((application)=>
                <EachApplication
                handleAcceptApplication={handleAcceptApplication}
                handleRejectApplication={handleRejectApplication}
                application={application}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        shouldCloseOnOverlayClick={true}
        isOpen={deanModal}
        style={customStyles}
        ariaHideApp={false}>
            <SignaturePad
            canvasProps={{className: "sigPad"}}
            ref={sigPad}
            />
            <div className='flex'>
              <button className='btnClear' onClick={sigClear}>CLEAR</button>
              <button className='btnCancel' onClick={()=>setDeanModal(false)}>CANCEL</button>
              <button className="btnApprove" onClick={sigSave}>APPROVE</button>
            </div>
            <hr />
            <p style={{"textAlign":"center", "fontFamily": "Arial"}}>or upload a signature</p>
              <div className='flex'>
                <input type="file" accept='.jpeg, .jpg, .png' name="dean_sign" onChange={handleFileInputChange}/>
                <button className='btnApprove' onClick={()=>acceptUpload()}>APPROVE</button>     
              </div>
      </Modal>
      <Modal
        shouldCloseOnOverlayClick={true}
        isOpen={rejectModal}
        style={customStyles}
        ariaHideApp={false}>
            <textarea type="text" placeholder='Reason for Rejection...' cols={60} rows={10} onChange={(e)=>setRejectReason(e.target.value)} value={rejectReason} required></textarea>
            <div className='flex'>
              <button className='btnCancel' onClick={()=>setRejectModal(false)}>CANCEL</button>
              <button className='btnReject' onClick={logReason}>REJECT</button>
            </div>
      </Modal>

      </>
  )
}

export default DeanPendingApplications