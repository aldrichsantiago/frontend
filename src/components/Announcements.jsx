import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {Carousel} from 'react-responsive-carousel'
import './styles/Announcements.css'


function Announcements() {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(()=>{
        getAnnouncements();
    },[]);

    const getAnnouncements = async() =>{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/announcements/get`);
        setAnnouncements(response.data);
    }
    console.log(announcements);

  return (
    <div className='slider-container'>
        <Carousel showArrows={true} autoPlay infiniteLoop swipeable={true} showThumbs={false}>
            {announcements.map((announce)=>{
                if (!announce.image) {
                    return(
                        <div key={announce.id}>
                            <h1>{announce.title}</h1>
                            <p>{announce.body}</p>
                        </div>
                    )
                }

                return(
                    <div key={announce.id}>
                        <img src={announce.image} alt="" className='announce-img'/>
                        <h1>{announce.title}</h1>
                        <p>{announce.body}</p>
                    </div>
                )
            })}
        </Carousel>
    
    </div>
  )
}

export default Announcements