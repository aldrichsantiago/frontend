import React, {useState, useEffect} from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'
import { ToastContainer, toast } from 'react-toastify';
import './styles/ApplicationStatus.css'
import 'react-toastify/dist/ReactToastify.css';
import Checked  from './../../assets/checked.png'
import Unchecked from './../../assets/unchecked.png'
import Crossed from './../../assets/rejected_box.png'

function RejectedStatus(props){
  return(
    <>
      <div className="application-submitted">
        <img src={Checked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION SUBMITTED</h2>
        <p></p>
      </div>
      <div className="application-review">
        <img src={Checked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION UNDER REVIEW</h2> 
      </div>
      <div className="application-approved">
        <img src={Crossed} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION APPROVED</h2>
        <p></p>
        <div>
          <p>Rejected By: {props.rejectedBy}</p>
          <p>Reason: {props.reason}</p>
        </div>
      </div>
    </>

  )
}
function ApprovedStatus(){
  return(
    <>
      <div className="application-submitted">
        <img src={Checked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION SUBMITTED</h2>
        <p></p>
      </div>
      <div className="application-review">
        <img src={Checked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION UNDER REVIEW</h2>
        <p></p>
      </div>
      <div className="application-approved">
        <img src={Checked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION APPROVED</h2>
        <p></p>
      </div>
    </>

  )
}
function DefaultStatus(){
  return(
    <>
      <div className="application-submitted">
        <img src={Unchecked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION SUBMITTED</h2>
        <p></p>
      </div>
      <div className="application-review">
        <img src={Unchecked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION UNDER REVIEW</h2>
        <p></p>
      </div>
      <div className="application-approved">
        <img src={Unchecked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION APPROVED</h2>
        <p></p>
      </div>
    </>

  )
}
function SubmittedReviewStatus(props){
  return(
    <>
      <div className="application-submitted">
        <img src={Checked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION SUBMITTED</h2>
        <p></p>
      </div>
      <div className="application-review">
        <img src={Checked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION UNDER REVIEW</h2>
      </div>
      <div className="application-approved">
        <img src={Unchecked} alt="timeline-status" width={50}/>
        <h2>SCHOLARSHIP APPLICATION APPROVED</h2>
        <p></p>
      </div>
    </>

  )
}


function ApplicationStatus() {
  const [token, setToken] = useState();
  const [student, setStudent] = useState({});
  const [application, setApplication] = useState({});
  const [expire, setExpire] = useState('');
  const [student_id, setStudentId] = useState('');
  const [status, setStatus] = useState('');

  const navigate = useNavigate();

  useEffect(()=>{
    refreshToken();
    getStudent();
  },[token,student_id]);

  useEffect(()=>{
    getStatus();
  },[student]);

  useEffect(()=>{
    setTimeout(()=>{
      getStatus();
      console.log('hello')
    },1000);
  },[]);

  const getStudent = async() => {
    try{
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/student/min/details/${student_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
              }
    });
        setStudent(response.data);
    }catch(e){
        console.log(e);
    }
  }

  const getStatus = async () => {
    const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/student/application/status/${student.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
  });
    setApplication(response.data);
    setStatus(response.data.status)
  }

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setStudentId(decoded.studentId);
      console.log(student_id);
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


  let status_component = <DefaultStatus/>;
  if(status == 'rejected'){
    status_component = <RejectedStatus rejectedBy={application?.rejected_by} reason={application?.reason_for_rejection}/>
  }
  if(status == 'approved'){
    status_component = <ApprovedStatus/>
  }
  if(status == 'submitted' || status == 'review'){
    status_component = <SubmittedReviewStatus/>
  }

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
    <Layout>
      <div className="application-status-container">
        <h1>Application Status: </h1>
        <div className="status-timeline">
          {status_component}
        </div>
      </div>

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
  )
}

export default ApplicationStatus