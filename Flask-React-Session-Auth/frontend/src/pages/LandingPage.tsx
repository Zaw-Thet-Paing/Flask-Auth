import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User } from '../types';
import httpClients from '../httpClients';

function LandingPage() {

    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    const logoutUser = async ()=>{
        await httpClients.post("http://localhost:5000/logout");
        navigate("/")
        window.location.reload()
    }

    useEffect(()=>{
        (async ()=>{
            try{
                const resp = await httpClients.get('http://localhost:5000/@me');
                setUser(resp.data)
            }catch(error:any){
                console.log("Not authenticated!")
            }
        })();
    }, []);

  return (
    <div>
        <h1>Welcome to the React Application</h1>
        {user != null ? (
            <div>
                <h1>Logged in</h1>
                <h3>ID : {user.id}</h3>
                <h3>Email : {user.email}</h3>
                <button onClick={logoutUser}>Logout</button>
            </div>
        ): (
            <div>
                <p>You are not login</p>
                <Link to="/login">
                    <button>Login</button>
                </Link>
                <Link to="/register">
                    <button>Register</button>
                </Link>
            </div>
        )}
    </div>
  )
}

export default LandingPage