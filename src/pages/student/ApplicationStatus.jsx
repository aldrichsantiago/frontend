import React from 'react'
import Layout from './Layout'
import './styles/ApplicationStatus.css'

function ApplicationStatus() {
  return (
    <Layout>
        <div className="application-status-container">
          <h1>Application Status: </h1>
          <div className="status-timeline">
            <div className="application-submitted">
                <h2>SCHOLARSHIP APPLICATION SUBMITTED</h2>
            </div>
            <div className="application-review">
                <h2>SCHOLARSHIP APPLICATION UNDER REVIEW</h2>
            </div>
            <div className="application-approved">
                <h2>SCHOLARSHIP APPLICATION APPROVED</h2>
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default ApplicationStatus