import React from "react";

const PendingDeanReadOnlyRow = ({ dean, handleApproveClick, handleRejectClick }) => {
  return (
    <tr key={dean.id}>
      <td scope='row' className='fit'>{dean.dean_id}</td>
      <td className="fit col-2">{dean.last_name}</td>
      <td className="fit col-2">{dean.first_name}</td>
      <td className="fit col-2">{dean.middle_name}</td>
      <td className="fit col-2">{dean.contact_no}</td>
      <td className="fit col-2">{dean.email}</td>
      <td className="fit col-2">{dean.department.dept_code}</td>
      <td className="fit col-2">
        <button
          type="button"
          className="btn btn-success mx-1"
          onClick={() => handleApproveClick(dean.id)}
        >
          Accept
        </button>
        <button 
          type="button" 
          className="btn btn-danger mx-1"
          onClick={() => handleRejectClick(dean.id)}>
          Reject
        </button>
      </td>
    </tr>
  );
};

export default PendingDeanReadOnlyRow;