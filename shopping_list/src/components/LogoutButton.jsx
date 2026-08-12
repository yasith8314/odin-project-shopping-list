// src/components/LogoutButton.jsx
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();
  return <button className="logout-btn" onClick={logout}>Logout</button>;
};

export default LogoutButton;
