import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import SignaturePad from 'react-signature-canvas'
import Modal from 'react-modal'
import { ToastContainer, toast } from 'react-toastify';


const EachApplication = ({application, handleAcceptApplication, handleRejectApplication}) => {
  return(
    <tr key={application.application_id}>
      <th scope='row' className='fit'>{application.student.student_id}</th>
      <td className='fit col-2'>{application.student.first_name} {application.student.last_name}</td>
      <td className='fit col-2'>{application.scholarship.scholarship_name}</td>
      <td className='fit col-3'>
        <a className='btn btn-info mr-3' href={`/admin/applications/review/${application.application_id}`} target="_blank">View Application</a>
        <button className="btn btn-success mx-1" onClick={()=>handleAcceptApplication(application.application_id)}>ACCEPT</button>
        <button className="btn btn-danger mx-1" onClick={()=>handleRejectApplication(application.application_id)}>REJECT</button>
      </td>
    </tr>
  )
} 

function ViewPendingApplications() {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [adminModal, setAdminModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectCourse, setSelectCourse] = useState('');
  const [selectDept, setSelectDept] = useState('');
  const [applications, setApplications] = useState([]);
  const [applicantData, setApplicantData] = useState([]);
  const [rejectReason, setRejectReason] = useState('');
  const [search, setSearch] = useState('');
  let adminSig = '';
  const navigate = useNavigate();

  let sigPad = useRef({});


  useEffect(()=>{
    getDepartments();
    refreshToken();
    getApplications();
  },[]);

  useEffect(()=>{
    if (selectDept == "") {
      setSelectCourse("");
  }else{
    getCourses();
  }
    if(search == "" && selectDept == "" && selectCourse == ""){
      getApplications();
    }  else if (search != "" && selectDept != "" && selectCourse != ""){
      getMultipleFilteredApplications();
    } else if (selectCourse != ""  && search == "" && selectDept == ""){
      getCourseFilteredApplications();
    } else if (selectDept != "" && search == "" && selectCourse == ""){
      getDeptFilteredApplications();
    } else if (search != ""  && selectDept == ""){
      getSearchedApplications(search);
    } else if (selectCourse == ""  && search != "" && selectDept != ""){
      getNameDeptFilteredApplications();
    } else if (search == ""  && selectDept != "" && selectCourse != ""){
      getCourseFilteredApplications();
    } else if (search != "" && selectDept != "" && selectCourse != ""){
      getMultipleFilteredApplications();
    } else if(search == "" && selectDept == "" && selectCourse == ""){
      getApplications();
    }
  },[search, selectDept, selectCourse]);

  useEffect(()=>{
    if (selectDept == "") {
      setSelectCourse("");
      setCourses([])
    }else{
      getCourses();
    }
    if(search == "" && selectDept != "" && selectCourse != ""){
      getDeptFilteredApplications();
    }
  },[selectDept]);

  
  const dept_options = departments.map(({dept_id, dept_code}) =>
    <option key={dept_id} value={dept_id}>{dept_code}</option>
  );
  const course_options = courses.map(({course_id, course_code}) =>
    <option key={course_id} value={course_id}>{course_code}</option>
  );


  const getDepartments = async () => {
    try{
       const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/departments`);
       setDepartments(response.data);
    }catch(e){console.log(e)}
  }

  const getCourses = async () => {
      try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/courses/${selectDept}`);
        setCourses(response.data);
      }catch(e){console.log(e)}
  }


  const getApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/applications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }
  
  const getSearchedApplications = async(id) => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/search/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getDeptFilteredApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/applications/department/${selectDept}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }
  const getCourseFilteredApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/applications/course/${selectCourse}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getMultipleFilteredApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/applications/${search}/${selectDept}/${selectCourse}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setApplications(response.data);
    }catch(e){
      console.log(e)
    }
  }

  const getNameDeptFilteredApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/name/dept/filter/${search}/${selectDept}`, {
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
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/application/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setApplicantData(response.data);
      console.log(response.data);
    } catch (error) {
        console.log(error);
    }
  }

  const acceptApplication = async (id) => {
    try {
      axiosJWT.patch(`${import.meta.env.VITE_API_URL}/admin/approve/application/${id}`,{
      admin_sign: adminSig,
    },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    getApplications();
    } catch (error) {
        console.log(error);
    }
  }

  const rejectApplication = async (id) => {
    try {
      axiosJWT.patch(`${import.meta.env.VITE_API_URL}/admin/reject/application/${id}`,{
        rejected_by: "Office Of Student Affairs (OSA)",
        reason_for_rejection: rejectReason
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }});
        getApplications();
    }catch (error) {
        console.log(error);
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
    acceptApplication(applicantData.application_id);
    console.log({...applicantData})
    getApplications();
    notify("Application approved");

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
    rejectApplication(applicantData.application_id)
    setRejectModal(false);
    setRejectReason('');
    getApplications();
    errNotify("Application rejected");

  }

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/token`);
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/token`);
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
      return Promise.reject(error);
  });

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
        adminSig = baseURL;
      }
    }
    
  }

  const acceptUpload = () => {
    setAdminModal(false)
    acceptApplication(applicantData.application_id);
    notify("Application approved");

  }
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

  return (
    <>
      <div className="dean-view-applications">
        <div className="dean-view-header">
          <h1 className='h2'>PENDING</h1>
          <div className='col-12 text-left d-flex align-items-center flex-wrap'>
            <div class="input-group h-25 col-5">
              <div class="input-group-prepend">
                <span class="input-group-text" >Name or Student ID</span>
              </div>
              <input type="text" name="searchField" className='searchField form-control'class="form-control" onChange={(e)=>{setSearch(e.target.value)}}/>
            </div>
            {/* <label htmlFor="searchField">Search Student ID or Name:  </label>
            <input type="text" name="searchField" className='searchField form-control' placeholder='e.g. Juan Dela Cruz' onChange={(e)=>{setSearch(e.target.value)}}/> */}

            <div className='flex flex-wrap'>
              {/* <label htmlFor="applications-dept">DEPARTMENT: </label>
              <select name="applications-dept" className='dept-select' id='admin-select-course' onChange={(e)=>setSelectDept(e.target.value)} value={selectDept}>
                <option value=""></option>
                {dept_options} 
              </select>
              <label htmlFor="applications-course">&nbsp;COURSE: </label>
              <select name="applications-course" className='course-select' id='admin-select-course' onChange={(e)=>setSelectCourse(e.target.value)} value={selectCourse}>
                <option value=""></option>
                {course_options} 
              </select> */}

              <div>
                <select name="applications-dept" className='course-select-admin custom-select mr-sm-2' id='dean-select-course' onChange={(e)=>setSelectDept(e.target.value)} value={selectDept}>
                  <option value="">Select a department</option>
                  {dept_options} 
                </select>
              </div>

              <div>
                <select name="applications-course" className='course-select-admin custom-select mr-sm-2' id='dean-select-course' onChange={(e)=>setSelectCourse(e.target.value)} value={selectCourse}>
                  <option value="">Select a course</option>
                  {course_options} 
                </select>
              </div>
            </div>
          </div>
          
        </div>
        <div className="dean-view-body">
          <table className='table table-responsive'>
            <thead>
              <tr>
              <th scope='col' className='fit'>Student ID</th>
                <th scope='col' className='fit'>Student Name</th>
                <th scope='col' className='fit'>Scholarship Type</th>
                <th scope='col' className='fit'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application)=>
                <EachApplication
                key={application.application_id}
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
                <button className='btnClear' onClick={sigClear}>CLEAR</button>
                <button className='btnCancel' onClick={()=>setAdminModal(false)}>CANCEL</button>
                <button className='btnApprove' onClick={sigSave}>APPROVE</button>
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
            <textarea type="text" placeholder='Reason for Rejection...' cols={60} rows={10} onChange={(e)=>setRejectReason(e.target.value)} value={rejectReason}></textarea>
            <div className='flex'>
              <button className='btnCancel' onClick={()=>setRejectModal(false)}>CANCEL</button>
              <button className='btnReject' onClick={logReason}>REJECT</button>
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
    </>
  )
}

export default ViewPendingApplications