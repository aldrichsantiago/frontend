import React, {useState,  useEffect} from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify';
import PendingStudentReadOnlyRow from './../../../components/PendingStudentsReadOnlyRow'

function ManagePendingStudentRegistrations() {
    const [students, setStudents] = useState();
    const [token, setToken] = useState();
    const [expire, setExpire] = useState('');
    const [addStudentFormData, setAddStudentFormData] = useState({
        student_id: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        contact_no: "",
        email: "",
        department: "",
        course: "",
        year: "",
    });

    const [editStudentFormData, setEditStudentFormData] = useState({
        last_name: "",
        first_name: "",
        middle_name: "",
        contact_no: "",
        email: "",
        course: "",
        year: "",
        student_id: ""
    });

    const [editStudenttId, setEditStudenttId] = useState(null);

    useEffect(() => {
      refreshToken();
      getStudents();
    }, []);

    const getStudents = async () => {
      try{
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/pendingstudents/get`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStudents(response.data);
      }catch(e){
        console.log(e);
      }
    }

    const approveStudent = async (StudentId) => {
      let text = "✅ Do you want to approve this student's registration? "
      if(confirm(text) == true){
        try {
          const index = students.findIndex((student) => student.id === StudentId);
          const student = students[index];
          await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/approve/registration/student`, {
            student_id: student.student_id
          },{
            headers: {
              Authorization: `Bearer ${token}`
          }});

          getStudents()
          notify("Student has been approved");
        } catch (error) {console.log(error);}
      }else{}
    }

    const rejectStudent = async (id) => {
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/reject/registration/student/${id}`,{

      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      getStudents();

    }


    const handleDeleteClick = (studenttId) => {
      let text = "❌ Do you want to reject this student's registration? "
      if(confirm(text) == true){
        const newStudents = [...students];

        const index = students.findIndex((student) => student.id === studenttId);

        newStudents.splice(index, 1);

        setStudents(newStudents);
        rejectStudent(studenttId)
        errNotify("Student has been rejected");

      }else{}
    };

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
    console.log(students)


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
        <div style={{display:'flex', gap:'1em', textAlign:'left', width: '100%'}}>
            <h1>Pending Student Registrations</h1>
        </div>
        <form>
          <table className='table table-responsive'>
            <thead>
              <tr>
                <th scope='col' className='fit'>Student ID</th>
                <th scope='col' className='fit'>Last Name</th>
                <th scope='col' className='fit'>First Name</th>
                <th scope='col' className='fit'>Middle Name</th>
                <th scope='col' className='fit'>Contact No.</th>
                <th scope='col' className='fit'>Email</th>
                <th scope='col' className='fit'>Department</th>
                <th scope='col' className='fit'>Course</th>
                <th scope='col' className='fit'>Year</th>
                <th scope='col' className='fit'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((student) => (
                <>
                  {(
                    <PendingStudentReadOnlyRow
                      key={student.id}
                      student={student}
                      handleApproveClick={approveStudent}
                      handleRejectClick={handleDeleteClick}
                    />
                  )}
                </>
              ))}
            </tbody>
          </table>
        </form>
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
    </>
    )
}

export default ManagePendingStudentRegistrations