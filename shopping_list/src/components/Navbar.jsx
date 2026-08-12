import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartPanel from "./CartPanel";
import LogoutButton from "./LogoutButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const { user } = useAuth();
  const { t, toggleLanguage } = useLanguage();
  const client = useQueryClient();
  const { data: notifications = [] } = useQuery({ queryKey: ["notifications"], enabled: Boolean(user), queryFn: async () => (await api.get("/notifications")).data });
  const unread = notifications.filter((item) => !item.isRead).length;
  const markAllRead = async () => { await api.post("/notifications/read-all"); client.invalidateQueries({ queryKey: ["notifications"] }); };
  return (
    <nav className="navbar">
      <div className="nav-left"><Link to="/" className="brand">GameScout</Link></div>
      <div className="nav-center">
        <Link to="/" className="nav-link">{t("home")}</Link>
        <Link to="/library" className="nav-link">{t("library")}</Link>
        {user && <Link to="/favorites" className="nav-link">{t("favorites")}</Link>}
        {user?.role === "admin" && <Link to="/admin" className="nav-link">{t("admin")}</Link>}
        {user && <Link to="/social" className="nav-link">{t("share")}</Link>}
      </div>
      <div className="nav-right">
        <CartPanel />
        {user && <button className="notification-trigger" onClick={markAllRead} title="Mark notifications read" aria-label={`${unread} unread notifications`}>🔔 {unread || ""}</button>}<button className="notification-trigger" onClick={toggleLanguage}>{t("language")}</button>
        {user ? <><span className="user-email">{user.email}</span><LogoutButton /></> : <><Link to="/login" className="nav-link">Login</Link><Link to="/signup" className="nav-link">Sign Up</Link></>}
      </div>
    </nav>
  );
};

export default Navbar;
