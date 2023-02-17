import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from 'react-modal'
import jwt_decode from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify';


function DeleteButton ({
    announcement,
    handleDeleteClick
}){
    return <button className='btn btn-danger mx-1' onClick={()=>handleDeleteClick(announcement.announcement_id)}>Delete</button>
}

function UpdateButton ({
    announcement,
    handleEditClick
}){
    return <button className='btn btn-info mx-1' onClick={(e)=>handleEditClick(e, announcement)}>Update</button>
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
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/token`);
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
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/token`);
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
        await axiosJWT.post(`${import.meta.env.VITE_API_URL}/announcements/add`,{
            title: addAnnounceFormData.title,
            body: addAnnounceFormData.body,
            image: addAnnounceFormData.image
        }, {headers: {
            Authorization: `Bearer ${token}`
          }});
          setAddIsOpen(false);
          setAddAnnounceFormData({});
          getAnnouncements();
          notify("Announcement has been added.");

    }

    const getAnnouncements = async () => {
        try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/announcements/get`,{

        });
        setAnnouncements(response.data);
        }catch(e){
            console.log(e)
        }
    }

    const updateAnnouncements = async(id) => {
        await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/announcements/update/${id}`,
            editAnnounceFormData, {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            }
        );
        getAnnouncements();
        notify("Annoucement has been updated");
    }

    const deleteAnnouncements = async(id) => {
        await axiosJWT.delete(`${import.meta.env.VITE_API_URL}/announcements/delete/${id}`,{
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
        setEditAnnouncementId(announcement.announcement_id);

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
        let text = '❌ Do you want to delete this Announcement? '
        if(confirm(text) == true){
            const newAnnouncements = [...announcements];

            const index = announcements.findIndex((announcement) => announcement.announcement_id === announcementId);

            newAnnouncements.splice(index, 1);

            console.log(announcementId);
            deleteAnnouncements(announcementId);
            errNotify("Announcement has been deleted.");
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
        setEditIsOpen(false);
        getAnnouncements();
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

    const errNotify = (msg) => toast.error(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    
      const notify = (msg) => toast.success(msg, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
      });

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
        <div className='announce-header flex flex-wrap text-center'>
            <h1>Announcements</h1>
            <button className='btn btn-success mx-2' onClick={()=>{setAddIsOpen(!addIsOpen)}}>ADD ANNOUNCEMENT</button>
        </div>

        <div className="table-responsive dean-view-applications table-ellipsis">
            <table className='table'>
                <thead>
                    <tr>
                    <th scope='col' className='fit'>Announcement Title</th>
                    <th scope='col' className='fit'>Announcement Body</th>
                    <th scope='col' className='fit'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((announcement)=>(
                         <tr key={announcement.announcement_id}>
                            <td className='fit col-3'>{announcement.title}</td>
                            <td className='fit col-3'>{announcement.body}</td>
                            <td className='fit col-3'>
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
            <div className="add-announce-container container container-fluid">
                <div className="flex text center">
                    <h2>Add an Announcement</h2>
                </div>
                
                <form style={{display:'flex', flexDirection:'column'}}>
                <input className='form-control-file' type="file" accept="image/,.png, .jpg, .jpeg" name="image" id="announcement-image" onChange={handleFileInputChange}/>
                <input
                    class="form-control my-2"
                    size={95}
                    height="10px"
                    type="text"
                    placeholder="Announcement Title"
                    name="title"
                    onChange={handleAddFormChange}
                />
                <textarea
                    rows="20" cols="97"
                    className='addBody form-control'
                    type="text"
                    placeholder="Announcement Body"
                    name="body"
                    onChange={handleAddFormChange}
                />
                <div className="add-buttons text-center flex">
                    <button className='btn btn-dark' onClick={()=>setAddIsOpen(false)}>CANCEL</button>
                    <button className='btn btn-success' type="button" onClick={addAnnouncements}>ADD</button>
                </div>
                
                </form>
            </div>
        </Modal>
        <Modal
            isOpen={editIsOpen}
            style={customStyles}
            ariaHideApp={false}>
                <div className="add-announce-container container container-fluid">
                    <div className="flex text-center">
                        <h2>Edit an Announcement</h2>
                    </div>
                    <input className='form-control-file' type="file" accept="image/,.png, .jpg, .jpeg" name="image" id="announcement-image" onChange={handleFileInputChange}/>
                    <form style={{display:'flex', flexDirection:'column'}}>
                    <input
                        size={95}
                        className='editTitle form-control my-1'
                        type="text"
                        required="required"
                        placeholder="Announcement Title"
                        name="title"
                        onChange={handleEditFormChange}
                        value={editAnnounceFormData.title}
                    />
                    <textarea
                        rows="20" cols="97"
                        className='editBody form-control my-1'
                        type="text"
                        required="required"
                        placeholder="Announcement Body"
                        name="body"
                        onChange={handleEditFormChange}
                        value={editAnnounceFormData.body}
                    />
                    <div className="edit-buttons flex">
                        <button className='btn btn-dark' onClick={()=>setEditIsOpen(false)}>CANCEL</button>
                        <button className='btn btn-success' type="button" onClick={handleEditFormSubmit}>UPDATE</button>
                    </div>
                    </form>
                </div>
            </Modal>
        <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"/>
    </>
  )
}



export default ManageAnnouncements