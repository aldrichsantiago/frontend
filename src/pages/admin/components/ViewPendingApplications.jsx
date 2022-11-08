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
          <td>
            <a href={`/admin/applications/review/${application.id}`} target="_blank">View Application</a>
          </td>
          <td>
              <button onClick={()=>handleAcceptApplication(application.id)}>ACCEPT</button>
              <button onClick={()=>handleRejectApplication(application.id)}>REJECT</button>
          </td>
      </tr>
  )
} 

function ViewPendingApplications() {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [adminModal, setAdminModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectCourse, setSelectCourse] = useState('');
  const [selectDept, setSelectDept] = useState('');
  const [applications, setApplications] = useState([]);
  const [applicantData, setApplicantData] = useState([]);
  const [rejectReason, setRejectReason] = useState('');
  let adminSig = '';
  const navigate = useNavigate();

  let sigPad = useRef({});

  const departments = ["","CECT", "CONAMS", "CBA", "CHTM", "CAS", "CoEd"];
  let courses = [""];

  if (selectDept == "CECT"){
      courses = ["","BSIT", "BSEE", "BSCpE"];
  }else if (selectDept == "CONAMS"){
      courses = ["","Bachelor of Science in Nursing", "Bachelor of Science in Radiologic Technology", "Bachelor of Science in Medical Technology", "Bachelor of Science in Physical Therapy", "Bachelor of Science in Pharmacy"];
  }else if (selectDept == "CHTM"){
      courses = ["","Bachelor of Science in Hospitality Management major in Culinary and Kitchen Operations", "Bachelor of Science in Hospitality Management major in Hotel and Restaurant Administration", "Bachelor of Science in Tourism Management major in Travel Operations"];
  }else if (selectDept == "CBA"){
      courses = ["","Bachelor of Science in Accountancy", "Bachelor of Science in Accounting Technology", "Bachelor of Science in Business Administration with majors in Financial Management, Marketing Management, Operations Management, Human Resource Development Management, Business Economics and Banking."];
  }else if (selectDept == "CAS"){
      courses = ["","Bachelor of Arts in Communication ", "Bachelor of Arts in Political Science", "Bachelor of Arts in Psychology", "Bachelor of Arts in Theology", "Bachelor of Science in Psychology", "Bachelor of Science in Biology", "Bachelor of Science in Social Work"];
  }else if (selectDept == "CoEd"){
      courses = ["","BSHRM", "BSECE", "BSCpE"];
  }else if (selectDept == "CCJE"){
      courses = ["","Bachelor of Science in Criminology"];
  }else{
      courses = [""];
  }


  useEffect(()=>{
    // refreshToken();
    getApplications();
  },[]);

  useEffect(()=>{
    getDeptFilteredApplications();
    if (selectDept == ''){
      getApplications();
    }
  },[selectDept]);

  useEffect(()=>{
    getCourseFilteredApplications();
    if (selectCourse == ''){
      getDeptFilteredApplications();
    }
  },[selectCourse]);

  
  const dept_options = departments.map((dept) =>
    <option key={dept}>{dept}</option>
  );

  const course_options = courses.map((course) =>
    <option key={course}>{course}</option>
  );


  const getApplications = async() => {
    try{
      const response = await axios.get(`http://localhost:5000/admin/view/applications`, {
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getDeptFilteredApplications = async() => {
    try{
      const response = await axios.get(`http://localhost:5000/admin/view/applications/department/${selectDept}`, {
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }
  const getCourseFilteredApplications = async() => {
    try{
      const response = await axios.get(`http://localhost:5000/admin/view/applications/course/${selectCourse}`, {
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getApplicantData = async(id) => {
    try {
        const response = await axios.get(`http://localhost:5000/admin/view/application/${id}`,{
        });
        setApplicantData(response.data);
    } catch (error) {
        console.log(error);
    }
  }

  const acceptApplication = async (id) => {
    try {
          axios.post(`http://localhost:5000/admin/approve/application`,{
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
          date_submitted: applicantData.date_submitted,
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
          dean_sign: applicantData.dean_sign,
          admin_sign: adminSig,
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
          id: applicantData.id

        });
        deleteFromSubmittedApps(id);
    } catch (error) {
        console.log(error);
    }
  }

  const rejectApplication = async (id) => {
    try {
        axios.post(`http://localhost:5000/admin/create/rejected/application`,{
          student_id: applicantData.student_id,
          date_submitted: applicantData.date_submitted,
          scholarship_type: applicantData.scholarship_type,
          first_name: applicantData.first_name,
          last_name: applicantData.last_name,
          department: applicantData.department,
          email: applicantData.email,
          contact_no: applicantData.contact_no,
          id: applicantData.id,
          rejected_by: "Office for Student Affairs (OSA)",
          reason_of_rejection: rejectReason
    });
      deleteFromSubmittedApps(id);
    } catch (error) {
        console.log(error);
    }
  }

  const deleteFromSubmittedApps = async (id) => {
    try{
      await axios.delete(`http://localhost:5000/admin/delete/application/${id}`);
      getApplications();
    }catch(e){
      console.log(e);
    }
  }

  const handleAcceptApplication = (id) => {
    getApplicantData(id);
    setAdminModal(true);
  }
  const handleRejectApplication = (id) => {
    getApplicantData(id);
    setRejectModal(true);

  }

  function sigClear(){
    sigPad.current.clear();

  }

function sigSave(){
    adminSig = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
    console.log(adminSig);
    setAdminModal(false);
    acceptApplication(applicantData.id);
    console.log({...applicantData})
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

  const logReason = async () => {
    console.log(applicantData);
    rejectApplication(applicantData.id)
    setRejectModal(false);
    setRejectReason('');
  }

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get('http://localhost:5000/admin/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
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
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
      return Promise.reject(error);
  });

  return (
    <>
      <div className="dean-view-applications">
        <div className="dean-view-header">
          <p>Pending Applications</p>
          <div>
            <label htmlFor="applications-dept">DEPARTMENT: </label>
            <select name="applications-dept" id='admin-select-course' onChange={(e)=>setSelectDept(e.target.value)} value={selectDept}>
              {dept_options} 
            </select>
             
            <label htmlFor="applications-course">COURSE: </label>
            <select name="applications-course" id='admin-select-course' onChange={(e)=>setSelectCourse(e.target.value)} value={selectCourse}>
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
        isOpen={adminModal}
        style={customStyles}
        ariaHideApp={false}>
            <SignaturePad
            canvasProps={{className: "sigPad"}}
            ref={sigPad}
            />
            <div className='flex'>
                <button onClick={sigClear}>CLEAR</button>
                <button onClick={()=>setAdminModal(false)}>CANCEL</button>
                <button onClick={sigSave}>ACCEPT</button>
                
            </div>
      </Modal>
      <Modal
        shouldCloseOnOverlayClick={true}
        isOpen={rejectModal}
        style={customStyles}
        ariaHideApp={false}>
            <textarea type="text" placeholder='Reason for Rejection...' cols={60} rows={10} onChange={(e)=>setRejectReason(e.target.value)} value={rejectReason}></textarea>
            <div className='flex'>
              <button onClick={()=>setRejectModal(false)}>CANCEL</button>
              <button onClick={logReason}>REJECT</button>
            </div>
            

      </Modal>
    </>
  )
}

export default ViewPendingApplications