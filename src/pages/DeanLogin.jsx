import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import UserLogin from '../components/userLogin'



function DeanLogin() {
  return (
    <div>
        <Navbar lg={"WUPSCHOLARSHIP"}/>
        <UserLogin id_place="Dean ID" passwd_place="Passsword" reg_path="/register/dean"/>
    </div>
  )
}

export default DeanLogin