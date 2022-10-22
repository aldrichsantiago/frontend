import React from "react";

const DeanReadOnlyRow = ({ dean, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{dean.dean_id}</td>
      <td>{dean.last_name}</td>
      <td>{dean.first_name}</td>
      <td>{dean.middle_name}</td>
      <td>{dean.contact_no}</td>
      <td>{dean.email}</td>
      <td>{dean.department}</td>
      <td>
        <button
          type="button"
          onClick={(event) => handleEditClick(event, dean)}
        >
          Edit
        </button>
        <button type="button" onClick={() => handleDeleteClick(dean.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default DeanReadOnlyRow;