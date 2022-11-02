import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import SignaturePad from 'react-signature-canvas'
import Modal from 'react-modal'

import Layout from './Layout'
import'./styles/ScholarshipForm.css'

import styles from './styles/ScholarshipForm.css'


function ScholarshipForm() {
    let sigPad = useRef({});
    let {id} = useParams();
    const [scholarship, setScholarship] = useState({});
    const [requirements, setRequirements] = useState();
    const [signModal, setSignModal] = useState(false);
    let sigData = '';

    useEffect(()=>{
        getScholarship();
        setRequirements(scholarship.requirements?.split(","));

    },[scholarship]);

    const getScholarship = async() => {
    const response = await axios.get(`http://localhost:5000/scholarships/get/${id}`, {
    });
        setScholarship(response.data);
    }

    function sigClear(){
        sigPad.current.clear();
    }
    function sigSave(){
        sigData = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
        console.log(sigData);
        setSignModal(false);
    }
    function sign(){
        setSignModal(true)
        setTimeout(() => {
            if (sigData) {
              sigPad.current.fromData(sigData);
            }
          });
    }

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };


    if (scholarship){
    return (
    <Layout>
        <div className="scholarship-form-container">
            <h1>{id}</h1>
            <form className='scholarship-form'>
                <div className="flex">
                    <div className="subject-codes">
                        <label htmlFor="subject">Subject Codes</label>
                        <input type="text" name="subj_1"/>
                        <input type="text" name="subj_2"/>
                        <input type="text" name="subj_3"/>
                        <input type="text" name="subj_4"/>
                        <input type="text" name="subj_5"/>
                        <input type="text" name="subj_6"/>
                        <input type="text" name="subj_7"/>
                        <input type="text" name="subj_8"/>
                        <input type="text" name="subj_9"/>
                        <input type="text" name="subj_10"/>
                        <input type="text" name="subj_11"/>
                        <input type="text" name="subj_12"/>
                    </div>
                    <div className="units">
                        <label>Units</label>
                        <input type="number" name="units_1"/>
                        <input type="number" name="units_2"/>
                        <input type="number" name="units_3"/>
                        <input type="number" name="units_4"/>
                        <input type="number" name="units_5"/>
                        <input type="number" name="units_6"/>
                        <input type="number" name="units_7"/>
                        <input type="number" name="units_8"/>
                        <input type="number" name="units_9"/>
                        <input type="number" name="units_10"/>
                        <input type="number" name="units_11"/>
                        <input type="number" name="units_12"/>
                    </div>
                    <div className="scholar-attachments">
                        {requirements?.map((requirement, index)=>(
                            <div key={index}>
                                <label >{requirement}: </label>
                                <input type="file"/>
                                <br />
                            </div>
                        ))}

                        <div className="sig-con">
                           
                        </div>
                        <div className="flex">
                            <button type="button" onClick={sign}>SIGN</button>

                        </div>

                    </div>
                </div>
                

                <button type='button'>SUBMIT APPLICATION</button>
                
            </form>
        </div>
        <Modal
        isOpen={signModal}
        style={customStyles}
        ariaHideApp={false}>
            <SignaturePad
            canvasProps={{className: styles.sigPad}}
            ref={sigPad}
            />
            <div className='flex'>
                <button onClick={sigClear}>CLEAR</button>
                <button onClick={sigSave}>SAVE</button>
                
            </div>


        </Modal>

    </Layout>
    
    )}else{
        return <h1>SCHOLARSHIP DOES NOT EXISTS</h1>
    }
}

export default ScholarshipForm