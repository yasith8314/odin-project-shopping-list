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
      {/* Sidebar itself */}
      <aside id="app-sidebar" className={`sidebar ${isOpen ? "open" : "closed"}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/" className="link" onClick={() => setOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/library" className="link" onClick={() => setOpen(false)}>
              Library
            </Link>
          </li>
          <li>
            <Link
              to="/best-games-of-all-time"
              className="link"
              onClick={() => setOpen(false)}
            >
              Best Games
            </Link>
          </li>
          <li>
            <Link to="/best-sellers" className="link" onClick={() => setOpen(false)}>
              Best Sellers
            </Link>
          </li>
        </ul>
      </aside>

      {/* Overlay and toggle stay above the drawer on small screens. */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSideBar}></div>}
      <button className="sidebar-toggle" onClick={toggleSideBar} aria-expanded={isOpen} aria-controls="app-sidebar" aria-label={isOpen ? "Close navigation" : "Open navigation"}>
        {isOpen ? "◀" : "▶"}
      </button>
    </>
  );
};

export default Sidebar;
