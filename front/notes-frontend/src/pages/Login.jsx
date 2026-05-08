import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const login = async () => {
    const res = await axios.post("http://127.0.0.1:8000/api/login",{
      email,password
    });

    localStorage.setItem("token", res.data.token);
    window.location.href="/notes";
  };

  return (
    <div style={{textAlign:'center', marginTop:'100px'}}>
      <h1>Login</h1>
      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      /><br/><br/>
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      /><br/><br/>
      <button onClick={login}>Login</button>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
}

export default Login;