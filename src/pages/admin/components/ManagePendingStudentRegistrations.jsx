import React, {useState,  useEffect} from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import PendingStudentReadOnlyRow from './../../../components/PendingStudentsReadOnlyRow'

function ManagePendingStudentRegistrations() {
    const [students, setStudents] = useState();
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

    const getStudents = async () => {
        const response = await axios.get('http://localhost:5000/pendingstudents/get', {

        });
        setStudents(response.data);
    }

    const approveStudent = async (StudentId) => {
      try {
        const index = students.findIndex((student) => student.id === StudentId);
        const student = students[index];

        await axios.post('http://localhost:5000/approve/registration/student', {
          last_name: student.last_name,
          first_name: student.first_name,
          middle_name: student.middle_name,
          contact_no: student.contact_no,
          email: student.email,
          department: student.department,
          course: student.course,
          year: student.year,
          student_id: student.student_id,
          password: student.password
        });

        rejectStudent(StudentId);


      } catch (error) {
        console.log(error);
      }
    }

    const rejectStudent = async (id) => {
      await axios.delete(`http://localhost:5000/reject/registration/student/${id}`);
      getStudents();
    }

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
        conf_password: addStudentFormData.conf_password,
        };

        const newStudents = [...students, newStudent];
        setStudents(newStudents);
        setModalIsOpen(false);
        console.log(newStudent.id)
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


    const handleDeleteClick = (studenttId) => {
        const newStudents = [...students];

        const index = students.findIndex((student) => student.id === studenttId);

        newStudents.splice(index, 1);

        setStudents(newStudents);
        rejectStudent(studenttId)
    };

  return (
    <>
      <div className="users-table">
        <div style={{display:'flex', gap:'1em', textAlign:'left', width: '100%'}}>
            <h1>Pending Student Registrations</h1>
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
    </>
    )
}

export default ManagePendingStudentRegistrations