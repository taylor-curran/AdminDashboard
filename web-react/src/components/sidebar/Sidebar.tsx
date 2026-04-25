import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Sidebar.css";

export function Sidebar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-brand" onClick={() => navigate("/home")}>
        <i className="pi pi-clipboard"></i>
        <h1>Dashboard</h1>
      </div>
      <nav className="sidebar">
        <NavLink className={({ isActive }) => `link${isActive ? " active" : ""}`} to="/home">
          <i className="pi pi-home"></i>
          <span>Home</span>
        </NavLink>
        <NavLink className={({ isActive }) => `link${isActive ? " active" : ""}`} to="/payment-orders">
          <i className="pi pi-shopping-cart"></i>
          <span>Orders</span>
        </NavLink>
        <NavLink className={({ isActive }) => `link${isActive ? " active" : ""}`} to="/users">
          <i className="pi pi-users"></i>
          <span>Users</span>
        </NavLink>
        {!isAuthenticated ? (
          <button className="p-button" onClick={() => navigate("/login")}>
            <div className="btn">Login</div>
          </button>
        ) : (
          <button className="p-button" onClick={handleLogout}>
            <div className="btn">Logout</div>
          </button>
        )}
      </nav>
    </div>
  );
}
