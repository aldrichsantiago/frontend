import React, {useState,  useEffect} from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import DeanReadOnlyRow from './../../../components/DeanReadOnlyRow'
import DeanEditableRow from './../../../components/DeanEditableRow'

function ManageDeanAccounts() {
    const [deans, setDeans] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [msg, setMsg] = useState('');
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

    useEffect(() => {
        getDeans();
    }, []);

    const getDeans = async () => {
        const response = await axios.get('http://localhost:5000/deans/get', {

        });
        setDeans(response.data);
    }

    const updateDean = async (id) => {
      await axios.patch(`http://localhost:5000/update/dean/${id}`, {
        last_name: editDeanFormData.last_name,
        first_name: editDeanFormData.first_name,
        middle_name: editDeanFormData.middle_name,
        contact_no: editDeanFormData.contact_no,
        email: editDeanFormData.email,
        department: editDeanFormData.department,
        dean_id: editDeanFormData.dean_id,
      });
      getDeans();
    }

    const deleteDean = async (id) => {
      await axios.delete(`http://localhost:5000/delete/dean/${id}`);
      getDeans();
    }

    const addDean = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:5000/register/dean', {
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
        const newDeans = [...deans];

        const index = deans.findIndex((dean) => dean.id === DeanId);

        newDeans.splice(index, 1);

        deleteDean(DeanId);

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
      <div className="users-table">
        <div style={{display:'flex', gap:'1em', textAlign:'left', width: '100%'}}>
          <h1>Dean Accounts</h1>
          <button onClick={()=>setModalIsOpen(!modalIsOpen)}>ADD</button>
        </div>
        <form onSubmit={handleEditFormSubmit}>
          <table>
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
            <h2>Add a Dean</h2>
            <a onClick={()=>setModalIsOpen(false)}>X</a>
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
            <input
                type="text"
                required="required"
                placeholder="Enter an department..."
                name="department"
                onChange={handleAddFormChange}
            />
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
            <button type="submit" onClick={addDean}>Add</button>
            </form>
        </div>
        </Modal>
        
      </div> 
    </>
    )
}

export default ManageDeanAccounts