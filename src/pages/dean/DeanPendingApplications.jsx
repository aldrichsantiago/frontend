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
      <td className='fit col-7'>{application.student.first_name} {application.student.last_name}</td>
      <td className='fit'>{application.scholarship.scholarship_name}</td>
      <td className='td-btn' id='td-btn'>
        <a className='btn btn-info mr-3' href={`/dean/applications/review/${application.application_id}`} target="_blank">View Application</a>
        <button className="btn btn-success mx-1" onClick={()=>handleAcceptApplication(application.application_id)}>ACCEPT</button>
        <button className="btn btn-danger mx-1" onClick={()=>handleRejectApplication(application.application_id)}>REJECT</button>
      </td>
    </tr>
  )
} 

function DeanPendingApplications() {
  const [deanId, setDeanId] = useState('');
  const [department, setDepartment] = useState('');
  const [courses, setCourses] = useState([]);
  const [dean, setDean] = useState({});
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


  useEffect(()=>{
    if(!token){
      refreshToken();
    }else{
      getDean();
    }
  },[deanId]);

  useEffect(()=>{
    getApplications();
    setTimeout(()=>{
      getApplications();
      getCourses();
    },800)
  },[dean, department]);


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

  

  const course_options = courses?.map(({course_id, course_code, course_name}) =>
    <option key={course_id} value={course_id}>{course_code}</option>
  );

  const getDean = async () => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/details/${deanId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      setDean(response.data);
      console.log(dean);
      console.log(department);
    }catch(e){
      console.log(e)
    }
  }

  const getCourses = async () => {
    try{
       const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/courses/${department}`);
       setCourses(response.data);
       console.log(courses)
    }catch(e){console.log(e)}
}

  const getApplications = async() => {
    try{
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/applications/dept/${dean?.dept_id}`, {
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
      const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dean/view/applications/dept/${department}/name/${search}`, {
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
        status: 'review',
        application_id: applicantData.application_id,
        dean_sign: deanSig,
        ...dataToPass
      };
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/create/review/application/${id}`,{
        ...dataToPass
    }, { headers: {
      Authorization: `Bearer ${token}`
    }});
    getApplications();

  } catch (error) {
        console.log(error);
    }
  }

  const rejectApplication = async (id) => {
    try {
      axiosJWT.patch(`${import.meta.env.VITE_API_URL}/create/rejected/application/${id}`,{
        status: 'rejected',
        rejected_by: dean.first_name + " " + dean.last_name + " (" + dean.department?.dept_code + " DEAN)",
        reason_for_rejection: rejectReason
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

  const handleAcceptApplication = (id) => {
    getApplicantData(id);
    console.log(applications)
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
    acceptApplication(applicantData.application_id);
    notify("Application accepted");

}


  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dean/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setDeanId(decoded.deanId);
      setDepartment(decoded.dept_id);
      console.log(decoded.dept_id);
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
      setDepartment(decoded.dept_id);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
      return Promise.reject(error);
  });

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
    rejectApplication(applicantData.application_id)
    setRejectModal(false);
    setRejectReason('');
    getApplications();
    errNotify("Application rejected");

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
    acceptApplication(applicantData.application_id);
    notify("Application accepted");
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
        <div className="dean-view-header flex flex-wrap align-items-center">
          <h2 className='h2 ml-3'>PENDING</h2>
          <div className='col-5 text-left display flex'>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" >Name or Student ID</span>
              </div>
              <input type="text" name="searchField" className='searchField form-control'class="form-control" onChange={(e)=>{setSearch(e.target.value)}}/>
            </div>
            {/* <label htmlFor="searchField">Search Student ID or Name:  </label>
            <input type="text" name="searchField" className='searchField form-control' placeholder='e.g. Juan Dela Cruz' onChange={(e)=>{setSearch(e.target.value)}}/> */}
          </div>
          <div>
            <select name="applications-course" className='course-select-dean custom-select mr-sm-2' id='dean-select-course' onChange={(e)=>setSelectChange(e.target.value)} value={selectChange}>
              <option value="">Select a course</option>
              {course_options} 
            </select>
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
              {applications?.map((application)=>
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
              <button className="btnApprove" onClick={sigSave}>ACCEPT</button>
            </div>
            <hr />
            <p style={{"textAlign":"center", "fontFamily": "Arial"}}>or upload a signature</p>
              <div className='flex'>
                <input type="file" accept='.jpeg, .jpg, .png' name="dean_sign" onChange={handleFileInputChange}/>
                <button className='btnApprove' onClick={()=>acceptUpload()}>ACCEPT</button>     
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

export default DeanPendingApplications