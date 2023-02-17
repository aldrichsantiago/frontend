import React, {useState,  useEffect} from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify';
import DeanReadOnlyRow from './../../../components/DeanReadOnlyRow'

function ManageDeanAccounts() {
    const [deans, setDeans] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [msg, setMsg] = useState('');
    const [token, setToken] = useState();
    const [expire, setExpire] = useState('');
    const [selectDept, setSelectDept] = useState('');
    const [departments, setDepartments] = useState();
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
        department: "",
        dept_id: 0
    });

    const [editDeanId, setEditDeanId] = useState(null);
    const [changePassModal, setChangePassModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({

    });

    useEffect(() => {
        refreshToken();
        getDeans();
        getDepartments();

    }, []);


  const getDepartments = async () => {
      try{
         const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/departments`);
         setDepartments(response.data);
      }catch(e){console.log(e)}
  }


    const dept_options = departments?.map((dept) =>
        <option key={dept.id} value={dept.dept_id}>{dept.dept_code}</option>
    );

    const selected_dept_options = departments?.map((dept) =>{
      if(editDeanFormData.dept_id == dept.dept_id){
        return <option key={dept.dept_id} value={dept.dept_id} selected>{dept.dept_code}</option>
      } else {
          return <option key={dept.dept_id} value={dept.dept_id}>{dept.dept_code}</option>
      }
      });

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
        dept_id: editDeanFormData.dept_id,
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
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/delete/dean/${id}`,{
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
          notify("Dean has been added to pending registrations");

      } catch (error) {
          if (error.response) {
              setMsg(error.response.data.msg);
              errNotify(error.response.data.msg)
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
        console.log(addDeanFormData);
    };

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editDeanFormData };
        newFormData[fieldName] = fieldValue;

        setEditDeanFormData(newFormData);
        console.log(editDeanFormData)
    };

    const handleChangePassFormChange = (event) => {
      event.preventDefault();

      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;

      const newFormData = { ...passwordForm };
      newFormData[fieldName] = fieldValue;

      setPasswordForm(newFormData);
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
        dept_id: editDeanFormData.department,
        dean_id: editDeanFormData.dean_id,
        };

        updateDean(editedDean.id);
        {console.log(editedDean)}
        setEditDeanId(null);
        setEditModal(false);
        notify("Dean has been updated");
    };

    const handleEditClick = (event, dean) => {
        event.preventDefault();
        setEditModal(true)
        setEditDeanId(dean.id);

        const formValues = {
          last_name: dean.last_name,
          first_name: dean.first_name,
          middle_name: dean.middle_name,
          contact_no: dean.contact_no,
          email: dean.email,
          department: dean.department,
          dept_id: dean.dept_id,
          dean_id: dean.dean_id
        };
        setEditDeanFormData(formValues);
        console.log(editDeanFormData);
    };


    const handleDeleteClick = (DeanId) => {
      let text = '❌ Do you want to delete this Dean Account? '
      if(confirm(text) == true){
        const index = deans.findIndex((dean) => dean.id === DeanId);
        deleteDean(DeanId);
        console.log(DeanId)
        errNotify("Dean has been deleted");
        getDeans();
      }else{}

    };

    const handleChangePassword = (id, dean) => {
      passwordForm.id = id;
      passwordForm.name = (dean.last_name + ", " + dean.first_name + ", " + dean.middle_name);
      passwordForm.dean_id = dean.dean_id;
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
      <div className="dean-view-applications">
        <div style={{display:'flex', gap:'1em', textAlign:'left', width: '100%'}}>
          <h1>Dean Accounts</h1>
          <button className="btn btn-primary my-2 px-5" onClick={()=>setModalIsOpen(!modalIsOpen)}>ADD</button>
        </div>
        <form >
          <table className='students-user-table table table-responsive'>
            <thead>
              <tr>
                <th scope='col' className='fit'>Dean ID</th>
                <th scope='col' className='fit'>Last Name</th>
                <th scope='col' className='fit'>First Name</th>
                <th scope='col' className='fit'>Middle Name</th>
                <th scope='col' className='fit'>Contact No.</th>
                <th scope='col' className='fit'>Email</th>
                <th scope='col' className='fit'>Department</th>
                <th scope='col' className='fit'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deans?.map((dean) => (
                <>
                  {(
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
        <div className="add-user-container container-fluid text-center p-3 w-100">
            <h2 className='text-center m-3'>ADD A DEAN</h2>
            <form onSubmit={addDean} style={{display:'flex', flexDirection:'column'}}>
            <input
              className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a dean ID..."
                name="dean_id"
                onChange={handleAddFormChange}
            />
            <input
              className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a last name..."
                name="last_name"
                onChange={handleAddFormChange}
            />
            <input
              className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a first name..."
                name="first_name"
                onChange={handleAddFormChange}
            />
            <input
              className="form-control m-1"
              type="text"
              required="required"
              placeholder="Enter a middle name..."
              name="middle_name"
              onChange={handleAddFormChange}
            />
            <input
              className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a contact no..."
                name="contact_no"
                onChange={handleAddFormChange}
            />
            <input
              className="form-control m-1"
                type="email"
                required="required"
                placeholder="Enter a email..."
                name="email"
                onChange={handleAddFormChange}
            />
            <select
              className="custom-select m-1"
              required="required"
              name="department"
              value={addDeanFormData.department}
              onChange={(e)=> {
                setSelectDept(e.target.value);
                addDeanFormData.department = e.target.value;
              }}>
                <option value="">Select a department</option>
                {dept_options}
            </select>
            <input
              className="form-control m-1"
                type="password"
                required="required"
                placeholder="Enter a password"
                name="password"
                onChange={handleAddFormChange}
            />
            <input
              className="form-control m-1"
                type="password"
                required="required"
                placeholder="Confirm password"
                name="confPassword"
                onChange={handleAddFormChange}
            />
            <div className="flex">
              <button className='btn btn-dark' type="button" onClick={()=>setModalIsOpen(false)}>CANCEL</button>
              <button className='btn btn-success' type="submit">ADD</button>
            </div>
            
            </form>
        </div>
        </Modal>

        <Modal
        isOpen={editModal}
        style={customStyles}
        ariaHideApp={false}>
        <div className="add-user-container container-fluid text-center p-3">
            <h2 className='m-3'>ADD A DEAN</h2>
            <form onSubmit={handleEditFormSubmit} style={{display:'flex', flexDirection:'column'}}>
            <input
              className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a dean ID..."
                name="dean_id"
                value={editDeanFormData.dean_id}
                onChange={handleEditFormChange}
            />
            <input
              className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a last name..."
                name="last_name"
                value={editDeanFormData.last_name}
                onChange={handleEditFormChange}
            />
            <input
              className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a first name..."
                name="first_name"
                value={editDeanFormData.first_name}
                onChange={handleEditFormChange}
            />
            <input
              className="form-control m-1"
              type="text"
              required="required"
              placeholder="Enter a middle name..."
              name="middle_name"
              value={editDeanFormData.middle_name}
              onChange={handleEditFormChange}
            />
            <input
              className="form-control m-1"
                type="text"
                required="required"
                placeholder="Enter a contact no..."
                name="contact_no"
                value={editDeanFormData.contact_no}
                onChange={handleEditFormChange}
            />
            <input
              className="form-control m-1"
                type="email"
                required="required"
                placeholder="Enter a email..."
                name="email"
                value={editDeanFormData.email}
                onChange={handleEditFormChange}
            />
            <select
              className='custom-select m-1'
              required="required"
              name="dept_id"
              value={editDeanFormData.dept_id}
              onChange={(e)=> {
                setSelectDept(e.target.value);
                editDeanFormData.dept_id = e.target.value;
              }}>
                <option value=""></option>
                {selected_dept_options}
            </select>
            <div className="flex">
              <button className='btn btn-dark' type="button" onClick={()=>setEditModal(false)}>CANCEL</button>
              <button className='btn btn-success' type="submit">UPDATE</button>
            </div>
            
            </form>
        </div>
        </Modal>


        <Modal
        isOpen={changePassModal}
        style={customStyles}
        ariaHideApp={false}>
          <form style={{display:'flex', flexDirection:'column', gap:'1em'}}>
            <input className='form-control' type="text" disabled name='dean-id' value={passwordForm.dean_id}/>
            <input className='form-control' type="text" disabled name='dean_name' value={passwordForm.name}/>
            <input className='form-control' type="password" name='password' placeholder='Enter a Password' onChange={handleChangePassFormChange}/>
            <input className='form-control' type="password" name='confPassword' placeholder='Confirm Password' onChange={handleChangePassFormChange}/>
            <div style={{display:'flex', gap:'1em'}}>
              <button type="button" className='btn btnCancel' onClick={()=>setChangePassModal(false)}>Cancel</button>
              <button type="button" className='btn btnChangePass' onClick={handleChangePasswordSubmit}>Change Password</button>
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