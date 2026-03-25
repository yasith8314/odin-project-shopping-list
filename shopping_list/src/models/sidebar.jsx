import { useState } from "react";
import "./styles.css"

const Sidebar = () => {
    const [isOpen, setOpen] = useState(false);

    const toggleSideBar = () => {
        setOpen(!isOpen);
    }

    return (
        <>
            {!isOpen && (
                <button className="toggle-btn" onClick={toggleSideBar}>☰</button>
            )}

            {isOpen && <div className="overlay" onClick={toggleSideBar}></div>}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={toggleSideBar}>
                ✕
                </button>
                
                <ul className="sidebar-menu">
                <li>Dashboard</li>
                <li>Profile</li>
                <li>Settings</li>
                <li>Messages</li>
                <li>Logout</li>
                </ul>
            </div>
        </>
    )
};

export default Sidebar;