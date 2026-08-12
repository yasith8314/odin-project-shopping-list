import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="state-message">Checking administrator access…</div>;
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
