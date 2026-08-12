// src/components/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/"); // redirect to home
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <main className="auth-page">
    <div className="auth-container">
      <Link to="/" className="auth-brand">GameScout</Link>
      <p className="auth-kicker">WELCOME BACK</p>
      <h1>Sign in to discover more</h1>
      <p className="auth-subtitle">Pick up where you left off and manage your favorites.</p>
      <form onSubmit={handleSubmit}>
        <label>Email address
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </label>
        <label>Password
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </label>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
    </main>
  );
};

export default Login;
