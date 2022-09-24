import React, {useState} from 'react'
import './styles/userLogin.css'
import Logo from '../assets/logo.png'

function userLogin(props) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='login-container'>
        <h1>LOG IN</h1>
        <div className="login-form-con">
            <form onSubmit={props.onSubmit}>
            <img src={Logo} alt="LOGO" width="100px"/>

                <input type="text" placeholder={props.id_place} value={id} onChange={(e) => setId(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type="submit" value="LOG IN" />
            </form>
            <div>
                <a href="#" style={{'display': props.forgot_passwd}}>Forgot my password</a><br />
                <a href={props.reg_path} style={{'display': props.new_acc}}>Create an account</a>
            </div>
        </div>
        
    </div>
  )

}

export default userLogin