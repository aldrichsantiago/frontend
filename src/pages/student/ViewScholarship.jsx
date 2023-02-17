import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from '../../components/Accordion';

import Layout from './Layout'
import './styles/ViewScholarship.css'


function ViewScholarship() {
  const [scholarships, setScholarships] = useState([]);
  const [search, setSearch] = useState([]);

  useEffect(()=>{
    getScholarships();
  },[])

  useEffect(()=>{
    if (search == ''){
      getScholarships();
    }else{
      getSearchedScholarships(search);
    }
    },[search])

  const getScholarships = async() => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/scholarships/get`, {
  });
  setScholarships(response.data);
  }

  const getSearchedScholarships = async(id) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/scholarships/search/${id}`, {
  });
  setScholarships(response.data);
  }
  return (
    <Layout>
        <div className="view-scholarships">
          <div>
            <h1>View Scholarships: </h1>
            <div className="d-flex flex-row w-100 flex align-items-center my-5">
            <span className='col-7'>
              <div className='text-left flex'>
                <div class="input-group w-100 my-1">
                  <div class="input-group-prepend">
                    <span class="input-group-text" >Scholarship Name</span>
                  </div>
                  <input type="text" name="searchField" className='searchField form-control h-100' onChange={(e)=>{setSearch(e.target.value)}}/>
                </div>
              </div>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className='col-4'>
              <label>Scholarship Type: &nbsp; </label>
              <select className='scholarship-select custom-select col-8' id='dean-select-course' onChange={(e)=>setSearch(e.target.value)} value={search}>
                <option value=""> </option>
                <option value="Academic">Academic</option>
                <option value="Athlete">Athlete</option>
                <option value="Cultural">Cultural</option>
                <option value="evangelical">Church</option>
                <option value="Alumn">Alumni</option>
                <option value="st">School Service</option>
                <option value="government">Government</option>
              </select>
            </span>

            </div>
          </div>
          <div className="accordion">
            {scholarships.map(({scholarship_id, scholarship_name, description, requirements }) => (
              <Accordion key={scholarship_id} scholarship_name={scholarship_name} description={description} requirements={requirements}/>
            ))}
          </div>

        </div>

    </Layout>
       
    )
}

export default ViewScholarship