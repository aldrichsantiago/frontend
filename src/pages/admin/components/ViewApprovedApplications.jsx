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

function ViewApprovedApplications() {
  let student={
    id: 1,
    student_id: '11-1111-111',
    name: 'Marco Antonio Enriquez',
  }

  return (
    <div className="approved-applications">
      <div>View Approved Applications</div>
        <div className="approved-applications-table">
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

export default ViewApprovedApplications