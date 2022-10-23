import React from 'react'
import Layout from './Layout'
import './styles/AccountDetails.css'

function AccountDetails() {
  return (
    <>
      <Layout>
        <div className="user-details-container">
          <h1>Personal Information</h1>
          <form>
            <div>
              <label htmlFor="last_name">Last Name: </label>
              <input name="last_name" type="text" placeholder="Enter your last name" required/>
            </div>
            <div>
              <label htmlFor="first_name">First Name:</label>
              <input name="first_name" type="text" placeholder="Enter your first name" required/>
            </div>
            <div>
              <label htmlFor="middle_name">Middle Name:</label>
              <input name="middle_name" type="text" placeholder="Enter your middle name" required/>
            </div>
            <div>
              <label htmlFor="department">Department: </label>
              <input name="department" type="text" placeholder="Enter your department" required/>
            </div>
            <div>
              <label htmlFor="course">Course: </label>
              <input name="course" type="text" placeholder="Enter your cousre" required/>
            </div>
            <div>
              <label htmlFor="year">Year: </label>
              <input name="year" type="number" placeholder="Enter your year" required/>
            </div>
            <div>
              <label htmlFor="contact_no">Contact no.: </label>
              <input name="contact_no" type="text" placeholder="Enter your contact no" required/>
            </div>
            <div>
              <label htmlFor="email">Email: </label>
              <input name="email" type="email" placeholder="Enter your email" required/>
            </div>
            <div>
              <label htmlFor="student_id">Student ID: </label>
              <input name="student_id" type="text" placeholder="Enter your Student ID" required/>
            </div>
            <button type='submit'>UPDATE ACCOUNT DETAILS</button>
          </form>
        </div>
      </Layout>
    </>
  )
}

export default AccountDetails