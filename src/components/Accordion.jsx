import React, { useState } from 'react';
import './styles/Accordion.css'


const Accordion = ({scholarship_name, description, requirements }) => {
  const [isActive, setIsActive] = useState(false);
  let linkToGo = `/student/scholarships/${scholarship_name}`;

  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => {
        setIsActive(!isActive)
      }}>
        <span className='accordion-name'><p>{scholarship_name}</p></span>
      </div>
      {isActive && <div className="accordion-content">
          <div>
            <div className="accordion-desc">
              Description: {description}
            </div>
            <div className="accordion-req">
              &nbsp; Requirements: {requirements}
            </div>
          </div>
            <div className='accordion-btn'>
              <a href={linkToGo} onClick={() => {
              setIsActive(!isActive);
              }}>APPLY FOR THIS SCHOLARSHIP</a>
            </div>
        </div>}
    </div>
  );
};

export default Accordion;