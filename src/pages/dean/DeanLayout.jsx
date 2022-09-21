import React, {useState} from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './styles/DeanLayout.css'
import Menu from '../../assets/menu.png'

function Layout({children}) {

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
        <Navbar sm="WUPSCHOLARSHIP" user="CECT DEAN" />
        <div className="content-container">
          <div className="sidebar">
              <Link to="/dean/home">HOME</Link><br />
              <Link to="/dean/applications">VIEW APPLICATIONS</Link><br />
              <Link to="/dean/details">ACCOUNT DETAILS</Link><br />
              <Link to="/dean/home">LOGOUT</Link>
          </div>
            <input type="checkbox" name="burg" id="burg" onChange={handleChange}/>
            <label htmlFor="burg"><img src={Menu} alt="menu-icon"/></label>
            
          <div className="burger-links" style={{'display': {isChecked}}}>
            <Link to="/dean/home">HOME</Link><br />
            <Link to="/dean/applications">VIEW APPLICATIONS</Link><br />
            <Link to="/dean/details">ACCOUNT DETAILS</Link><br />
            <Link to="/dean/home">LOGOUT</Link>
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

export default Layout