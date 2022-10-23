import React from 'react'
import Layout from './Layout'
import './styles/ApplicationStatus.css'
import Checked  from './../../assets/checked.png'
import Unchecked from './../../assets/unchecked.png'

function ApplicationStatus() {
  return (
    <Layout>
      <div className="application-status-container">
        <h1>Application Status: </h1>
        <div className="status-timeline">
          <div className="application-submitted">
            <img src={Checked} alt="timeline-status" width={50}/>
            <h2>SCHOLARSHIP APPLICATION SUBMITTED</h2>
          </div>
          <div className="application-review">
            <img src={Unchecked} alt="timeline-status" width={50}/>
            <h2>SCHOLARSHIP APPLICATION UNDER REVIEW</h2>
          </div>
          <div className="application-approved">
            <img src={Unchecked} alt="timeline-status" width={50}/>
            <h2>SCHOLARSHIP APPLICATION APPROVED</h2>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ApplicationStatus