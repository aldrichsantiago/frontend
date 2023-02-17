import React from "react";

const StudentReadOnlyRow = ({ student, handleEditClick, handleDeleteClick, handleChangePassword }) => {
  return (
    <tr key={student.id}>
      <th scope="row" className='fit col-1'>{student.student_id}</th>
      <td className='fit col-1'>{student.last_name}</td>
      <td className='fit col-1'>{student.first_name}</td>
      <td className='fit col-1'>{student.middle_name}</td>
      <td className='fit col-1'>{student.contact_no}</td>
      <td className='fit col-1'>{student.email}</td>
      {/* <td>{student.department.dept_code}</td>
      <td><a title={student.course.course_name}>{student.course.course_code}</a></td>
      <td>{student.year}</td> */}
      <td className='fit col-3'>
        <button
          type="button"
          className="btn btn-info mr-1"
          onClick={() => handleChangePassword(student.id, student)}
        >
          Change Password
        </button>
        <button
          type="button"
          className="btn btn-success mx-1"
          onClick={(event) => handleEditClick(event, student)}
        >
          Edit
        </button>
        <button 
        type="button" 
        className="btn btn-danger mx-1"
        onClick={() => handleDeleteClick(student.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default StudentReadOnlyRow;