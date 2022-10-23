import React from 'react'
import DeanLayout from './DeanLayout'
import './styles/DeanAccountDetails.css'


function DeanAccountDetails() {
  return (
    <DeanLayout>
        <h1 className='layout-header'>ACCOUNT DETAILS</h1>
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
              <label htmlFor="contact_no">Contact no.: </label>
              <input name="contact_no" type="text" placeholder="Enter your contact no" required/>
            </div>
            <div>
              <label htmlFor="email">Email: </label>
              <input name="email" type="email" placeholder="Enter your email" required/>
            </div>
            <div>
              <label htmlFor="dean_id">Dean ID: </label>
              <input name="dean_id" type="text" placeholder="Enter your Student ID" required/>
            </div>
            <button type='submit'>UPDATE ACCOUNT DETAILS</button>
          </form>
        </div>
    </DeanLayout>
  )
}

export default DeanAccountDetails