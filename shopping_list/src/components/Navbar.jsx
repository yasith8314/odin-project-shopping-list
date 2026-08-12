// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      {/* Left side: brand / logo */}
      <div className="nav-left">
        <Link to="/" className="brand">
          🎮 Game Shop
        </Link>
      </div>

      {/* Center: navigation links */}
      <div className="nav-center">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/library" className="nav-link">
          Library
        </Link>
        {user && (
          <Link to="/favorites" className="nav-link">
            ★ Favorites
          </Link>
        )}
      </div>

      {/* Right side: user info + logout */}
      <div className="nav-right">
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
