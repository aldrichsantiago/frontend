import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from '../../components/Accordion';

import Layout from './Layout'
import './styles/ViewScholarship.css'


function ViewScholarship() {
  const [scholarships, setScholarships] = useState([]);

  useEffect(()=>{
  getScholarships();
  },[])

  const getScholarships = async() => {
    const response = await axios.get('http://localhost:5000/scholarships/get', {
  });
  setScholarships(response.data);
}
  return (
    <Layout>
        <div className="view-scholarships">
          <h1>View Scholarships: </h1>
          <div className="accordion">
            {scholarships.map(({id, scholarship_name, description, requirements }) => (
              <Accordion key={id} scholarship_name={scholarship_name} description={description} requirements={requirements}/>
            ))}
          </div>

        </div>

    </Layout>
       
    )
}

export default ViewScholarship