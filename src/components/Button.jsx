import React from 'react'
import './styles/Button.css'
import { Link } from 'react-router-dom'

function Button(props) {
  return (
    <div className='button-container'>
        <Link to={props.to} >{props.text}</Link>
    </div>
  )
}

export default Button