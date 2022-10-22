import React from "react";

const PendingStudentReadOnlyRow = ({ student, handleAcceptClick, handleRejectClick }) => {
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
          onClick={(event) => handleAcceptClick(event, student)}
        >
          Accept
        </button>
        <button type="button" onClick={() => handleRejectClick(student.id)}>
          Reject
        </button>
      </td>
    </tr>
  );
};

export default PendingStudentReadOnlyRow;