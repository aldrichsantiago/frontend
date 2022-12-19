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
  const [name, setName] = useState('');
  const [expire, setExpire] = useState('');
  const [rejected, setRejected] = useState([]);
  const [approved, setApproved] = useState([]);
  const [review, setReview] = useState([]);
  const [submitted, setSubmitted] = useState([]);
  const [student_id, setStudentId] = useState('');

  const navigate = useNavigate();

  useEffect(()=>{
    refreshToken();
    
  },[token]);
  useEffect(()=>{
    getStatus();
    
  },[student_id]);

  const getRejected = async () => {
    const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/student/application/rejected/${student_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
  });
    setRejected(response.data);
  }
  const getApproved = async () => {
    const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/student/application/approved/${student_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
  });
    setApproved(response.data);
  }
  const getReview = async () => {
    const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/student/application/review/${student_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
  });
    setReview(response.data);
  }
  const getSubmitted = async () => {
    const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/student/application/submitted/${student_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
  });
    setSubmitted(response.data);
  }

  const getStatus = async() => {
    getApproved();
    getRejected();
    getReview();
    getSubmitted();
  }
  

  const refreshToken = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.first_name + ' ' + decoded.last_name);
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
      setName(decoded.last_name);
      setStudentId(decoded.studentId);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
      return Promise.reject(error);
  });

  console.log(rejected, approved, review, submitted);

  let status = <DefaultStatus/>;
  if(rejected != 0 ){
    status = <RejectedStatus rejectedBy={rejected[rejected.length-1].rejected_by} reason={rejected[rejected.length-1].reason_of_rejection}/>
  }
  if(approved.length != 0){
    status = <ApprovedStatus/>
  }
  if(submitted.length != 0 || review.length != 0 ){
    status = <SubmittedReviewStatus/>
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
          {status}
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