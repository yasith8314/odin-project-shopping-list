import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartPanel from "./CartPanel";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <nav className="navbar">
      <div className="nav-left"><Link to="/" className="brand">GameScout</Link></div>
      <div className="nav-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/library" className="nav-link">Library</Link>
        {user && <Link to="/favorites" className="nav-link">Favorites</Link>}
      </div>
      <div className="nav-right">
        <CartPanel />
        {user ? <><span className="user-email">{user.email}</span><LogoutButton /></> : <><Link to="/login" className="nav-link">Login</Link><Link to="/signup" className="nav-link">Sign Up</Link></>}
      </div>
    </nav>
  );
};

export default Navbar;
