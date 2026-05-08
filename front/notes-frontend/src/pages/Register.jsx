import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register(){

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password
      });

      // 🔑 sauvegarder token
      localStorage.setItem("token", res.data.token);

      // redirection
      window.location.href = "/notes";

    } catch (error) {
      console.log(error);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div style={{textAlign:'center', marginTop:'100px'}}>
      <h1>Register</h1>

      <input
        placeholder="Name"
        onChange={e => setName(e.target.value)}
      /><br/><br/>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      /><br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      /><br/><br/>

      <button onClick={register}>Register</button>
      <p>
        Already have an account? <Link to="/">Login here</Link>.
      </p>
    </div>
  );
}

export default Register;