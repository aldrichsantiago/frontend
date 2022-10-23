import React from "react";

const PendingDeanReadOnlyRow = ({ dean, handleApproveClick, handleRejectClick }) => {
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
          onClick={() => handleApproveClick(dean.id)}
        >
          Accept
        </button>
        <button type="button" onClick={() => handleRejectClick(dean.id)}>
          Reject
        </button>
      </td>
    </tr>
  );
};

export default PendingDeanReadOnlyRow;