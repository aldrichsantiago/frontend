import React, { useState } from 'react';
import './styles/Accordion.css'

const Accordion = ({ scholarship_name, description, requirements }) => {
  const [isActive, setIsActive] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => {
        if (showForm == true){
          setIsActive(!isActive);
          setShowForm(!showForm);

        }else{
        }
        setIsActive(!isActive);

        setShowForm(false);

        
      }}>
        <span className='accordion-name'><p>{scholarship_name}</p></span>
      </div>
      {isActive && <div className="accordion-content">
          <div>
            <div className="accordion-desc">
              Description: {description}
            </div>
            <div className="accordion-req">
            Requirements: {requirements}
            </div>
          </div>
            <div className='accordion-btn'><a href="#" onClick={() => {
              setIsActive(!isActive);
              setShowForm(!showForm);
            }}>APPLY FOR THIS SCHOLARSHIP</a></div>
        </div>}

      {showForm && <div className="accordion-content">
        <div>
          <h2>Program Information</h2>
          <div className='scholarship-form-info'>
            <div className="form-col-1">
              <span className="subj-col-1">
                <h3>Subject Code</h3>
                <input type="text"/>
                <input type="text"/>
                <input type="text"/>
                <input type="text"/>
                <input type="text"/>
                <input type="text"/>
              </span>

              <span className="units-col-1">
                <h3>Units</h3>
                <input type="number"/>
                <input type="number"/>
                <input type="number"/>
                <input type="number"/>
                <input type="number"/>
                <input type="number"/>
              </span>
            </div>

            <div className="form-col-2">
              <span className="subj-col-2">
                <h3>Subject Code</h3>
                <input type="text"/>
                <input type="text"/>
                <input type="text"/>
                <input type="text"/>
                <input type="text"/>
                <input type="text"/>
              </span>

              <span className="units-col-2">
                <h3>Units</h3>
                <input type="number"/>
                <input type="number"/>
                <input type="number"/>
                <input type="number"/>
                <input type="number"/>
                <input type="number"/>
              </span>
            </div>
            <div className="scholarship-form-attachments">
              <div>
                <label htmlFor="cog">Certificate of Grades (COG): </label>
                <input type="file" name='cog'/>
              </div>
              <div>
                <label htmlFor="receipt_cog">Receipt of COG: </label>

                <input type="file" name='receipt_cog'/>
              </div>
              <div>
                <label htmlFor="receipt_form">Receipt of Scholarship Form: </label>
                <input type="file" name='receipt_form'/>
              </div>
              
              
              
            </div>
          </div>
        </div>
          <div className='accordion-btn'><a href="#">SUBMIT APPLICATION</a></div>
      </div>}
    </div>
  );
};

export default Accordion;