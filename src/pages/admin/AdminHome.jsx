import React from 'react'
import UserHomeLayout from '../UserHomeLayout'

function AdminHome() {
  return (
    <UserHomeLayout 
    user="A D M I N I S T R A T O R" 
    toGreen="/admin/applications" 
    greenName="MANAGE SCHOLARSHIP APPLICATIONS"
    display='none'>
        
    </UserHomeLayout>
  )
}

export default AdminHome