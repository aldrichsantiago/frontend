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
            document.title = response.data.student?.student_id + " " + response.data.status.toUpperCase() +" Application"

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

      let dateofscholarship='';
      if(applicantData.createdAt != null){
        dateofscholarship = applicantData.createdAt;
        dateofscholarship = dateofscholarship.split('T');
      }

      let fullNameOfApplicant = '';
      let middleName = '';
      let middleInit = '';
      if(applicantData.student?.last_name != null || applicantData.student?.first_name != null || applicantData.student?.middle_name != null){
        middleName = applicantData.student?.middle_name;
        if(middleName.includes(' ')){
            middleName = middleName.split(' ');
            middleInit = middleName[0][0] + '.' + middleName[1][0] + '.';
            middleName = middleName[0] + middleName[1];
        }else{
            middleInit = middleName[0] + '.';
        }
        fullNameOfApplicant = applicantData.student?.first_name + " " + middleInit+ " " + applicantData.student?.last_name;
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
                    {applicantData.student?.contact_no? <p>Contact #: {applicantData.student?.contact_no}</p> : <></>}
                </div>
               <div>
                <p>The Scholarship Committee</p>
                <br />
                <p>Sir/Madam:</p>
                <br />
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;May I/we apply for the scholarhsip priveleges in the&nbsp;  
                    <strong>{applicantData.student?.department.dept_name}</strong>&nbsp;this <strong>{applicantData.semester}</strong> semester, S.Y. <strong>{applicantData.school_year}</strong>.
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
                <h3>Student ID: {applicantData.student?.student_id}</h3>
                <h3>Name: {applicantData.student?.last_name}, {applicantData.student?.first_name}, {applicantData.student?.middle_name}</h3>
                <h3>Year Level: {applicantData.student?.year}</h3>
                <h3>Department: {applicantData.student?.department.dept_name + " (" + applicantData.student?.department.dept_code + ")"}</h3>
                <h3>Course: {applicantData.student?.course.course_name + " (" + applicantData.student?.course.course_code + ")"}</h3>
                <h3>Email: {applicantData.student?.email}</h3>
                <h3>Contact No.: {applicantData.student?.contact_no}</h3>
                <h3>Scholarship Type: {applicantData.scholarship?.scholarship_name}</h3>
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
                            <td>{applicantData.subject_unit?.subject_1}</td>
                            <td>{applicantData.subject_unit?.unit_1 == 0 ? '' : applicantData.subject_unit?.unit_1}</td>
                            <td>{applicantData.subject_unit?.subject_7}</td>
                            <td>{applicantData.subject_unit?.unit_7 == 0 ? '' : applicantData.subject_unit?.unit_7}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subject_unit?.subject_2}</td>
                            <td>{applicantData.subject_unit?.unit_2 == 0 ? '' : applicantData.subject_unit?.unit_2}</td>
                            <td>{applicantData.subject_unit?.subject_8}</td>
                            <td>{applicantData.subject_unit?.unit_8 == 0 ? '' : applicantData.subject_unit?.unit_8}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subject_unit?.subject_3}</td>
                            <td>{applicantData.subject_unit?.unit_3 == 0 ? '' : applicantData.subject_unit?.unit_3}</td>
                            <td>{applicantData.subject_unit?.subject_9}</td>
                            <td>{applicantData.subject_unit?.unit_9 == 0 ? '' : applicantData.subject_unit?.unit_9}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subject_unit?.subject_4}</td>
                            <td>{applicantData.subject_unit?.unit_4 == 0 ? '' : applicantData.subject_unit?.unit_4}</td>
                            <td>{applicantData.subject_unit?.subject_10}</td>
                            <td>{applicantData.subject_unit?.unit_10 == 0 ? '' : applicantData.subject_unit?.unit_10}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subject_unit?.subject_5}</td>
                            <td>{applicantData.subject_unit?.unit_5 == 0 ? '' : applicantData.subject_unit?.unit_5}</td>
                            <td>{applicantData.subject_unit?.subject_11}</td>
                            <td>{applicantData.subject_unit?.unit_11 == 0 ? '' : applicantData.subject_unit?.unit_11}</td>
                        </tr>
                        <tr>
                            <td>{applicantData.subject_unit?.subject_6}</td>
                            <td>{applicantData.subject_unit?.unit_6 == 0 ? '' : applicantData.subject_unit?.unit_6}</td>
                            <td>{applicantData.subject_unit?.subject_12}</td>
                            <td>{applicantData.subject_unit?.unit_12 == 0 ? '' : applicantData.subject_unit?.unit_12}</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <h4>TOTAL UNITS: {applicantData.subject_unit?.unit_1 + applicantData.subject_unit?.unit_2 + applicantData.subject_unit?.unit_3 + applicantData.subject_unit?.unit_4 + applicantData.subject_unit?.unit_5 + applicantData.subject_unit?.unit_6 + applicantData.subject_unit?.unit_7 + applicantData.subject_unit?.unit_8 + applicantData.subject_unit?.unit_9 + applicantData.subject_unit?.unit_10 + applicantData.subject_unit?.unit_11 + applicantData.subject_unit?.unit_12}</h4>
            </div>

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