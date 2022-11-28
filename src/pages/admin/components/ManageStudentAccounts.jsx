import React, {useState,  useEffect} from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify';
import StudentReadOnlyRow from './../../../components/StudentReadOnlyRow'
import StudentEditableRow from './../../../components/StudentEditableRow'

function ManageStudentAccounts() {
    const [students, setStudents] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [selectDept, setSelectDept] = useState('');
    const [selectCourse, setSelectCourse] = useState('');
    const [addStudentFormData, setAddStudentFormData] = useState({
        student_id: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        contact_no: "",
        email: "",
        department: '',
        course: '',
        year: "",
        password: "",
        confPassword: "",
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
    const [changePassModal, setChangePassModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({

    });


    const departments = ["Choose a Department","CECT", "CONAMS", "CBA", "CHTM", "CAS", "CoEd", "CCJE", "Medicine", "JWSLG", "High School", "Elementary"];
    let courses = ["Choose a Course"];

    if (selectDept == "CECT"){
        courses = ["","Bachelor of Science in Information Technology", "Bachelor of Science in Electronics Engineering", "Bachelor of Science in Computer Engineering"];
    }else if (selectDept == "CONAMS"){
        courses = ["","Bachelor of Science in Nursing", "Bachelor of Science in Radiologic Technology", "Bachelor of Science in Medical Technology", "Bachelor of Science in Physical Therapy", "Bachelor of Science in Pharmacy"];
    }else if (selectDept == "CHTM"){
        courses = ["","Bachelor of Science in Hospitality Management major in Culinary and Kitchen Operations", "Bachelor of Science in Hospitality Management major in Hotel and Restaurant Administration", "Bachelor of Science in Tourism Management"];
    }else if (selectDept == "CBA"){
        courses = ["","Bachelor of Science in Accountancy", "Bachelor of Science in Accounting Technology", "Bachelor of Science in Business Administration"];
    }else if (selectDept == "CAS"){
        courses = ["","Bachelor of Arts in Communication ", "Bachelor of Arts in Political Science", "Bachelor of Arts in Psychology", "Bachelor of Arts in Theology", "Bachelor of Science in Psychology", "Bachelor of Science in Biology", "Bachelor of Science in Social Work"];
    }else if (selectDept == "CoEd"){
        courses = ["","Bachelor of Elementary Education", "Bachelor of Physical Education"];
    }else if (selectDept == "CCJE"){
        courses = ["","Bachelor of Science in Criminology"];
    }else if (selectDept == "Medicine"){
        courses = ["",""];
    }else if (selectDept == "JWSLG"){
        courses = ["",""];
    }else if (selectDept == "High School"){
        courses = ["","Junior High School", "Senior High School"];
    }else if (selectDept == "Elementary"){
        courses = ["","GRADE 1 to 3 ( Primary Level )", "GRADE 4 to 6 ( Intermediate Level )"];
    }else{
        courses = [""];
    }

  const dept_options = departments.map((dept) =>
    <option key={dept} value={dept}>{dept}</option>
  );

  const course_options = courses.map((course) =>
    <option key={course} value={course}>{course}</option>
  );


    useEffect(() => {
        refreshToken();
        getStudents();
    }, []);

    const getStudents = async () => {
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/students/get`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStudents(response.data);
    }

    const updateStudent = async (id) => {
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/update/student/${id}`, {
        last_name: editStudentFormData.last_name,
        first_name: editStudentFormData.first_name,
        middle_name: editStudentFormData.middle_name,
        contact_no: editStudentFormData.contact_no,
        email: editStudentFormData.email,
        department: editStudentFormData.department,
        course: editStudentFormData.course,
        year: editStudentFormData.year,
        student_id: editStudentFormData.student_id,
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      getStudents();
      
    }
    const changePassword = async () => {
      try{
        await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/change/student/password`, passwordForm, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }catch(e){
        console.log(e);
      }
    }

    const deleteStudent = async (id) => {
      await axiosJWT.delete(`${import.meta.env.VITE_API_URL}/delete/student/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      getStudents();
    }

    const addStudent = async (e) => {
      e.preventDefault();
      try {
          await axiosJWT.post(`${import.meta.env.VITE_API_URL}/register/student`, {
            id: students.length,
            last_name: addStudentFormData.last_name,
            first_name: addStudentFormData.first_name,
            middle_name: addStudentFormData.middle_name,
            contact_no: addStudentFormData.contact_no,
            email: addStudentFormData.email,
            department: addStudentFormData.department,
            course: addStudentFormData.course,
            year: addStudentFormData.year,
            student_id: addStudentFormData.student_id,
            password: addStudentFormData.password,
            confPassword: addStudentFormData.confPassword
          },{headers: {
            Authorization: `Bearer ${token}`
          }});
          setModalIsOpen(false);
          getStudents();

      } catch (error) {
          if (error.response) {
              setMsg(error.response.data.msg);
          }
      }
    }

    const handleAddFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...addStudentFormData };
        newFormData[fieldName] = fieldValue;

        setAddStudentFormData(newFormData);
        console.log(newFormData);
    };

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editStudentFormData };
        newFormData[fieldName] = fieldValue;

        setEditStudentFormData(newFormData);
    };

    const handleChangePassFormChange = (event) => {
      event.preventDefault();

      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;

      const newFormData = { ...passwordForm };
      newFormData[fieldName] = fieldValue;

      setPasswordForm(newFormData);
  };

    const handleAddFormSubmit = (event) => {
        event.preventDefault();

        const newStudent = {
        id: students.length,
        last_name: addStudentFormData.last_name,
        first_name: addStudentFormData.first_name,
        middle_name: addStudentFormData.middle_name,
        contact_no: addStudentFormData.contact_no,
        email: addStudentFormData.email,
        department: addStudentFormData.department,
        course: addStudentFormData.course,
        year: addStudentFormData.year,
        student_id: addStudentFormData.student_id,
        password: addStudentFormData.password,
        confPassword: addStudentFormData.confPassword
        };

        const newStudents = [...students, newStudent];
        setStudents(newStudents);
        setModalIsOpen(false);
        console.log(newStudent.id)
        addStudent();
    };

    const handleEditFormSubmit = () => {
        const editedStudent = {
        id: editStudenttId,
        last_name: editStudentFormData.last_name,
        first_name: editStudentFormData.first_name,
        middle_name: editStudentFormData.middle_name,
        contact_no: editStudentFormData.contact_no,
        email: editStudentFormData.email,
        department: editStudentFormData.department,
        course: editStudentFormData.course,
        year: editStudentFormData.year,
        student_id: editStudentFormData.student_id,
        };

        const newStudents = [...students];

        const index = students.findIndex((student) => student.id === editStudenttId);

        newStudents[index] = editedStudent;

        updateStudent(editedStudent.id);
        {console.log(editedStudent)}

        setStudents(newStudents);
        setEditStudenttId(null);
    };

    const handleEditClick = (event, student) => {
        event.preventDefault();
        setEditStudenttId(student.id);

        const formValues = {
        last_name: student.last_name,
        first_name: student.first_name,
        middle_name: student.middle_name,
        contact_no: student.contact_no,
        email: student.email,
        department: student.department,
        course: student.course,
        year: student.year,
        student_id: student.student_id,
        };

        setEditStudentFormData(formValues);
    };

    const handleCancelClick = () => {
        setEditStudenttId(null);
    };

    const handleDeleteClick = (studentId) => {
      let text = '❌❌❌ Do you want to delete this student? '
      if(confirm(text) == true){
        const newStudents = [...students];

        const index = students.findIndex((student) => student.id === studentId);

        newStudents.splice(index, 1);

        setStudents(newStudents);
        deleteStudent(studentId);
      }else{}
    };

    const handleChangePassword = (id) => {
      passwordForm.student_id = id;
      setChangePassModal(true);

    }
    const handleChangePasswordSubmit = () => {
      console.log(passwordForm);
      changePassword();
      setChangePassModal(false);

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

  useEffect(()=>{
    if(msg == ''){
    }else{
        notify();
    }
  },[msg]);

  const notify = () => toast.error(msg, {
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
      <div className="users-table-header">
        <div style={{display:'flex', gap:'1em', textAlign:'left', width: '100%'}}>
            <h1>Student Accounts</h1>
            <button className="add_btn" onClick={()=>setModalIsOpen(!modalIsOpen)}>ADD</button>
        </div>
        

        <form onSubmit={handleEditFormSubmit}>
          <table className='students-user-table'>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Contact No.</th>
                <th>Email</th>
                <th>Department</th>
                <th>Course</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((student) => (
                <>
                  {editStudenttId === student.id ? (
                    <StudentEditableRow
                      editFormData={editStudentFormData}
                      handleEditFormChange={handleEditFormChange}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <StudentReadOnlyRow
                      key={student.id}
                      student={student}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                      handleChangePassword={handleChangePassword}
                    />
                  )}
                </>
              ))}
            </tbody>
          </table>
        </form>
        <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        ariaHideApp={false}>
        <div className="add-user-container">
            <h2>ADD A STUDENT</h2>
            <form onSubmit={addStudent} style={{display:'flex', flexDirection:'column'}}>
            <input
                type="text"
                required="required"
                placeholder="Enter a Student ID..."
                name="student_id"
                onChange={handleAddFormChange}
            />
            <input
                type="text"
                required="required"
                placeholder="Enter a last name..."
                name="last_name"
                onChange={handleAddFormChange}
            />
            <input
                type="text"
                required="required"
                placeholder="Enter a first name..."
                name="first_name"
                onChange={handleAddFormChange}
            />
            <input
            type="text"
            required="required"
            placeholder="Enter a middle name..."
            name="middle_name"
                onChange={handleAddFormChange}
            />
            <input
                type="text"
                required="required"
                placeholder="Enter a contact no..."
                name="contact_no"
                onChange={handleAddFormChange}
            />
            <input
                type="email"
                required="required"
                placeholder="Enter a email..."
                name="email"
                onChange={handleAddFormChange}
            />

            <select
              required="required"
              name="department"
              value={addStudentFormData.department}
              onChange={(e)=> {
                setSelectDept(e.target.value);
                addStudentFormData.department = e.target.value;
              }}
              >
                {dept_options}
            </select>

            <select
              required="required"
              name="course"
              value={addStudentFormData.course}
              onChange={(e)=> {
                setSelectCourse(e.target.value);
                addStudentFormData.course = e.target.value;
              }}
              >
              {course_options}
            </select>

            <input
                type="number"
                required="required"
                placeholder="Enter a year..."
                name="year"
                onChange={handleAddFormChange}
            />
            <input
                type="password"
                required="required"
                placeholder="Enter a password"
                name="password"
                onChange={handleAddFormChange}
            />
            <input
                type="password"
                required="required"
                placeholder="Confirm password"
                name="confPassword"
                onChange={handleAddFormChange}
            />
            <div className="flex">
              <button type="button" onClick={()=>setModalIsOpen(false)}>CANCEL</button>
              <button type="submit">ADD</button>

            </div>
            </form>
        </div>
        </Modal>
        <Modal
        isOpen={changePassModal}
        style={customStyles}
        ariaHideApp={false}>
          <form style={{display:'flex', flexDirection:'column', gap:'1em'}}>
            <input type="password" name='password' placeholder='Enter a Password' onChange={handleChangePassFormChange}/>
            <input type="password" name='confPassword' placeholder='Confirm Password' onChange={handleChangePassFormChange}/>
            <div style={{display:'flex', gap:'1em'}}>
              <button type="button" onClick={()=>setChangePassModal(false)}>Cancel</button>
              <button type="button" onClick={handleChangePasswordSubmit}>Change Password</button>
            </div>
          </form>
        </Modal>
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

export default ManageStudentAccounts