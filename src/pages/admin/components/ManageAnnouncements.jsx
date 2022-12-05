import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from 'react-modal'
import jwt_decode from 'jwt-decode'


function DeleteButton ({
    announcement,
    handleDeleteClick
}){
    return <button onClick={()=>handleDeleteClick(announcement.id)}>Delete</button>
}

function UpdateButton ({
    announcement,
    handleEditClick
}){
    return <button onClick={(e)=>handleEditClick(e, announcement)}>Update</button>
}

function ManageAnnouncements() {
    const [announcements,  setAnnouncements] = useState([]);
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [editIsOpen, setEditIsOpen] = useState(false);
    const [editAnnounceId, setEditAnnounceId] = useState();
    const [msg, setMsg] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');

    const [addAnnounceFormData, setAddAnnounceFormData] = useState({
        title: "",
        body: "",
        image:""
    });
    const [editAnnounceFormData, setEditAnnounceFormData] = useState({
        title: "",
        body: "",
        image:""

    });
    const [editAnnouncementId, setEditAnnouncementId] = useState(null);



    useEffect(()=>{
        refreshToken();
        getAnnouncements();
    },[]);

    const refreshToken = async () => {
        axios.defaults.withCredentials = true;
        try {
          const response = await axios.get('http://localhost:5000/admin/token');
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);
        }
        catch (error) {
          if (error.response) {
            navigate("/");
      
          }
        }
      }
          
      const axiosJWT = axios.create();
    
      axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
          const response = await axios.get('http://localhost:5000/admin/token');
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);
        }
        return config;
      }, (error) => {
          return Promise.reject(error);
      });

    const addAnnouncements = async() => {
        await axiosJWT.post('http://localhost:5000/announcements/add',{
            title: addAnnounceFormData.title,
            body: addAnnounceFormData.body,
            image: addAnnounceFormData.image
        }, {headers: {
            Authorization: `Bearer ${token}`
          }});
    }

    const getAnnouncements = async () => {
        try{
        const response = await axios.get('http://localhost:5000/announcements/get',{

        });
        setAnnouncements(response.data);
        }catch(e){
            console.log(e)
        }
    }

    const updateAnnouncements = async(id) => {
        axiosJWT.patch(`http://localhost:5000/announcements/update/${id}`,
            editAnnounceFormData, {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            }
        );
    }

    const deleteAnnouncements = async(id) => {
        await axiosJWT.delete(`http://localhost:5000/announcements/delete/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`
              }
        });
        getAnnouncements();
    }


    const handleAddFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...addAnnounceFormData };
        newFormData[fieldName] = fieldValue;

        setAddAnnounceFormData(newFormData);
    };

    const handleEditClick = (event, announcement) => {
        event.preventDefault();
        console.log(announcement)
        setEditAnnouncementId(announcement.id);

        const formValues = {
        title: announcement.title,
        body: announcement.body,
        image: announcement.image,
        };

        setEditAnnounceFormData(formValues);
        setEditIsOpen(true)
    };

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editAnnounceFormData };
        newFormData[fieldName] = fieldValue;

        setEditAnnounceFormData(newFormData);
        console.log(editAnnounceFormData)
    };

    const handleCancelClick = () => {
        setEditAnnounceId(null);
    };

    const handleDeleteClick = (announcementId) => {
        let text = 'Do you want to delete this Announcement? '
        if(confirm(text) == true){
            const newAnnouncements = [...announcements];

            const index = announcements.findIndex((announcement) => announcement.id === announcementId);

            newAnnouncements.splice(index, 1);

            console.log(announcementId);
            deleteAnnouncements(announcementId);
        }
        else{}
    };

    const handleEditFormSubmit = () => {
        const editedAnnouncement = {
        id: editAnnouncementId,
        title: editAnnounceFormData.title,
        body: editAnnounceFormData.body,
        
        };

        const newAnnouncements = [...announcements];

        const index = announcements.findIndex((announcement) => announcement.id === editAnnouncementId);

        newAnnouncements[index] = editedAnnouncement;

        updateAnnouncements(editAnnouncementId);
        console.log(editedAnnouncement);

        setEditAnnouncementId(null);
    };

    const handleFileInputChange = e => {
        if(e.target.files[0].size > 2097152){
            alert("File is too big! Pls keep it below 2MB");
            e.target.value = "";
        }else{
            console.log(e.target.files[0]);
            const fieldName = e.target.getAttribute("name");
            const fieldValue = e.target.files[0];
            let file = e.target.files[0];
            let baseURL = "";
            // Make new FileReader
            let reader = new FileReader();
            // Convert the file to base64 text
            reader.readAsDataURL(file);
            reader.onload = () => {
                baseURL = reader.result;
                addAnnounceFormData[fieldName] = baseURL;
                editAnnounceFormData[fieldName] = baseURL;
            }

        }
        
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

    
    console.log(announcements)
  return (
    <>
        <div className='announce-header flex'>
            <h2>Announcements</h2>
            <button id='add-announce' onClick={()=>{setAddIsOpen(!addIsOpen)}}>ADD ANNOUNCEMENT</button>
        </div>

        <div className="announcements-table">
            <table>
                <thead>
                    <tr>
                    <th>Announcement Title</th>
                    <th>Announcement Body</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((announcement)=>(
                         <tr key={announcement.id}>
                            <td>{announcement.title}</td>
                            <td>{announcement.body}</td>
                            <td>
                                <UpdateButton
                                    announcement={announcement}
                                    handleEditClick={handleEditClick}
                                />
                                <DeleteButton
                                    announcement={announcement}
                                    handleDeleteClick={handleDeleteClick}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <Modal
        isOpen={addIsOpen}
        style={customStyles}
        ariaHideApp={false}>
            <div className="add-announce-container">
                <div className="flex">
                    <h2>Add an Announcement</h2>
                </div>
                
                <form style={{display:'flex', flexDirection:'column'}} onSubmit={addAnnouncements}>
                <input type="file" accept="image/,.png, .jpg, .jpeg" name="image" id="announcement-image" onChange={handleFileInputChange}/>
                <input
                    size={95}
                    height="10px"
                    type="text"
                    required="required"
                    placeholder="Announcement Title"
                    name="title"
                    onChange={handleAddFormChange}
                />
                <textarea
                    rows="20" cols="97"
                    className='addBody'
                    type="text"
                    required="required"
                    placeholder="Announcement Body"
                    name="body"
                    onChange={handleAddFormChange}
                />
                <div className="add-buttons">
                    <button onClick={()=>setAddIsOpen(false)}>CANCEL</button>
                    <button type="submit">ADD</button>
                </div>
                
                </form>
            </div>
        </Modal>
        <Modal
            isOpen={editIsOpen}
            style={customStyles}
            ariaHideApp={false}>
                <div className="add-announce-container">
                    <div className="flex">
                        <h2>Edit an Announcement</h2>
                    </div>
                    <input type="file" accept="image/,.png, .jpg, .jpeg" name="image" id="announcement-image" onChange={handleFileInputChange}/>
                    <form style={{display:'flex', flexDirection:'column'}} onSubmit={handleEditFormSubmit}>
                    <input
                        size={95}
                        className='editTitle'
                        type="text"
                        required="required"
                        placeholder="Announcement Title"
                        name="title"
                        onChange={handleEditFormChange}
                        value={editAnnounceFormData.title}
                    />
                    <textarea
                        rows="20" cols="97"
                        className='editBody'
                        type="text"
                        required="required"
                        placeholder="Announcement Body"
                        name="body"
                        onChange={handleEditFormChange}
                        value={editAnnounceFormData.body}
                    />
                    <div className="edit-buttons">
                        <button onClick={()=>setEditIsOpen(false)}>CANCEL</button>
                        <button type="submit" onClick={handleEditFormSubmit}>UPDATE</button>
                    </div>
                    </form>
                </div>
            </Modal>
    </>
  )
}



export default ManageAnnouncements