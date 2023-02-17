import React, {useState,  useEffect} from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify';
import PendingDeanReadOnlyRow from './../../../components/PendingDeanReadOnlyRow'

function ManagePendingDeanRegistrations() {
    const [deans, setDeans] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [token, setToken] = useState();
    const [expire, setExpire] = useState('');
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
      refreshToken();
      getDeans();
    }, []);

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
        const response = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/pendingdeans/get`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDeans(response.data);
    }

    const approveDean = async (DeanId) => {
      let text = '✅ Do you want to approve this dean registration? '
      if(confirm(text) == true){
        try {
          const index = deans.findIndex((dean) => dean.id === DeanId);
          const dean = deans[index];
          await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/approve/registration/dean`, {
            dean_id: dean.dean_id
          },{
            headers: {
              Authorization: `Bearer ${token}`
            }});
          getDeans();
          notify("Dean has been approved");

        } catch (error) {console.log(error);}
      }else{}
    }

    const rejectDean = async (id) => {
      await axiosJWT.patch(`${import.meta.env.VITE_API_URL}/reject/registration/dean/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      getDeans();
      errNotify("Dean has been rejected");

    }


    const handleDeleteClick = (DeanId) => {
      let text = '❌ Do you want to reject this dean registration? '
      if(confirm(text) == true){
        // const newDeans = [...deans];

        // const index = deans.findIndex((dean) => dean.id === DeanId);

        // newDeans.splice(index, 1);

        // setDeans(newDeans);
        rejectDean(DeanId);

      }else{}
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
          <h1>Pending Dean Registrations</h1>
        </div>
        <form>
          <table className='table table-responsive'>
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

export default ManagePendingDeanRegistrations