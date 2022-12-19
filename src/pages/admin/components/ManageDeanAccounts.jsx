import React, {useState,  useEffect} from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify';
import DeanReadOnlyRow from './../../../components/DeanReadOnlyRow'
import DeanEditableRow from './../../../components/DeanEditableRow'

function ManageDeanAccounts() {
    const [deans, setDeans] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [token, setToken] = useState();
    const [expire, setExpire] = useState('');
    const [selectDept, setSelectDept] = useState('');
    const [addDeanFormData, setAddDeanFormData] = useState({
        dean_id: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        contact_no: "",
        email: "",
        department: "",
        password: "",
        confPassword: "",
    });

    const [editDeanFormData, setEditDeanFormData] = useState({
        dean_id: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        contact_no: "",
        email: "",
        department: ""
    });

    const [editDeanId, setEditDeanId] = useState(null);
    const [changePassModal, setChangePassModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({

    });

    useEffect(() => {
        refreshToken();
        getDeans();
    }, []);

    const departments = ["Choose a Deparment","CECT", "CONAMS", "CBA", "CHTM", "CAS", "CoEd", "CCJE", "Medicine", "JWSLG", "High School", "Elementary"];
    
    const dept_options = departments.map((dept) =>
      <option key={dept} value={dept}>{dept}</option>
    );

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

    const getDeans = async () => {
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/deans/get`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDeans(response.data);
    }

    const updateDean = async (id) => {
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/update/dean/${id}`, {
        last_name: editDeanFormData.last_name,
        first_name: editDeanFormData.first_name,
        middle_name: editDeanFormData.middle_name,
        contact_no: editDeanFormData.contact_no,
        email: editDeanFormData.email,
        department: editDeanFormData.department,
        dean_id: editDeanFormData.dean_id,
      },{headers: {
        Authorization: `Bearer ${token}`
      }});
      getDeans();
    }

    const changePassword = async () => {
      try{
        await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/change/dean/password`, passwordForm, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }catch(e){
        console.log(e);
      }
    }

    const deleteDean = async (id) => {
      await axiosJWT.delete(`${import.meta.env.VITE_API_URL}/delete/dean/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      getDeans();
    }

    const addDean = async (e) => {
      e.preventDefault();
      try {
        await axiosJWT.post(`${import.meta.env.VITE_API_URL}/register/dean`, {
          id: deans.length,
          last_name: addDeanFormData.last_name,
          first_name: addDeanFormData.first_name,
          middle_name: addDeanFormData.middle_name,
          contact_no: addDeanFormData.contact_no,
          email: addDeanFormData.email,
          department: addDeanFormData.department,
          dean_id: addDeanFormData.dean_id,
          password: addDeanFormData.password,
          confPassword: addDeanFormData.confPassword
        },{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
          setModalIsOpen(false);
          getDeans();

      } catch (error) {
          if (error.response) {
              setMsg(error.response.data.msg);
          }
      }
    }

    const handleAddFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...addDeanFormData };
        newFormData[fieldName] = fieldValue;

        setAddDeanFormData(newFormData);
    };

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editDeanFormData };
        newFormData[fieldName] = fieldValue;

        setEditDeanFormData(newFormData);
    };

    const handleChangePassFormChange = (event) => {
      event.preventDefault();

      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;

      const newFormData = { ...passwordForm };
      newFormData[fieldName] = fieldValue;

      setPasswordForm(newFormData);
  };

    const handleAddFormSubmit = (event) => {
        event.preventDefault();

        const newDean = {
        id: deans.length,
        last_name: addDeanFormData.last_name,
        first_name: addDeanFormData.first_name,
        middle_name: addDeanFormData.middle_name,
        contact_no: addDeanFormData.contact_no,
        email: addDeanFormData.email,
        department: addDeanFormData.department,
        dean_id: addDeanFormData.dean_id,
        };

        const newDeans = [...deans, newDean];
        setDeans(newDeans);
        setModalIsOpen(false);
        addDean();
    };

    const handleEditFormSubmit = (event) => {
        event.preventDefault();

        const editedDean = {
        id: editDeanId,
        last_name: editDeanFormData.last_name,
        first_name: editDeanFormData.first_name,
        middle_name: editDeanFormData.middle_name,
        contact_no: editDeanFormData.contact_no,
        email: editDeanFormData.email,
        department: editDeanFormData.department,
        dean_id: editDeanFormData.dean_id,
        };

        const newDeans = [...deans];

        const index = deans.findIndex((dean) => dean.id === editDeanId);

        newDeans[index] = editedDean;

        updateDean(editedDean.id);
        {console.log(editedDean)}

        setDeans(newDeans);
        setEditDeanId(null);
    };

    const handleEditClick = (event, dean) => {
        event.preventDefault();
        setEditDeanId(dean.id);

        const formValues = {
        last_name: dean.last_name,
        first_name: dean.first_name,
        middle_name: dean.middle_name,
        contact_no: dean.contact_no,
        email: dean.email,
        department: dean.department,
        dean_id: dean.dean_id,
        };

        setEditDeanFormData(formValues);
    };

    const handleCancelClick = () => {
        setEditDeanId(null);
    };

    const handleDeleteClick = (DeanId) => {
      let text = '❌ Do you want to delete this Dean Account? '
      if(confirm(text) == true){
        const newDeans = [...deans];

        const index = deans.findIndex((dean) => dean.id === DeanId);

        newDeans.splice(index, 1);

        deleteDean(DeanId);
      }else{}

    };

    const handleChangePassword = (id) => {
      passwordForm.student_id = id;
      setChangePassModal(true);

    }
    const handleChangePasswordSubmit = () => {
      console.log(passwordForm);
      changePassword();
      setChangePassModal(false);
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

  useEffect(()=>{
    if(msg == ''){
    }else{
        notify();
    }
  },[msg]);

  const notify = () => toast.error(msg, {
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
      <div className="users-table-header">
        <div style={{display:'flex', gap:'1em', textAlign:'left', width: '100%'}}>
          <h1>Dean Accounts</h1>
          <button className="add_btn" onClick={()=>setModalIsOpen(!modalIsOpen)}>ADD</button>
        </div>
        <form onSubmit={handleEditFormSubmit}>
          <table className='students-user-table'>
            <thead>
              <tr>
                <th>Dean ID</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Contact No.</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deans?.map((dean) => (
                <>
                  {editDeanId === dean.id ? (
                    <DeanEditableRow
                      editFormData={editDeanFormData}
                      handleEditFormChange={handleEditFormChange}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <DeanReadOnlyRow
                      key={dean.id}
                      dean={dean}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                      handleChangePassword={handleChangePassword}
                    />
                  )}
                </>
              ))}
            </tbody>
          </table>
        </form>
        <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        ariaHideApp={false}>
        <div className="add-user-container">
            <h2>ADD A DEAN</h2>
            <form onSubmit={addDean} style={{display:'flex', flexDirection:'column'}}>
            <input
                type="text"
                required="required"
                placeholder="Enter a dean ID..."
                name="dean_id"
                onChange={handleAddFormChange}
            />
            <input
                type="text"
                required="required"
                placeholder="Enter a last name..."
                name="last_name"
                onChange={handleAddFormChange}
            />
            <input
                type="text"
                required="required"
                placeholder="Enter a first name..."
                name="first_name"
                onChange={handleAddFormChange}
            />
            <input
              type="text"
              required="required"
              placeholder="Enter a middle name..."
              name="middle_name"
              onChange={handleAddFormChange}
            />
            <input
                type="text"
                required="required"
                placeholder="Enter a contact no..."
                name="contact_no"
                onChange={handleAddFormChange}
            />
            <input
                type="email"
                required="required"
                placeholder="Enter a email..."
                name="email"
                onChange={handleAddFormChange}
            />
            <select
              required="required"
              name="department"
              value={addDeanFormData.department}
              onChange={(e)=> {
                setSelectDept(e.target.value);
                addDeanFormData.department = e.target.value;
              }}
              >
                {dept_options}
            </select>
            <input
                type="password"
                required="required"
                placeholder="Enter a password"
                name="password"
                onChange={handleAddFormChange}
            />
            <input
                type="password"
                required="required"
                placeholder="Confirm password"
                name="confPassword"
                onChange={handleAddFormChange}
            />
            <div className="flex">
              <button type="button" onClick={()=>setModalIsOpen(false)}>CANCEL</button>
              <button type="submit" onClick={addDean}>ADD</button>
            </div>
            
            </form>
        </div>
        </Modal>
        <Modal
        isOpen={changePassModal}
        style={customStyles}
        ariaHideApp={false}>
          <form style={{display:'flex', flexDirection:'column', gap:'1em'}}>
            <input type="password" name='password' placeholder='Enter a Password' onChange={handleChangePassFormChange}/>
            <input type="password" name='confPassword' placeholder='Confirm Password' onChange={handleChangePassFormChange}/>
            <div style={{display:'flex', gap:'1em'}}>
              <button type="button" className='btnCancel' onClick={()=>setChangePassModal(false)}>Cancel</button>
              <button type="button" className='btnChangePass' onClick={handleChangePasswordSubmit}>Change Password</button>
            </div>
          </form>
        </Modal>
      </div> 
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

export default ManageDeanAccounts