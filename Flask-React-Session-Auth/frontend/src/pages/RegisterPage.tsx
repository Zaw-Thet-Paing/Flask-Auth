import React, { useState } from 'react'
import httpClients from '../httpClients';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {

  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const registerUser = async()=>{
    console.log(email, password);

    try{
      const resp = await httpClients.post('http://localhost:5000/register',{
        email, password
      });
      if(resp.status === 200){
        navigate('/')
      }
    }catch(error:any){
      if(error.response.status === 401){
        alert("Invalid credentials")
      }
    }

  }

  return (
    <div>
      <h1>Create your account</h1>
      <form>
        <div>
          <label htmlFor="">Email : </label>
          <input type="text" value={email} onChange={(e)=> setEmail(e.target.value)} />
        </div>
        <br />
        <div>
          <label htmlFor="">Password : </label>
          <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} />
        </div>
        <button type='button' onClick={registerUser}>Submit</button>
      </form>
    </div>
  )
}

export default RegisterPage;