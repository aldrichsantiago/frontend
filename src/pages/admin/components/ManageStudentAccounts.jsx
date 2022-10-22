import React, {useState,  useEffect} from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import StudentReadOnlyRow from './../../../components/StudentReadOnlyRow'
import StudentEditableRow from './../../../components/StudentEditableRow'

function ManageStudentAccounts() {
    const [students, setStudents] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [addStudentFormData, setAddStudentFormData] = useState({
        student_id: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        contact_no: "",
        email: "",
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
        year: "",
        student_id: ""
    });

    const [editStudenttId, setEditStudenttId] = useState(null);

    useEffect(() => {
        getStudents();
    }, []);

    const getStudents = async () => {
        const response = await axios.get('http://localhost:5000/students/get', {

        });
        setStudents(response.data);
    }

    const updateStudent = async (id) => {
      await axios.patch(`http://localhost:5000/update/student/${id}`, {
        last_name: editStudentFormData.last_name,
        first_name: editStudentFormData.first_name,
        middle_name: editStudentFormData.middle_name,
        contact_no: editStudentFormData.contact_no,
        email: editStudentFormData.email,
        department: editStudentFormData.department,
        course: editStudentFormData.course,
        year: editStudentFormData.year,
        student_id: editStudentFormData.student_id,
      });
      getStudents();
      
      
    }

    const deleteStudent = async (id) => {
      await axios.delete(`http://localhost:5000/delete/student/${id}`);
      getStudents();
    }

    const addStudent = async (e) => {
      e.preventDefault();
      try {
          await axios.post('http://localhost:5000/register/student', {
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
          });
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
    };

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editStudentFormData };
        newFormData[fieldName] = fieldValue;

        setEditStudentFormData(newFormData);
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
        const newStudents = [...students];

        const index = students.findIndex((student) => student.id === studentId);

        newStudents.splice(index, 1);

        setStudents(newStudents);
        deleteStudent(studentId);
    };

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

  return (
    <>
      <div className="users-table">
        <div style={{display:'flex', gap:'1em', textAlign:'left', width: '100%'}}>
            <h1>Student Accounts</h1>
            <button className="add_btn" onClick={()=>setModalIsOpen(!modalIsOpen)}>ADD</button>
        </div>
        

        <form onSubmit={handleEditFormSubmit}>
          <table>
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
            <h2>Add a Student</h2>
            <a onClick={()=>setModalIsOpen(false)}>X</a>
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
            <input
                type="text"
                required="required"
                placeholder="Enter an department..."
                name="department"
                onChange={handleAddFormChange}
            />
            <input
                type="text"
                required="required"
                placeholder="Enter a course..."
                name="course"
                onChange={handleAddFormChange}
            />
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
            <button type="submit">Add</button>
            </form>
        </div>
        </Modal>
        
      </div> 
    </>
    )
}

export default ManageStudentAccounts