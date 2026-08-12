// src/models/sidebar.jsx
import { useState } from "react";
import "./styles.css"; // make sure this imports the sidebar CSS
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setOpen] = useState(true); // start open on desktop

  const toggleSideBar = () => {
    setOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle button – always visible */}
      <button className="sidebar-toggle" onClick={toggleSideBar}>
        {isOpen ? "◀" : "▶"}
      </button>

      {/* Overlay (only on mobile when open) */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSideBar}></div>
      )}

      {/* Sidebar itself */}
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/" className="link" onClick={toggleSideBar}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/library" className="link" onClick={toggleSideBar}>
              Library
            </Link>
          </li>
          <li>
            <Link
              to="/best-games-of-all-time"
              className="link"
              onClick={toggleSideBar}
            >
              Best Games
            </Link>
          </li>
          <li>
            <Link to="/best-sellers" className="link" onClick={toggleSideBar}>
              Best Sellers
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
