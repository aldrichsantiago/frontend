import React from "react";

const StudentReadOnlyRow = ({ student, handleEditClick, handleDeleteClick, handleChangePassword }) => {
  return (
    <tr>
      <td>{student.student_id}</td>
      <td>{student.last_name}</td>
      <td>{student.first_name}</td>
      <td>{student.middle_name}</td>
      <td>{student.contact_no}</td>
      <td>{student.email}</td>
      <td>{student.department}</td>
      <td>{student.course}</td>
      <td>{student.year}</td>
      <td>
        <button
          type="button"
          onClick={() => handleChangePassword(student.student_id)}
        >
          Change Password
        </button>
        <button
          type="button"
          onClick={(event) => handleEditClick(event, student)}
        >
          Edit
        </button>
        <button type="button" onClick={() => handleDeleteClick(student.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default StudentReadOnlyRow;