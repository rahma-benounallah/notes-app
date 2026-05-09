import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name || name);
      window.location.href = "/notes";
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de créer votre compte. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Créez votre compte</h1>
        <p className="auth-description">
          Inscrivez-vous maintenant pour commencer à enregistrer vos notes, tâches et rappels au même endroit.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <input
            className="auth-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="primary auth-button"
          onClick={register}
          disabled={loading || !name.trim() || !email.trim() || !password.trim()}
        >
          {loading ? "Création du compte..." : "Créer un compte"}
        </button>

        <p className="auth-footer">
          Vous avez déjà un compte ? <Link to="/">Connectez-vous</Link>.
        </p>
      </div>
    </div>
  );
}

export default Register;