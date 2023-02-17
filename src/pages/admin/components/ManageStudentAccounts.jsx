import React, {useState,  useEffect} from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify';
import StudentReadOnlyRow from './../../../components/StudentReadOnlyRow'
import StudentEditableRow from './../../../components/StudentEditableRow'

function ManageStudentAccounts() {
    const [students, setStudents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [selectDept, setSelectDept] = useState('');
    const [departments, setDepartments] = useState();
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [selectCourse, setSelectCourse] = useState('');
    const [editModal, setEditModal] = useState(false);
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
        department:"",
        year: "",
        student_id: "",
        dept_id: 0,
        course_id: 0
    });

    const [editStudenttId, setEditStudenttId] = useState(null);
    const [changePassModal, setChangePassModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({});

    const dept_options = departments?.map((dept) =>
        <option key={dept.dept_code} value={dept.dept_id}>{dept.dept_code}</option>
    );

    const selected_dept_options = departments?.map((dept) =>{
      if(editStudentFormData.dept_id == dept.dept_id){
        return <option key={dept.dept_id} value={dept.dept_id} selected>{dept.dept_code}</option>
      } else {
          return <option key={dept.dept_id} value={dept.dept_id}>{dept.dept_code}</option>
      }
      });

    const course_options = courses?.map((course) =>
        <option key={course.course_id} value={course.course_id}>{course.course_code} - {course.course_name}</option>
    );

    const selected_course_options = courses?.map((course) =>{
      if(editStudentFormData.course_id == course.course_id){
        return <option key={course.course_id} value={course.course_id} selected>{course.course_code}</option>
      } else {
          return <option key={course.course_id} value={course.course_id}>{course.course_code} - {course.course_name}</option>
      }
      });

      console.log(courses)


    useEffect(() => {
        refreshToken();
        getStudents();
        getDepartments();
        getAllCourses();

    }, []);

    useEffect(() => {
      if (search==""){
        getStudents();
      }else{
        getSearchedStudents();
      }
    }, [search]);

    useEffect(()=>{
      getCourses(selectDept);
    }, [addStudentFormData.department, editStudentFormData.dept_id, selectDept]);

  const getDepartments = async () => {
      try{
         const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/departments`);
         setDepartments(response.data);
      }catch(e){console.log(e)}
  }

  const getCourses = async (selectDept) => {
      try{
         const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/courses/${selectDept}`);
         setCourses(response.data);
      }catch(e){console.log(e)}
  }

  const getAllCourses = async () => {
      try{
         const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/all/courses`);
         setCourses(response.data);
      }catch(e){console.log(e)}
  }

    const getStudents = async () => {
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/students/get`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStudents(response.data);
    }

    const getSearchedStudents = async () => {
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/students/get/${search}`, {
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
        dept_id: editStudentFormData.dept_id,
        course_id: editStudentFormData.course_id,
        year: editStudentFormData.year,
        student_id: editStudentFormData.student_id,
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      notify('✏️ Student has been updated');
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
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/delete/student/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      errNotify('🗑️ Student has been deleted ');
      getStudents();
    }

    const addStudent = async (e) => {
      e.preventDefault();
      try {
          await axiosJWT.post(`${import.meta.env.VITE_API_URL}/register/student`, {
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
          notify("Student has been to pending registrations")

      } catch (error) {
          if (error.response) {
              setMsg(error.response.data.msg);
              console.log(error.response.data.msg);
              errNotify(error.response.data.msg);
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
        console.log(editStudentFormData)
    };

    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        const editedStudent = {
        id: editStudenttId,
        last_name: editStudentFormData.last_name,
        first_name: editStudentFormData.first_name,
        middle_name: editStudentFormData.middle_name,
        contact_no: editStudentFormData.contact_no,
        email: editStudentFormData.email,
        department: editStudentFormData.dept_id,
        course: editStudentFormData.course_id,
        year: editStudentFormData.year,
        student_id: editStudentFormData.student_id,
        };

        const newStudents = [...students];

        const index = students.findIndex((student) => student.id === editStudenttId);

        newStudents[index] = editedStudent;

        updateStudent(editStudenttId);
        {console.log(editedStudent)}

        setStudents(newStudents);
        setEditStudenttId(null);
        console.log(editedStudent);
        setEditModal(false);
    };

    const handleEditClick = (event, student) => {
        event.preventDefault();
        getCourses(student.dept_id);
        setEditStudenttId(student.id);
        setEditModal(true);

        const formValues = {
          last_name: student.last_name,
          first_name: student.first_name,
          middle_name: student.middle_name,
          contact_no: student.contact_no,
          email: student.email,
          department: student.department,
          dept_id: student.dept_id,
          course_id: student.course_id,
          course: student.course,
          year: student.year,
          student_id: student.student_id,
        };
        setEditStudentFormData(formValues);
        console.log(student);
    };

    const handleCancelClick = () => {
        setEditStudenttId(null);
    };

    const handleDeleteClick = (studentId) => {
      let text = '❌ Do you want to delete this student? '
      if(confirm(text) == true){
        const newStudents = [...students];

        const index = students.findIndex((student) => student.id === studentId);

        newStudents.splice(index, 1);

        setStudents(newStudents);
        deleteStudent(studentId);
      }else{}
    };

    const handleChangePassFormChange = (event) => {
      event.preventDefault();

      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;

      const newFormData = { ...passwordForm };
      newFormData[fieldName] = fieldValue;

      setPasswordForm(newFormData);
  };

    const handleChangePassword = (id, student) => {
      passwordForm.id = id;
      passwordForm.name = (student.last_name + ", " + student.first_name + ", " + student.middle_name);
      passwordForm.student_id = student.student_id;
      setChangePassModal(true);
    }
    const handleChangePasswordSubmit = () => {
      console.log(passwordForm);
      const {password, confPassword} = passwordForm;

      if(!password || !confPassword){
        errNotify("Please input a password");
      }else if(password.length < 8) {
        errNotify("Password should be at least 8 characters");
      }else if(password != confPassword) {
        errNotify("Password does not match");
      } else{
        changePassword();
        notify("Password has been changed")
        setChangePassModal(false);
      }
      

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

  const blank_option = <option value=""></option>;


  return (
    <>
      <div className="dean-view-applications">
        <div style={{display:'flex', gap:'1em', textAlign:'left', width: '100%', alignItems:'center', flexWrap:'wrap'}}>
            <h1>Student Accounts</h1>
            <div class="input-group h-25 col-4">
              <div class="input-group-prepend">
                <span class="input-group-text" >Name or Student ID</span>
              </div>
              <input type="text" name="searchField" className='searchField form-control'class="form-control" onChange={(e)=>{setSearch(e.target.value)}}/>
            </div>
            <button className="btn btn-primary col-1 mr-3" onClick={()=>setModalIsOpen(!modalIsOpen)}>ADD</button>
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
                {/* <th>Department</th>
                <th>Course</th>
                <th>Year</th> */}
                <th scope='col' className='fit'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((student) => (
                <>
                  {(
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
        <div className="add-user-container container-fluid text-center">
            <h2 className='m-3'>ADD A STUDENT</h2>
            <form onSubmit={addStudent} style={{display:'flex', flexDirection:'column'}}>
            <input
            className='form-control m-1'
                type="text"
                required="required"
                placeholder="Enter a Student ID..."
                name="student_id"
                onChange={handleAddFormChange}
            />
            <input
            className='form-control m-1'
                type="text"
                required="required"
                placeholder="Enter a last name..."
                name="last_name"
                onChange={handleAddFormChange}
            />
            <input
            className='form-control m-1'
                type="text"
                required="required"
                placeholder="Enter a first name..."
                name="first_name"
                onChange={handleAddFormChange}
            />
            <input
            className='form-control m-1'
            type="text"
            required="required"
            placeholder="Enter a middle name..."
            name="middle_name"
                onChange={handleAddFormChange}
            />
            <input
            className='form-control m-1'
                type="text"
                required="required"
                placeholder="Enter a contact no..."
                name="contact_no"
                onChange={handleAddFormChange}
            />
            <input
            className='form-control m-1'
                type="email"
                required="required"
                placeholder="Enter a email..."
                name="email"
                onChange={handleAddFormChange}
            />

            <select
            className='custom-select m-1'
              required="required"
              name="department"
              value={addStudentFormData.department}
              onChange={(e)=> {
                setSelectDept(e.target.value);
                addStudentFormData.department = e.target.value;
              }}>
                <option value="">Select a department...</option>
                {dept_options}
            </select>

            <select
            className='custom-select m-1'
              required="required"
              name="course"
              value={addStudentFormData.course}
              onChange={(e)=> {
                setSelectCourse(e.target.value);
                addStudentFormData.course = e.target.value;
              }}>
                <option value="">Select a course...</option>
              {course_options}
            </select>
            <select
            className='custom-select m-1'
                type="number"
                required="required"
                placeholder="Enter a year..."
                name="year"
                onChange={handleAddFormChange}>
                <option value="">Select a Year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <input
              className='form-control m-1'
              type="password"
              required="required"
              placeholder="Enter a password"
              name="password"
              onChange={handleAddFormChange}
            />
            <input
              className='form-control m-1'
              type="password"
              required="required"
              placeholder="Confirm password"
              name="confPassword"
              onChange={handleAddFormChange}
            />
            <div className="flex">
              <button className='btn btn-dark' type="button" onClick={()=>setModalIsOpen(false)}>CANCEL</button>
              <button className='btn btn-success' type="submit">ADD</button>

            </div>
            </form>
        </div>
        </Modal>

        {/* edit modal */}
        <Modal
        isOpen={editModal}
        style={customStyles}
        ariaHideApp={false}>
        <div className="add-user-container form-group container-fluid py-3 px-5">
            <h2 className='text-center p-3'>EDIT STUDENT</h2>
            <form style={{display:'flex', flexDirection:'column'}}>
            <input
                className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a Student ID..."
                name="student_id"
                value={editStudentFormData.student_id}
                onChange={handleEditFormChange}
            />
            <input
                className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a last name..."
                name="last_name"
                value={editStudentFormData.last_name}
                onChange={handleEditFormChange}
            />
            <input
                className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a first name..."
                name="first_name"
                value={editStudentFormData.first_name}

                onChange={handleEditFormChange}
            />
            <input
                className="form-control m-1"
            type="text"
            required="required"
            placeholder="Enter a middle name..."
            name="middle_name"
            value={editStudentFormData.middle_name}
            onChange={handleEditFormChange}
            />
            <input
                className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a contact no..."
                name="contact_no"
                value={editStudentFormData.contact_no}
                onChange={handleEditFormChange}
            />
            <input
                className="form-control m-1"
                type="email"
                required="required"
                placeholder="Enter a email..."
                name="email"
                value={editStudentFormData.email}
                onChange={handleEditFormChange}
            />
            <select
              className='custom-select m-1'
              required="required"
              name="department"
              value={editStudentFormData.dept_id}
              onChange={(e)=> {
                setSelectDept(e.target.value);
                editStudentFormData.dept_id = e.target.value;
              }}>
                {selected_dept_options}
            </select>

            <select
              className='custom-select m-1'
              required="required"
              name="course"
              value={editStudentFormData.course_id}
              onChange={(e)=> {
                setSelectCourse(e.target.value);
                editStudentFormData.course_id = e.target.value;
              }}>
                {blank_option}
              {selected_course_options}
            </select>

            <select
              className='custom-select m-1'
              type="number"
              required="required"
              placeholder="Enter a year..."
              name="year"
              value={editStudentFormData.year}
              onChange={handleEditFormChange}>
                <option value=""></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <div className="flex">
              <button className='btn btn-dark' type="button" onClick={()=>setEditModal(false)}>CANCEL</button>
              <button className='btn btn-success' type="submit" onClick={handleEditFormSubmit}>UPDATE</button>

            </div>
            </form>
        </div>
        </Modal>

        <Modal
        isOpen={changePassModal}
        style={customStyles}
        ariaHideApp={false}>
          <form style={{display:'flex', flexDirection:'column', gap:'1em'}}>
            <input className='form-control' type="text" disabled name='student_id' value={passwordForm.student_id}/>
            <input className='form-control' type="text" disabled name='student_name' value={passwordForm.name}/>
            <input className='form-control' type="password" name='password' placeholder='Enter a Password' onChange={handleChangePassFormChange}/>
            <input className='form-control' type="password" name='confPassword' placeholder='Confirm Password' onChange={handleChangePassFormChange}/>
            <div style={{display:'flex', gap:'1em'}}>
              <button type="button" className='btn btnCancel' onClick={()=>setChangePassModal(false)}>Cancel</button>
              <button type="button" className='btn btnChangePass' onClick={handleChangePasswordSubmit}>Change Password</button>
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