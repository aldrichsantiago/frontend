import React from 'react'
import UserHomeLayout from '../UserHomeLayout'
import './styles/StudentHome.css'


function StudentHome() {
  return (
    <UserHomeLayout 
    user="SCHOLARSHIP APPLICATION" 
    toGreen="/student/status" 
    toYellow="/student/scholar"
    greenName="VIEW SCHOLARSHIP STATUS"
    yellowName="APPLY SCHOLARSHIP HERE">
        
    </UserHomeLayout>
  )
}

export default StudentHome