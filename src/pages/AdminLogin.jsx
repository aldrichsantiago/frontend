import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import UserLogin from '../components/userLogin'


function AdminLogin() {
  
  return (
    <div>
        <Navbar lg={"WUPSCHOLARSHIP"}/>
        <UserLogin id_place="Admin ID" forgot_passwd='none' new_acc='none'/>
    </div>
  )
}

export default AdminLogin