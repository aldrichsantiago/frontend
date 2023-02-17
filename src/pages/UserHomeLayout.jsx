import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './styles/UserHomeLayout.css'

function UserHomeLayout(props) {
  return (
    <div>
        <Navbar lg={'WUPSCHOLARSHIP'}/>
        <div className='user-home-container container-fluid'>
            <div className="greetings-container">
                <h1>Welcome To Our</h1>
            </div>
            <div className="user-container">
                <h1>{props.user}</h1>
            </div>
            <div className='portal-container'>
                <h2>PORTAL</h2>
            </div>
            <div className="user-home-butt-container">
                <Link to={props.toGreen} className="green-button">{props.greenName}</Link>
                <Link to={props.toYellow} className="yellow-button" style={{'display' : props.display}}>{props.yellowName}</Link>
            </div>
        </div>
        <div className="user-home-footer"> 
            <div className='user-home-contact'>
                <p className='my-1'>Mabini Extension, Cabanutan City,</p>
                <p className='my-1'>Nueva Ecija, 3100, Philippines</p>
                <p className='my-1'>+63 (044) 463-2162 / 463-2074</p>
            </div>
            <div className='user-logout-container'>
                <a href="#" onClick={props.logout}>LOGOUT</a>
            </div>
        </div>
    </div>
  )
}

export default UserHomeLayout