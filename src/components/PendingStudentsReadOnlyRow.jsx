import React from "react";

const PendingStudentReadOnlyRow = ({ student, handleApproveClick, handleRejectClick }) => {
  return (
    <tr key={student.id}>
      <td scope="row" className='fit'>{student.student_id}</td>
      <td className='fit col-1'>{student.last_name}</td>
      <td className='fit col-1'>{student.first_name}</td>
      <td className='fit col-1'>{student.middle_name}</td>
      <td className='fit col-1'>{student.contact_no}</td>
      <td className='fit col-1'>{student.email}</td>
      <td className='fit col-1'><a title={student.department.dept_name}>{student.department.dept_code}</a></td>
      <td className='fit col-1'><a title={student.course.course_name}>{student.course.course_code}</a></td>
      <td className='fit col-1'>{student.year}</td>
      <td className='fit col-3'>
        <button
          type="button"
          className="btn btn-success mx-1"
          onClick={() => handleApproveClick(student.id)}
        >
          Accept
        </button>
        <button 
        type="button" 
        className="btn btn-danger mx-1"
        onClick={() => handleRejectClick(student.id)}>
          Reject
        </button>
      </td>
    </tr>
  );
};

export default PendingStudentReadOnlyRow;