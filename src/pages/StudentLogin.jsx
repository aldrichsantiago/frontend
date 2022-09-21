import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import UserLogin from '../components/userLogin'

function StudentLogin() {

  return (
    <div>
        <Navbar lg={"WUPSCHOLARSHIP"}></Navbar>
        <UserLogin id_place="Student ID" passwd_place="Passsword" reg_path="/register/student"></UserLogin>
    </div>
  )
}

export default StudentLogin