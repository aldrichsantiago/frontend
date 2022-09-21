import React from 'react'
import Logo from '../assets/logo.png'
import './styles/Navbar.css'


function Navbar(props) {
  return (
    <div>
        <nav>
            <div className='left-nav'>
                <h1 className='wup-lg'>{props.lg}</h1>
                <h2 className='wup-sm'>{props.sm}</h2>
                <h3 className='user-name'>{props.user}</h3>
            </div>
            <div className='right-nav'>
                <h1>WESLEYAN UNIVERSITY-PHILIPPINES</h1>
                <a href="/"><img src={Logo} alt="LOGO" width='100px'/></a>
            </div>
        </nav>
    </div>
  )
}

export default Navbar