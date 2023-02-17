import React from "react";

const StudentEditableRow = ({
  editFormData,
  handleEditFormChange,
  handleCancelClick,
  handleEditFormSubmit
}) => {
  return (
    <tr>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter a Student ID..."
          name="student_id"
          value={editFormData.student_id}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter a last name..."
          name="last_name"
          value={editFormData.last_name}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter a first name..."
          name="first_name"
          value={editFormData.first_name}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter a middle name..."
          name="middle_name"
          value={editFormData.middle_name}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter a contact no..."
          name="contact_no"
          value={editFormData.contact_no}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input
          type="email"
          required="required"
          placeholder="Enter a name..."
          name="email"
          value={editFormData.email}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter an department..."
          name="department"
          value={editFormData.department.dept_code}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter a course..."
          name="course"
          value={editFormData.course.course_code}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input
          type="number"
          required="required"
          placeholder="Enter a year..."
          name="year"
          value={editFormData.year}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <button type="submit" onClick={handleEditFormSubmit}>Save</button>
        <button type="button" onClick={handleCancelClick}>
          Cancel
        </button>
      </td>
    </tr>
  );
};

export default StudentEditableRow;