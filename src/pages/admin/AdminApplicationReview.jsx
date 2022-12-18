import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Logo from '../../assets/logo.png'

function AdminApplicationReview() {
    let { id } = useParams();
    const [applicantData, setApplicantData] = useState({});
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();


    useEffect(()=>{
        refreshToken();
        getApplicantData();
    },[id]);

    const getApplicantData = async() => {
        try {
            const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/application/${id}`,{
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

      let non_abbv_dept = ''
      if(applicantData.department == "CECT"){
        non_abbv_dept = "College of Engineering and Computer Technology"
      } else if (applicantData.department == "CAS") {
        non_abbv_dept = "College of Arts & Sciences"
      } else if (applicantData.department == "CBA") {
        non_abbv_dept = "College of Business and Accountancy"
      } else if (applicantData.department == "CCJE") {
        non_abbv_dept = "College of Criminal Justice Education"
      } else if (applicantData.department == "CoEd") {
        non_abbv_dept = "College of Education"
      } else if (applicantData.department == "CHTM") {
        non_abbv_dept = "College of Hospitality and Tourism Management"
      } else if (applicantData.department == "CONAMS") {
        non_abbv_dept = "College of Nursing and Allied Sciences"
      }  else if (applicantData.department == "MEDICINE") {
        non_abbv_dept = "College of MEDICINE"
      } else if (applicantData.department == "JWSLG") {
        non_abbv_dept = "John Wesley School of Law and Governance"
      }

      let dateofscholarship='';
      if(applicantData.date_submitted != null){
        dateofscholarship = applicantData.date_submitted;
        dateofscholarship = dateofscholarship.split('T');
      }

      let fullNameOfApplicant = '';
      let middleName = '';
      let middleInit = '';
      if(applicantData.last_name != null || applicantData.first_name != null || applicantData.middle_name != null){
        middleName = applicantData.middle_name;
        if(middleName.includes(' ')){
            middleName = middleName.split(' ');
            middleInit = middleName[0][0] + '.' + middleName[1][0] + '.';
            middleName = middleName[0] + middleName[1];
        }else{
            middleInit = middleName[0] + '.';
        }
        fullNameOfApplicant = applicantData.first_name + " " + middleInit+ " " + applicantData.last_name;
        fullNameOfApplicant = fullNameOfApplicant.toUpperCase();
      }

  return (
    <div className='dean-review-application'>
        <div className="dean-review-header">
            <div className="uni-details">
                <div>
                    <img src={Logo} alt="" width={90}/>
                </div>
                <div>
                    <h3>WESLEYAN UNIVERSITY-PHILIPPINES</h3>
                    <h5>Cushman Campus</h5>
                    <h5>Mabini Extension, Cabanatuan City</h5>
                    <h5>Philippines 3100</h5>
                </div>
            </div>
            <h3>OFFICE OF STUDENT AFFAIRS</h3>
            <h5>G/F Bishop Dionisio D. Alejandro Hall, Computer Science Building</h5>
            <h5>(044) 463 2162 Local 185 | osa@wesleyan.edu.ph</h5>
        </div>
        
        <div className="dean-review-body">
            <div className="scholarship-form-msg">
                <div className="scholar-details">
                    {applicantData.createdAt? <p>Date: {dateofscholarship[0]}</p> : <></>}
                    {applicantData.contact_no? <p>Contact #: {applicantData.contact_no}</p> : <></>}
                </div>
               <div>
                <p>The Scholarship Committee</p>
                <br />
                <p>Sir/Madam:</p>
                <br />
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;May I/we apply fot the scholarhsip priveleges in the&nbsp;  
                    <strong>{non_abbv_dept}</strong>&nbsp;this <strong>{applicantData.semester}</strong> semester, S.Y. <strong>{applicantData.school_year}</strong>.
                </p>
                <br />
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I/we promise to abide by the scholarhisp rules and regulations of Wesleyan University-Philippines and shall do my best to perform duties assigned by the Administration reserving to itself the right to suspend any or all of its scholarship priveleges granted to me.
                </p>
                </div>
                <br />
                <div className="signatures">
                    <div className='student-signature'>
                        <p>Respectfully yours,</p>
                        <img src={applicantData.student_sign} alt="" width={150}/>
                        <h3>{fullNameOfApplicant}</h3>
                        <h5>STUDENT'S PRINTED NAME & SIGNATURE</h5>
                    </div>
                    <div className='higher-ups-signs'>
                        <div>
                            <h5>RECOMMENDED BY: </h5>
                            <br />
                            <br />
                            <img src={applicantData.admin_sign} alt="Admin Signature" width={150}/>
                            <h5>OFFICE OF STUDENT AFFAIRS</h5>
                        </div>
                        <div>
                            <img src={applicantData.dean_sign} alt="Dean Signature" width={150}/>
                            <h5>DEAN/PRINCIPAL</h5>
                        </div>
                       
                    </div>
                    
                </div>
            </div>

            <div className="applicant-data">
                <h3>Student ID: {applicantData.student_id}</h3>
                <h3>Name: {applicantData.last_name}, {applicantData.first_name}, {applicantData.middle_name}</h3>
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
                            <td>{applicantData.units_1 == 0 ? '' : applicantData.units_1}</td>
                            <td>{applicantData.subj_7}</td>
                            <td>{applicantData.units_7 == 0 ? '' : applicantData.units_7}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subj_2}</td>
                            <td>{applicantData.units_2 == 0 ? '' : applicantData.units_1}</td>
                            <td>{applicantData.subj_8}</td>
                            <td>{applicantData.units_8 == 0 ? '' : applicantData.units_1}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subj_3}</td>
                            <td>{applicantData.units_3 == 0 ? '' : applicantData.units_1}</td>
                            <td>{applicantData.subj_9}</td>
                            <td>{applicantData.units_9 == 0 ? '' : applicantData.units_1}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subj_4}</td>
                            <td>{applicantData.units_4 == 0 ? '' : applicantData.units_1}</td>
                            <td>{applicantData.subj_10}</td>
                            <td>{applicantData.units_10 == 0 ? '' : applicantData.units_10}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subj_5}</td>
                            <td>{applicantData.units_5 == 0 ? '' : applicantData.units_1}</td>
                            <td>{applicantData.subj_11}</td>
                            <td>{applicantData.units_11 == 0 ? '' : applicantData.units_11}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subj_6}</td>
                            <td>{applicantData.units_6 == 0 ? '' : applicantData.units_1}</td>
                            <td>{applicantData.subj_12}</td>
                            <td>{applicantData.units_12 == 0 ? '' : applicantData.units_12}</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <h4>TOTAL UNITS: {applicantData.units_1 + applicantData.units_2 + applicantData.units_3 + applicantData.units_4 + applicantData.units_5 + applicantData.units_6 + applicantData.units_7 + applicantData.units_8 + applicantData.units_9 + applicantData.units_10 + applicantData.units_11 + applicantData.units_12}</h4>
            </div>

            {/* <div className="signatures">
                <div className="student-sign">
                    <img src={applicantData.student_sign} alt="Student's Signature Here" width={150}/>
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
            </div> */}


            <div className="other-reqs">
                <img src={applicantData.req_1  == '' || null ? '' : applicantData.req_1} />
                <img src={applicantData.req_2  == '' || null ? '' : applicantData.req_2} />
                <img src={applicantData.req_3  == '' || null ? '' : applicantData.req_3} />
                <img src={applicantData.req_4  == '' || null ? '' : applicantData.req_4} />
                <img src={applicantData.req_5  == '' || null ? '' : applicantData.req_5} />
                <img src={applicantData.req_6  == '' || null ? '' : applicantData.req_6} />
                <img src={applicantData.req_7  == '' || null ? '' : applicantData.req_7} />
                <img src={applicantData.req_8  == '' || null ? '' : applicantData.req_8} />
                <img src={applicantData.req_9  == '' || null ? '' : applicantData.req_9} />
                <img src={applicantData.req_10 == '' || null ? '' : applicantData.req_10} />
            </div>
        </div>
        
    </div>   
  )
}

export default AdminApplicationReview