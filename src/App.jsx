import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import StudentLogin from './pages/StudentLogin'
import DeanLogin from './pages/DeanLogin'
import AdminLogin from './pages/AdminLogin'
import StudentRegister from './pages/StudentRegister'
import DeanRegister from './pages/DeanRegister'
import PageNotFound from './pages/PageNotFound'

import StudentHome from './pages/student/StudentHome'
import AccountDetails from './pages/student/AccountDetails'
import ViewScholarship from './pages/student/ViewScholarship'
import ApplicationStatus from './pages/student/ApplicationStatus'

import DeanHome from './pages/dean/DeanHome'
import DeanViewApplications from './pages/dean/ViewApplications'
import DeanAccountDetails from './pages/dean/DeanAccountDetails'

import AdminHome from './pages/admin/AdminHome'
import AdminViewApplications from './pages/admin/ViewApplications'
import AdminManageUsers from './pages/admin/ManageUserAccounts'
import AdminUpdateSite from './pages/admin/UpdateSiteContent'
import ScholarshipForm from './pages/student/ScholarshipForm'
import DeanApplicationReview from './pages/dean/DeanApplicationReview'
import AdminApplicationReview from './pages/admin/AdminApplicationReview'
import AdminApprovedApplications from './pages/admin/AdminApprovedApplications'
import DeanApprovedApplicationView from './pages/dean/DeanApprovedApplicationView'
import ViewAllApprovedApplications from './pages/admin/components/ViewAllApprovedApplications'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>

        <Route path='/student' element={<StudentLogin/>}/>
        <Route path='/register/student' element={<StudentRegister/>}/>
        
        <Route path='/dean' element={<DeanLogin/>}/>
        <Route path='/register/dean' element={<DeanRegister/>}/>

        <Route path='/admin' element={<AdminLogin/>}/>


        <Route path='/student/home' element={<StudentHome/>}/>
        <Route path="/student/scholarships" element={<ViewScholarship/>}/>
        <Route path="/student/scholarships/:id" element={<ScholarshipForm/>}/>
        <Route path="/student/status" element={<ApplicationStatus/>}/>
        <Route path="/student/details" element={<AccountDetails/>}/>

        <Route path='/dean/home' element={<DeanHome/>}/>
        <Route path="/dean/applications" element={<DeanViewApplications/>}/>
        <Route path="/dean/applications/review/:id" element={<DeanApplicationReview/>}/>
        <Route path="/dean/view/approved/application/:id" element={<DeanApprovedApplicationView/>}/>
        <Route path="/dean/details" element={<DeanAccountDetails/>}/>

        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path="/admin/applications" element={<AdminViewApplications/>}/>
        <Route path="/admin/applications/review/:id" element={<AdminApplicationReview/>}/>
        <Route path="/admin/approved/application/:id" element={<AdminApprovedApplications/>}/>
        <Route path="/admin/view/approved/applications" element={<ViewAllApprovedApplications/>}/>
        <Route path='/admin/users' element={<AdminManageUsers/>}/>
        <Route path="/admin/site" element={<AdminUpdateSite/>}/>

        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
