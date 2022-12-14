import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Logo from '../../../assets/logo.png'


function OneApplication ({application}) {

    let non_abbv_dept = ''
    if(application.department == "CECT"){
      non_abbv_dept = "College of Engineering and Computer Technology"
    } else if (application.department == "CAS") {
      non_abbv_dept = "College of Arts & Sciences"
    } else if (application.department == "CBA") {
      non_abbv_dept = "College of Business and Accountancy"
    } else if (application.department == "CCJE") {
      non_abbv_dept = "College of Criminal Justice Education"
    } else if (application.department == "CoEd") {
      non_abbv_dept = "College of Education"
    } else if (application.department == "CHTM") {
      non_abbv_dept = "College of Hospitality and Tourism Management"
    } else if (application.department == "CONAMS") {
      non_abbv_dept = "College of Nursing and Allied Sciences"
    }  else if (application.department == "MEDICINE") {
      non_abbv_dept = "College of Medicine"
    } else if (application.department == "JWSLG") {
      non_abbv_dept = "John Wesley School of Law and Governance"
    }

    let dateofscholarship='';
    if(application.createdAt != null){
      dateofscholarship = application.createdAt;
      dateofscholarship = dateofscholarship.split('T');
    }

    let fullNameOfApplicant = '';
    let middleName = '';
    let middleInit = '';
    if(application.last_name != null || application.first_name != null || application.middle_name != null){
      middleName = application.middle_name;
      if(middleName.includes(' ')){
          middleName = middleName.split(' ');
          middleInit = middleName[0][0] + '.' + middleName[1][0] + '.';
          middleName = middleName[0] + middleName[1];
      }else{
          middleInit = middleName[0] + '.';
      }
      fullNameOfApplicant = application.first_name + " " + middleInit+ " " + application.last_name;
      fullNameOfApplicant = fullNameOfApplicant.toUpperCase();
    }
    return(
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
                    {application.createdAt? <p>Date: {dateofscholarship[0]}</p> : <></>}
                    {application.contact_no? <p>Contact #: {application.contact_no}</p> : <></>}
                </div>
               <div>
                <p>The Scholarship Committee</p>
                <br />
                <p>Sir/Madam:</p>
                <br />
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;May I/we apply fot the scholarhsip priveleges in the&nbsp;  
                    <strong>{non_abbv_dept}</strong>&nbsp;this <strong>{application.semester}</strong> semester, S.Y. <strong>{application.school_year}</strong>.
                </p>
                <br />
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I/we promise to abide by the scholarhisp rules and regulations of Wesleyan University-Philippines and shall do my best to perform duties assigned by the Administration reserving to itself the right to suspend any or all of its scholarship priveleges granted to me.
                </p>
                </div>
                <br />
                <div className="signatures">
                    <div className='student-signature'>
                        <p>Respectfully yours,</p>
                        <img src={application.student_sign} alt="" width={150}/>
                        <h3>{fullNameOfApplicant}</h3>
                        <h5>STUDENT'S PRINTED NAME & SIGNATURE</h5>
                    </div>
                    <div className='higher-ups-signs'>
                        <div>
                            <h5>RECOMMENDED BY: </h5>
                            <br />
                            <img src={application.admin_sign} alt="Admin Signature" width={150}/>
                            <h5>Adviser/Director/District Superintendent</h5>
                        </div>
                        <div>
                            <img src={application.dean_sign} alt="Dean Signature" width={150}/>
                            <h5>DEAN/PRINCIPAL</h5>
                        </div>
                       
                    </div>
                    
                </div>
            </div>

            <div className="applicant-data">
                <h3>Student ID: {application.student_id}</h3>
                <h3>Name: {application.last_name}, {application.first_name}, {application.middle_name}</h3>
                <h3>Year Level: {application.year}</h3>
                <h3>Department: {application.department}</h3>
                <h3>Course: {application.course}</h3>
                <h3>Email: {application.email}</h3>
                <h3>Contact No.: {application.contact_no}</h3>
                <h3>Scholarship Type: {application.scholarship_type}</h3>
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
                            <td>{application.subj_1}</td>
                            <td>{application.units_1 == 0 ? '' : application.units_1}</td>
                            <td>{application.subj_7}</td>
                            <td>{application.units_7 == 0 ? '' : application.units_7}</td>
                        </tr>
                        <tr>
                            <td>{application.subj_2}</td>
                            <td>{application.units_2 == 0 ? '' : application.units_1}</td>
                            <td>{application.subj_8}</td>
                            <td>{application.units_8 == 0 ? '' : application.units_1}</td>
                        </tr>
                        <tr>
                            <td>{application.subj_3}</td>
                            <td>{application.units_3 == 0 ? '' : application.units_1}</td>
                            <td>{application.subj_9}</td>
                            <td>{application.units_9 == 0 ? '' : application.units_1}</td>
                        </tr>
                        <tr>
                            <td>{application.subj_4}</td>
                            <td>{application.units_4 == 0 ? '' : application.units_1}</td>
                            <td>{application.subj_10}</td>
                            <td>{application.units_10 == 0 ? '' : application.units_10}</td>
                        </tr>
                        <tr>
                            <td>{application.subj_5}</td>
                            <td>{application.units_5 == 0 ? '' : application.units_1}</td>
                            <td>{application.subj_11}</td>
                            <td>{application.units_11 == 0 ? '' : application.units_11}</td>
                        </tr>
                        <tr>
                            <td>{application.subj_6}</td>
                            <td>{application.units_6 == 0 ? '' : application.units_1}</td>
                            <td>{application.subj_12}</td>
                            <td>{application.units_12 == 0 ? '' : application.units_12}</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <h4>TOTAL UNITS: {application.units_1 + application.units_2 + application.units_3 + application.units_4 + application.units_5 + application.units_6 + application.units_7 + application.units_8 + application.units_9 + application.units_10 + application.units_11 + application.units_12}</h4>
            </div>

            <div className="other-reqs">
                <img src={application.req_1  == '' || null ? '' : application.req_1} />
                <img src={application.req_2  == '' || null ? '' : application.req_2} />
                <img src={application.req_3  == '' || null ? '' : application.req_3} />
                <img src={application.req_4  == '' || null ? '' : application.req_4} />
                <img src={application.req_5  == '' || null ? '' : application.req_5} />
                <img src={application.req_6  == '' || null ? '' : application.req_6} />
                <img src={application.req_7  == '' || null ? '' : application.req_7} />
                <img src={application.req_8  == '' || null ? '' : application.req_8} />
                <img src={application.req_9  == '' || null ? '' : application.req_9} />
                <img src={application.req_10 == '' || null ? '' : application.req_10} />
            </div>
        </div>
            <hr />
            <hr />
    </div>
    )
}


function ViewAllApprovedApplications() {
    const [approvedApplications, setApprovedApplications] = useState();
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');


    useEffect(()=>{
        refreshToken();
        getApprovedApplications();
    },[]);

    const getApprovedApplications = async() => {
        try {
            const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/view/approved/applications`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
        });
            setApprovedApplications(response.data);
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

  return (

    <>
        {
            approvedApplications?.map((application)=>
                <OneApplication application={application}/>
            )
        }
    </>
        
    )

}

export default ViewAllApprovedApplications