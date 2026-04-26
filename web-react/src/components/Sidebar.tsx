import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../auth/AuthContext";
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
      <div
        className="sidebar-brand"
        onClick={() => navigate("/home")}
        onKeyDown={(e) => e.key === "Enter" && navigate("/home")}
        role="link"
        tabIndex={0}
      >
        <i className="pi pi-clipboard" />
        <h1>Dashboard</h1>
      </div>
      <nav className="sidebar">
        <NavLink
          className={({ isActive }) => `link${isActive ? " active" : ""}`}
          to="/home"
          end
        >
          <i className="pi pi-home" />
          <span>Home</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `link${isActive ? " active" : ""}`}
          to="/payment-orders"
        >
          <i className="pi pi-shopping-cart" />
          <span>Orders</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `link${isActive ? " active" : ""}`}
          to="/users"
        >
          <i className="pi pi-users" />
          <span>Users</span>
        </NavLink>
        {!isAuthenticated ? (
          <Button
            label="Login"
            className="sidebar-btn"
            onClick={() => navigate("/login")}
          />
        ) : (
          <Button label="Logout" className="sidebar-btn" onClick={handleLogout} />
        )}
      </nav>
    </div>
  );
}
