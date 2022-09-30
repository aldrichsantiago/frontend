import React from 'react'
import UserHomeLayout from '../UserHomeLayout'


function DeanHome() {
  return (
    <UserHomeLayout 
    user="COLLEGE DEAN" 
    toGreen="/dean/applications" 
    greenName="VIEW SCHOLARSHIP APPLICATIONS"
    display='none'>
        
    </UserHomeLayout>
  )
}

export default DeanHome