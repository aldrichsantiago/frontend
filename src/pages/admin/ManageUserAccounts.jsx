import React, {useState,  useEffect} from 'react'
import AdminLayout from './AdminLayout'
import axios from 'axios'
import StudentReadOnlyRow from './../../components/StudentReadOnlyRow'
import StudentEditableRow from './../../components/StudentEditableRow'

import './styles/ManageUserAccounts.css'


function ManageUserAccounts() {
  const [students, setStudents] = useState();
  const [newStudentId, setNewStudentId] = useState();
  const [addStudentFormData, setAddStudentFormData] = useState({
    student_id: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    contact_no: "",
    email: "",
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
    getStudents();
}, []);
  console.log(students);

  const getStudents = async () => {
    const response = await axios.get('http://localhost:5000/student/home', {

    });
    setStudents(response.data);
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
    };

    const newStudents = [...students, newStudent];
    setStudents(newStudents);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

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
      course: student.course,
      year: student.year,
      student_id: student.student_id,
    };

    setEditStudentFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditStudenttId(null);
  };

  const handleDeleteClick = (studenttId) => {
    const newStudents = [...students];

    const index = students.findIndex((student) => student.id === studenttId);

    newStudents.splice(index, 1);

    setStudents(newStudents);
  };

  return (
    <AdminLayout>
      <div className="manage-user-header">
        <h1>ManageUserAccounts</h1>
        <a href="#">Pending Student Registrations</a>
        <a href="#">Pending Dean Registrations</a>
        <a href="#">Dean Accounts</a>
        <a href="#">Student Accounts</a>
      </div>
      <div className="users-table">
        <form>
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

        <div className="add-user-container">
        <h2>Add a Student</h2>
        <form onSubmit={handleAddFormSubmit}>
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
            type="text"
            required="required"
            placeholder="Enter a year..."
            name="year"
            onChange={handleAddFormChange}
          />
          <button type="submit">Add</button>
        </form>
        </div>
      </div> 
    </AdminLayout>
  )
}

export default ManageUserAccounts