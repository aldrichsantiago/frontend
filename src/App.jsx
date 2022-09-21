import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import StudentLogin from './pages/StudentLogin'
import DeanLogin from './pages/DeanLogin'
import AdminLogin from './pages/AdminLogin'
import StudentRegister from './pages/StudentRegister'
import DeanRegister from './pages/DeanRegister'
import PageNotFound from './pages/PageNotFound'

import Layout from './pages/student/Layout'
import AccountDetails from './pages/student/AccountDetails'
import ViewScholarship from './pages/student/ViewScholarship'
import ApplicationStatus from './pages/student/ApplicationStatus'

import DeanLayout from './pages/dean/DeanLayout'
import DeanViewApplications from './pages/dean/ViewApplications'
import DeanAccountDetails from './pages/dean/DeanAccountDetails'

import AdminLayout from './pages/admin/AdminLayout'
import AdminViewApplications from './pages/admin/ViewApplications'
import AdminEditAppStatus from './pages/admin/EditApplicationStatus'
import AdminManageUsers from './pages/admin/ManageUserAccounts'
import AdminUpdateSite from './pages/admin/UpdateSiteContent'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/student' element={<StudentLogin/>}/>
        <Route path='/dean' element={<DeanLogin/>}/>
        <Route path='/admin' element={<AdminLogin/>}/>

        <Route path='/register/student' element={<StudentRegister/>}/>
        <Route path='/register/dean' element={<DeanRegister/>}/>

        <Route path='/student/home' element={<Layout/>}/>
        <Route path="/student/account" element={<AccountDetails/>}/>
        <Route path="/student/scholar" element={<ViewScholarship/>}/>
        <Route path="/student/status" element={<ApplicationStatus/>}/>
        <Route path="/student/details" element={<AccountDetails/>}/>

        <Route path='/dean/home' element={<DeanLayout/>}/>
        <Route path="/dean/applications" element={<DeanViewApplications/>}/>
        <Route path="/dean/details" element={<DeanAccountDetails/>}/>

        <Route path='/admin/home' element={<AdminLayout/>}/>
        <Route path="/admin/applications" element={<AdminViewApplications/>}/>
        <Route path="/admin/status" element={<AdminEditAppStatus/>}/>
        <Route path='/admin/users' element={<AdminManageUsers/>}/>
        <Route path="/admin/site" element={<AdminUpdateSite/>}/>

        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
