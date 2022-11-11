import React from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Announcements from '../components/Announcements'
import './styles/Home.css'


function Home() {
  return (
    <div>
        <Navbar/>
        <div className='home-container'>
            <div className='left-home'>
                <h1><strong>WUP</strong>SCHOLARSHIP</h1>
                <Button to='/student/home' text='STUDENT / APPLICANT'/>
                <Button to='/dean/home' text='COLLEGE DEAN'/>
                <Button to='/admin/home' text='ADMINISTRATOR'/>
                <div className="contact-info">
                    <p>Mabini Extension, Cabanatuan City,</p>
                    <p>Nueva Ecija, 3100, Philippines</p>
                    <p>+63 (044) 463-2162 / 463-2074</p>
                </div>
            </div>
            <div className='right-home'>
                <h2>ANNOUNCEMENTS: </h2>
                <Announcements/>
            </div>
        </div>
    </div>
  )
}

export default Home