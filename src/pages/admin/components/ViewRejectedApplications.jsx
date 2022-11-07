import React from 'react'


const EachApplication = ({student}) => {
    return(
        <tr>
            <td>{student.student_id}</td>
            <td>{student.name}</td>
            <td>
                <a target="_blank" href="#">View Application</a>
                <button>Delete</button>
            </td>
        </tr>
    )
}

function ViewRejectedApplications() {
    let student={
        id: 2,
        student_id: '12-3456-789',
        name: 'Aldrich Santiago',
    }
  return (
    <div className="rejected-applications">
        <div>View Rejected Applications</div>
        <div className="rejected-applications-table">
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <EachApplication
                        student={student}
                    />
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ViewRejectedApplications