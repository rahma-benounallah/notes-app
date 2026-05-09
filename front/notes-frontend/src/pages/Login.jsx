import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Veuillez saisir votre email et votre mot de passe.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name || email);
      window.location.href = "/notes";
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de vous connecter. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-description">
          Connectez-vous pour accéder à vos notes et organiser vos idées, tâches et rappels.
        </p>

        {error && <div className="auth-error">{error}</div>}

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
          onClick={login}
          disabled={loading || !email.trim() || !password.trim()}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="auth-footer">
          Vous n'avez pas de compte ? <Link to="/register">Inscrivez-vous</Link>.
        </p>
      </div>
    </div>
  );
}

export default Login;