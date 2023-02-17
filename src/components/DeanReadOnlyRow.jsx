import React from "react";

const DeanReadOnlyRow = ({ dean, handleEditClick, handleDeleteClick, handleChangePassword }) => {
  return (
    <tr key={dean.id}>
      <td scope='row' className='fit'>{dean.dean_id}</td>
      <td className='fit col-2'>{dean.last_name}</td>
      <td className='fit col-2'>{dean.first_name}</td>
      <td className='fit col-2'>{dean.middle_name}</td>
      <td className='fit col-2'>{dean.contact_no}</td>
      <td className='fit col-2'>{dean.email}</td>
      <td className='fit col-2'>{dean.department.dept_code}</td>
      <td>
      <button
          type="button"
          className="btn btn-info mx-1"
          onClick={() => handleChangePassword(dean.id, dean)}
        >
          Change Password
        </button>
        <button
          type="button"
          className="btn btn-success mx-1"
          onClick={(event) => handleEditClick(event, dean)}
        >
          Edit
        </button>
        <button 
        type="button" 
        className="btn btn-danger mx-1"
        onClick={() => handleDeleteClick(dean.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default DeanReadOnlyRow;