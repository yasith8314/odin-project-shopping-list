import { useState } from "react";
import "./styles.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setOpen] = useState(false);

  const toggleSideBar = () => {
    setOpen(!isOpen);
  };

  return (
    <>
      {!isOpen && (
        <button className="toggle-btn" onClick={toggleSideBar}>
          ☰
        </button>
      )}

      {isOpen && <div className="overlay" onClick={toggleSideBar}></div>}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSideBar}>
          ✕
        </button>

        <ul className="sidebar-menu">
          <li>
            <Link to="/" className="link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/library" className="link">
              Library
            </Link>
          </li>
          <li>
            <Link to="/best-games-of-all-time" className="link">
              Best Games of All Time
            </Link>
          </li>
          <li>
            <Link to="/best-sellers" className="link">
              BestSellers
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
