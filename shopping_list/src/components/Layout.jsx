import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "../models/sidebar";

const Layout = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="main-layout">
        <Sidebar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
