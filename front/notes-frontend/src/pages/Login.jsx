import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
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
      setError(err.response?.data?.message || "Error occurred while trying to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/forgot-password", {
        email,
      });

      alert(res.data.message);
      setForgotPassword(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error occurred while sending the reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken.trim() || !newPassword.trim()) {
      setError("Please enter the token and the new password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/reset-password", {
        email,
        token: resetToken,
        password: newPassword,
      });

      alert(res.data.message);
      setForgotPassword(false);
      setResetToken("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Error occurred while resetting the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-description">
          Log in to access your notes, tasks, and reminders all in one place.
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
          {loading ? "Connecting..." : "Login"}
        </button>

        <p className="auth-footer">
          You don't have an account? <Link to="/register">Sign up</Link>.
        </p>
      </div>
    </div>
  );
}

export default Login;