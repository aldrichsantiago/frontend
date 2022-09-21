import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import UserLogin from '../components/userLogin'


function AdminLogin() {
  
  return (
    <div>
        <Navbar lg={"WUPSCHOLARSHIP"}></Navbar>
        <UserLogin id_place="Admin ID" passwd_place="Passsword"></UserLogin>
    </div>
  )
}

export default AdminLogin