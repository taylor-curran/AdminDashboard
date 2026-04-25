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
    <div className="sidebar-container app-sidebar" data-testid="sidebar">
      <div
        className="brand"
        onClick={() => navigate("/home")}
        role="button"
        tabIndex={0}
      >
        <i className="pi pi-clipboard"></i>
        <h1>Dashboard</h1>
      </div>
      <nav className="sidebar">
        <NavLink
          className={({ isActive }) => "link" + (isActive ? " active" : "")}
          to="/home"
          aria-current="page"
        >
          <i className="pi pi-home"></i>
          <span>Home</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => "link" + (isActive ? " active" : "")}
          to="/payment-orders"
        >
          <i className="pi pi-shopping-cart"></i>
          <span>Orders</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => "link" + (isActive ? " active" : "")}
          to="/users"
        >
          <i className="pi pi-users"></i>
          <span>Users</span>
        </NavLink>
        {!isAuthenticated ? (
          <Button onClick={() => navigate("/login")}>
            <div className="btn">Login</div>
          </Button>
        ) : (
          <Button onClick={handleLogout}>
            <div className="btn">Logout</div>
          </Button>
        )}
      </nav>
    </div>
  );
}
