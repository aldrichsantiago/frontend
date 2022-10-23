import React, {useState,  useEffect} from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import PendingDeanReadOnlyRow from './../../../components/PendingDeanReadOnlyRow'

function ManagePendingDeanRegistrations() {
    const [deans, setDeans] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [addDeanFormData, setAddDeanFormData] = useState({
        dean_id: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        contact_no: "",
        email: "",
        department: "",
        password:""

    });

    const [editDeanFormData, setEditDeanFormData] = useState({
        dean_id: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        contact_no: "",
        email: "",
        department: "",
        password:""
    });

    const [editDeanId, setEditDeanId] = useState(null);

    useEffect(() => {
        getDeans();
    }, []);

    const getDeans = async () => {
        const response = await axios.get('http://localhost:5000/pendingdeans/get', {
        });
        setDeans(response.data);
    }

    const approveDean = async (DeanId) => {
      try {
        const index = deans.findIndex((dean) => dean.id === DeanId);
        const dean = deans[index];

        await axios.post('http://localhost:5000/approve/registration/dean', {
          last_name: dean.last_name,
          first_name: dean.first_name,
          middle_name: dean.middle_name,
          contact_no: dean.contact_no,
          email: dean.email,
          department: dean.department,
          dean_id: dean.dean_id,
          password: dean.password
        });

        rejectDean(DeanId);


      } catch (error) {
        console.log(error);
      }
    }

    const rejectDean = async (id) => {
      await axios.delete(`http://localhost:5000/reject/registration/dean/${id}`);
      getDeans();
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
        course: addDeanFormData.course,
        year: addDeanFormData.year,
        student_id: addDeanFormData.student_id,
        };

        const newDeans = [...deans, newDean];
        setDeans(newDeans);
        setModalIsOpen(false);
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

        setDeans(newDeans);
        setEditDeanId(null);
    };

    // const handleEditClick = (event, dean) => {

    // };

    const handleDeleteClick = (DeanId) => {
        const newDeans = [...deans];

        const index = deans.findIndex((dean) => dean.id === DeanId);

        newDeans.splice(index, 1);

        setDeans(newDeans);
        rejectDean(DeanId);
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
          <h1>Pending Dean Registrations</h1>
        </div>
        <form>
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
                  {(
                    <PendingDeanReadOnlyRow
                      key={dean.id}
                      dean={dean}
                      handleApproveClick={approveDean}
                      handleRejectClick={handleDeleteClick}
                    />
                  )}
                </>
              ))}
            </tbody>
          </table>
        </form>
        
      </div> 
    </>
    )
}

export default ManagePendingDeanRegistrations