import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Logo from '../../assets/logo.png'

function AdminApplicationReview() {
    let { id } = useParams();
    const [applicantData, setApplicantData] = useState({});
    const [applicantReqs, setApplicantReqs] = useState([]);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');


    useEffect(()=>{
        refreshToken();
        getApplicantData();
    },[id]);

    const getApplicantData = async() => {
        try {
            const response = await axiosJWT.get(`http://localhost:5000/admin/view/application/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
        });
            setApplicantData(response.data);
        } catch (error) {
            console.log(error);
        }
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
    <div className='dean-review-application'>
        <div className="dean-review-header">
            <img src={Logo} alt="" width={90}/>
            <h3>WESLEYAN UNIVERSITY-PHILIPPINES</h3>
            <h5>Cushman Campus</h5>
            <h5>Mabini Extension, Cabanatuan City</h5>
            <h5>Philippines 3100</h5>
            <br />
            <h1>OFFICE FOR STUDENT AFFAIRS</h1>
            <h5>{applicantData.date_submitted}</h5>
        </div>
        <div className="dean-review-body">
            <div className="applicant-data">
                <h3>Student ID: {applicantData.student_id}</h3>
                <h3>Name: {applicantData.first_name} {applicantData.last_name}</h3>
                <h3>Year Level: {applicantData.year}</h3>
                <h3>Department: {applicantData.department}</h3>
                <h3>Course: {applicantData.course}</h3>
                <h3>Email: {applicantData.email}</h3>
                <h3>Contact No.: {applicantData.contact_no}</h3>
                <h3>Scholarship Type: {applicantData.scholarship_type}</h3>
            </div>
            <div className="subj-codes-units-table">
                <table>
                    <thead>
                        <tr>
                            <td>Subject Codes</td>
                            <td>Units</td>
                            <td>Subject Codes</td>
                            <td>Units</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{applicantData.subj_1}</td>
                            <td>{applicantData.units_1}</td>
                            <td>{applicantData.subj_7}</td>
                            <td>{applicantData.units_7}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subj_2}</td>
                            <td>{applicantData.units_2}</td>
                            <td>{applicantData.subj_8}</td>
                            <td>{applicantData.units_8}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subj_3}</td>
                            <td>{applicantData.units_3}</td>
                            <td>{applicantData.subj_9}</td>
                            <td>{applicantData.units_9}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subj_4}</td>
                            <td>{applicantData.units_4}</td>
                            <td>{applicantData.subj_10}</td>
                            <td>{applicantData.units_10}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subj_5}</td>
                            <td>{applicantData.units_5}</td>
                            <td>{applicantData.subj_11}</td>
                            <td>{applicantData.units_11}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subj_6}</td>
                            <td>{applicantData.units_6}</td>
                            <td>{applicantData.subj_12}</td>
                            <td>{applicantData.units_12}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="signatures">
                <div className="student-sign">
                    <img src={applicantData.student_sign} alt="" width={150}/>
                    <h3>{applicantData.first_name} {applicantData.last_name}</h3>
                    <p>---------------------------------------------</p>
                    <h4>STUDENT'S SIGNATURE</h4>
                </div>
                <div className="dean-sign">
                    <img src={applicantData.dean_sign} alt="Dean's Signature Here" width={150}/>
                    <p>---------------------------------------------</p>
                    <h4>DEAN'S SIGNATURE</h4>
                </div>
                <div className="admin-sign">
                    <img src={applicantData.admin_sign} alt="OSA's Signature Here" width={150}/>
                    <p>---------------------------------------------</p>
                    <h4>OSA SIGNATURE</h4>
                </div>
            </div>


            <div className="other-reqs">
                <img src={applicantData.req_1} alt="REQUIREMENT #1" />
                <img src={applicantData.req_2} alt="REQUIREMENT #2" />
                <img src={applicantData.req_3} alt="REQUIREMENT #3" />
                <img src={applicantData.req_4} alt="REQUIREMENT #4" />
                <img src={applicantData.req_5} alt="REQUIREMENT #5" />
                <img src={applicantData.req_6} alt="REQUIREMENT #6" />
                <img src={applicantData.req_7} alt="REQUIREMENT #7" />
                <img src={applicantData.req_8} alt="REQUIREMENT #8" />
                <img src={applicantData.req_9} alt="REQUIREMENT #9" />
                <img src={applicantData.req_10} alt="REQUIREMENT #10" />
            </div>
        </div>
        
    </div>
  )
}

export default AdminApplicationReview