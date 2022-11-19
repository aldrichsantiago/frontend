import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Modal from 'react-modal'
import jwt_decode from 'jwt-decode'


function DeleteButton ({
  scholarship,
  handleDeleteClick
}){
  return <button onClick={()=>handleDeleteClick(scholarship.id)}>Delete</button>
}

function UpdateButton ({
  scholarship,
  handleEditClick
}){
  return <button onClick={(e)=>handleEditClick(e, scholarship)}>Update</button>
}

function ManageScholarshipInfo() {
    const [scholarships,  setScholarships] = useState([]);
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [editIsOpen, setEditIsOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');

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

  const addScholarships = async() => {
      await axiosJWT.post('http://localhost:5000/scholarships/add',{
          scholarship_name: addScholarshipFormData.scholarship_name,
          description: addScholarshipFormData.description,
          requirements: addScholarshipFormData.requirements
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  }

  const getScholarships = async () => {
      try{
      const response = await axios.get('http://localhost:5000/scholarships/get',{

      });
      setScholarships(response.data);
      }catch(e){
          console.log(e)
      }
  }

  const updateScholarships = async(id) => {
      axiosJWT.patch(`http://localhost:5000/scholarships/update/${id}`,
          editScholarshipFormData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );
  }

  const deleteScholarships = async(id) => {
      await axiosJWT.delete(`http://localhost:5000/scholarships/delete/${id}`,{
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
      setEditScholarshipId(scholarship.id);

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
    let text = 'Do you want to delete this Scholarship? '
      if(confirm(text) == true){
        const newScholarships = [...scholarships];

        const index = scholarships.findIndex((scholarship) => scholarship.id === scholarshipId);

        newScholarships.splice(index, 1);

        console.log(scholarshipId);
        deleteScholarships(scholarshipId);
      }else{}
  };

  const handleEditFormSubmit = () => {
      const editedScholarship = {
      id: editScholarshipId,
      scholarship_name: editScholarshipFormData.scholarship_name,
      description: editScholarshipFormData.description,
      requirements: editScholarshipFormData.requirements
      
      };

      const newScholarships = [...scholarships];

      const index = scholarships.findIndex((scholarship) => scholarship.id === editScholarshipId);

      newScholarships[index] = editedScholarship;

      updateScholarships(editScholarshipId);
      console.log(editedScholarship);

      setEditScholarshipId(null);
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

  
  return (

    <>
      <div className='scholar-header flex'>
        <h2>Manage Scholarship Information</h2>
        <button id='add-scholar' onClick={()=>{setAddIsOpen(!addIsOpen)}}>ADD SCHOLARSHIP</button>
      </div>
      <div className="scholarship-info-table">
        <table>
          <thead>
            <tr>
            <th>Scholarship Name</th>
            <th>Description</th>
            <th>Requirements</th>
            <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((scholarship)=>(
              <tr key={scholarship.id}>
                <td>{scholarship.scholarship_name}</td>
                <td>{scholarship.description}</td>
                <td>{scholarship.requirements}</td>
                <td>
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
          <div className="add-scholarship-container">
              <div className="flex">
                  <h2>Add a Scholarship</h2>
                  <a onClick={()=>setAddIsOpen(false)}>X</a>
              </div>
              
              <form style={{display:'flex', flexDirection:'column'}} onSubmit={addScholarships}>
              <input
                  size={100}
                  height="10px"
                  type="text"
                  required="required"
                  placeholder="Scholarship Name"
                  name="scholarship_name"
                  onChange={handleAddFormChange}
              />
              <textarea
                  rows="10" cols="97"
                  className='addBody'
                  type="text"
                  required="required"
                  placeholder="Description"
                  name="description"
                  onChange={handleAddFormChange}
              />
              <textarea
                  rows="10" cols="97"
                  className='addBody'
                  type="text"
                  required="required"
                  placeholder="Requirements"
                  name="requirements"
                  onChange={handleAddFormChange}
              />
              <p className='note'>Note: Each requirement should be separated by a comma</p>

              <div className="add-buttons">
                  <button type="submit">Add</button>
                  <button onClick={()=>setAddIsOpen(false)}>Cancel</button>
              </div>
              
              </form>
          </div>
      </Modal>
      <Modal
          isOpen={editIsOpen}
          style={customStyles}
          ariaHideApp={false}>
              <div className="edit-shcolarhip-container">
                  <div className="flex">
                      <h2>Edit Scholarships</h2>
                      <a onClick={()=>setEditIsOpen(false)}>X</a>
                  </div>
                  <form style={{display:'flex', flexDirection:'column'}} onSubmit={handleEditFormSubmit}>
                  <input
                      size={93}
                      type="text"
                      required="required"
                      placeholder="Scholarship Name"
                      name="scholarship_name"
                      onChange={handleEditFormChange}
                      value={editScholarshipFormData.scholarship_name}
                  />
                  <textarea
                      rows="10" cols="90"
                      className='editBody'
                      type="text"
                      required="required"
                      placeholder="Description"
                      name="description"
                      onChange={handleEditFormChange}
                      value={editScholarshipFormData.description}
                  />
                  <textarea
                      rows="10" cols="90"
                      type="text"
                      required="required"
                      placeholder="Requirements"
                      name="requirements"
                      onChange={handleEditFormChange}
                      value={editScholarshipFormData.requirements}
                  />
                  <p className='note'>Note: Each requirement should be separated by a comma</p>
                  <div className="edit-buttons">
                      <button type="submit" onClick={handleEditFormSubmit}>Update</button>
                      <button onClick={()=>setEditIsOpen(false)}>Cancel</button>
                  </div>
                  
                  </form>
              </div>
          </Modal>
    </>
  )
}

export default ManageScholarshipInfo