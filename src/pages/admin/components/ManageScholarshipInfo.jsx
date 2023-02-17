import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Modal from 'react-modal'
import jwt_decode from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify';


function DeleteButton ({
  scholarship,
  handleDeleteClick
}){
  return <button className='btn btn-danger mx-1 px-4' onClick={()=>handleDeleteClick(scholarship.scholarship_id)}>Delete</button>
}

function UpdateButton ({
  scholarship,
  handleEditClick
}){
  return <button className='btn btn-info mx-1 px-4' onClick={(e)=>handleEditClick(e, scholarship)}>Update</button>
}

function ManageScholarshipInfo() {
    const [scholarships,  setScholarships] = useState([]);
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [editIsOpen, setEditIsOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();

    const [addScholarshipFormData, setAddScholarshipFormData] = useState({
      scholarship_name: "",
      description: "",
      requirements: ""
    });
    const [editScholarshipFormData, setEditScholarshipFormData] = useState({
      scholarship_name: "",
      description: "",
      requirements: ""
    });
    const [editScholarshipId, setEditScholarshipId] = useState(null);

    useEffect(()=>{
      refreshToken();
      getScholarships();
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

  const addScholarships = async() => {
    await axiosJWT.post(`${import.meta.env.VITE_API_URL}/scholarships/add`,{
      scholarship_name: addScholarshipFormData.scholarship_name,
      description: addScholarshipFormData.description,
      requirements: addScholarshipFormData.requirements}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
    getScholarships();
    notify("Scholarship has been added.");
  }

  const getScholarships = async() => {
      try{
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/scholarships/get`,{

      });
      setScholarships(response.data);
      }catch(e){
          console.log(e)
      }
  }

  const updateScholarships = async(id) => {
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/scholarships/update/${id}`,
          editScholarshipFormData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );
      getScholarships();

  }

  const deleteScholarships = async(id) => {
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/scholarships/delete/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      getScholarships();
  }


  const handleAddFormChange = (event) => {
      event.preventDefault();

      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;

      const newFormData = { ...addScholarshipFormData };
      newFormData[fieldName] = fieldValue;

      setAddScholarshipFormData(newFormData);
  };

  const handleEditClick = (event, scholarship) => {
      event.preventDefault();
      console.log(scholarship)
      setEditScholarshipId(scholarship.scholarship_id);

      const formValues = {
      scholarship_name: scholarship.scholarship_name,
      description: scholarship.description,
      requirements: scholarship.requirements
      };

      setEditScholarshipFormData(formValues);
      // console.log(formValues);
      setEditIsOpen(true)
  };

  const handleEditFormChange = (event) => {
      event.preventDefault();

      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;

      const newFormData = { ...editScholarshipFormData };
      newFormData[fieldName] = fieldValue;

      setEditScholarshipFormData(newFormData);
      console.log(editScholarshipFormData)
  };

  const handleCancelClick = () => {
      setEditAnnounceId(null);
  };

  const handleDeleteClick = (scholarshipId) => {
    let text = '❌ Do you want to delete this Scholarship? '
      if(confirm(text) == true){
        const newScholarships = [...scholarships];

        const index = scholarships.findIndex((scholarship) => scholarship.scholarship_id === scholarshipId);

        newScholarships.splice(index, 1);

        console.log(scholarshipId);
        deleteScholarships(scholarshipId);
        errNotify("Scholarship has been deleted.");
      }else{}
  };

  const handleEditFormSubmit = () => {
    const editedScholarship = {
    scholarship_id: editScholarshipId,
    scholarship_name: editScholarshipFormData.scholarship_name,
    description: editScholarshipFormData.description,
    requirements: editScholarshipFormData.requirements
    
    };

    const newScholarships = [...scholarships];

    const index = scholarships.findIndex((scholarship) => scholarship.scholarship_id === editScholarshipId);

    newScholarships[index] = editedScholarship;

    updateScholarships(editScholarshipId);
    console.log(editedScholarship);

    setEditScholarshipId(null);
    setEditIsOpen(false);
    getScholarships();
    notify("Scholarship has been updated.");
  };

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

    const validateAdd = () => {
      if (addScholarshipFormData.scholarship_name.includes('/')){
        alert("Scholarship names shouldn't include slashes; Use | instead.");
      } else if (addScholarshipFormData.scholarship_name.includes('\\')){
        alert("Scholarship names shouldn't include slashes; Use | instead.");
      } else if (addScholarshipFormData.scholarship_name.includes('.')){
        alert("Scholarship names shouldn't include dots.");
      } else{
        addScholarships();
        setAddIsOpen(false);
      }
    };

    const validateEdit = async() => {
      if (editScholarshipFormData.scholarship_name.includes('/')){
        alert("Scholarship names shouldn't include slashes; Use | instead.");
      } else if (editScholarshipFormData.scholarship_name.includes('\\')){
        alert("Scholarship names shouldn't include slashes; Use | instead.");
      } else if (editScholarshipFormData.scholarship_name.includes('.')){
        alert("Scholarship names shouldn't include dots.");
      }else{
        handleEditFormSubmit();
        setAddIsOpen(false);
      }
      getScholarships();
    };


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
  
  return (

    <>
      <div className='scholar-header flex'>
        <h1>Scholarship Informations</h1>
        <button id='add-scholar' className='btn btn-success mx-3' onClick={()=>{setAddIsOpen(!addIsOpen)}}>ADD SCHOLARSHIP</button>
      </div>
      <div className="scholarship-info-table table-responsive dean-view-applications">
        <table className='table'>
          <thead>
            <tr>
            <th scope='col' className='fit'>Scholarship Name</th>
            <th scope='col' className='fit'>Description</th>
            <th scope='col' className='fit'>Requirements</th>
            <th scope='col' className='fit'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((scholarship)=>(
              <tr key={scholarship.id}>
                <td className='fit col-3'>{scholarship.scholarship_name}</td>
                <td className='fit col-3'>{scholarship.description}</td>
                <td className='fit col-3'>{scholarship.requirements}</td>
                <td className='fit col-3'>
                  <UpdateButton
                      scholarship={scholarship}
                      handleEditClick={handleEditClick}
                  />
                  <DeleteButton
                      scholarship={scholarship}
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
          <div className="add-scholarship-container container container-fluid">
              <div className="flex ">
                  <h2>Add a Scholarship</h2>
              </div>
              
              <form style={{display:'flex', flexDirection:'column'}}>
              <input
                className='form-control'
                  size={88}
                  height="10px"
                  type="text"
                  required="required"
                  placeholder="Scholarship Name"
                  name="scholarship_name"
                  onChange={handleAddFormChange}
              />
              <textarea
                  rows="10" cols="90"
                  className='addBody form-control my-2'
                  type="text"
                  required="required"
                  placeholder="Description"
                  name="description"
                  onChange={handleAddFormChange}
              />
              <textarea
                  rows="10" cols="90"
                  className='addBody form-control'
                  type="text"
                  required="required"
                  placeholder="Requirements"
                  name="requirements"
                  onChange={handleAddFormChange}
              />
              <p className='note'>Note: Each requirement should be separated by a comma</p>

              <div className="add-buttons flex">
                  <button className='btn btn-dark' onClick={()=>setAddIsOpen(false)}>CANCEL</button>
                  <button className='btn btn-success' type="button" onClick={validateAdd}>ADD</button>
              </div>
              
              </form>
          </div>
      </Modal>
      <Modal
          isOpen={editIsOpen}
          style={customStyles}
          ariaHideApp={false}>
              <div className="add-scholarship-container container container-fluid">
                  <div className="flex text-center">
                      <h2>Edit Scholarship</h2>
                  </div>
                  <form style={{display:'flex', flexDirection:'column'}}>
                  <input
                    className='form-control'
                      size={88}
                      type="text"
                      required="required"
                      placeholder="Scholarship Name"
                      name="scholarship_name"
                      onChange={handleEditFormChange}
                      value={editScholarshipFormData.scholarship_name}
                  />
                  <textarea
                      rows="10" cols="90"
                      className='editBody form-control my-2'
                      type="text"
                      required="required"
                      placeholder="Description"
                      name="description"
                      onChange={handleEditFormChange}
                      value={editScholarshipFormData.description}
                  />
                  <textarea
                    className='form-control'
                      rows="10" cols="90"
                      type="text"
                      required="required"
                      placeholder="Requirements"
                      name="requirements"
                      onChange={handleEditFormChange}
                      value={editScholarshipFormData.requirements}
                  />
                  <p className='note'>Note: Each requirement should be separated by a comma</p>
                  <div className="edit-buttons flex">
                    <button className='btn btn-dark' onClick={()=>setEditIsOpen(false)}>CANCEL</button>
                    <button className='btn btn-success' type="button" onClick={validateEdit}>UPDATE</button>
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

export default ManageScholarshipInfo