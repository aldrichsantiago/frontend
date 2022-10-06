import React from 'react'
import Layout from './Layout'
import Accordion from '../../components/Accordion';
import './styles/ViewScholarship.css'

import { accordionData } from './../../test_data/accordion_content';

function ViewScholarship() {
  return (
    <Layout>
        <div className="view-scholarships">
          <h1>Available Scholarships: </h1>
          <div className="accordion">
            {accordionData.map(({ scholarship_name, description, requirements }) => (
              <Accordion key={scholarship_name} scholarship_name={scholarship_name} description={description} requirements={requirements}/>
            ))}
          </div>

        </div>

    </Layout>
       
    )
}

export default ViewScholarship