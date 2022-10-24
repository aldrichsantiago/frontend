import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './styles/AdminLayout.css'
import Menu from '../../assets/menu.png'

function AdminLayout({children}) {

  const [isChecked, setIsChecked] = useState('none');

  const handleChange = event => {
    if (event.target.checked) {
      setIsChecked('display');
      console.log('checked');
      document.querySelector('.burger-links').style.display = "block";
    } else {
      setIsChecked('none');
      console.log('not checked');
      document.querySelector('.burger-links').style.display = "none";
    }
  };

  return (
    <>
        <Navbar sm="WUPSCHOLARSHIP" user="ADMINISTRATOR" />
        <div className="content-container">
          <div className="sidebar">
              <Link to="/admin/home">HOME</Link><br />
              <Link to="/admin/applications">VIEW APPLICATIONS</Link><br />
              <Link to="/admin/users">MANAGE USER ACCOUNTS</Link><br />
              <Link to="/admin/site">UPDATE SITE CONTENT</Link><br />
              <Link to="/admin/home">LOGOUT</Link>
          </div>
            <input type="checkbox" name="burg" id="burg" onChange={handleChange}/>
            <label htmlFor="burg"><img src={Menu} alt="menu-icon"/></label>
            
          <div className="burger-links" style={{'display': {isChecked}}}>
            <Link to="/admin/home">HOME</Link><br />
            <Link to="/admin/applications">VIEW APPLICATIONS</Link><br />
            <Link to="/admin/users">MANAGE USER ACCOUNTS</Link><br />
            <Link to="/admin/site">UPDATE SITE CONTENT</Link><br />
            <Link to="/admin/home">LOGOUT</Link>
          </div>
          <main>{children}</main>
        </div>
        <div className="footer">
          <div className="foo-contact-info">
            <h3>Contact Information</h3>
            <h3>Contact Information</h3>
            <h3>Contact Information</h3>
          </div>
          
        </div>
        
    </>
  )
}

export default AdminLayout