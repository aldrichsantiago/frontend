import React from 'react'
import Navbar from '../components/Navbar'
import PageNotFound404 from '../assets/404.png'
import './styles/PageNotFound.css'

function PageNotFound() {
  return (<>
  <Navbar></Navbar>
    <div className='pagenotfound-container'>
        <img src={PageNotFound404} alt="Page Not Found"/>
        <h1>404 Page Not Found</h1>
    </div>
  </>
    
  )
}

export default PageNotFound