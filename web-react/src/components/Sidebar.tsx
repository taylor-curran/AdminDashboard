import { flushSync } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../auth/AuthContext";

export function Sidebar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    flushSync(() => {
      logout();
    });
    navigate("/login");
  }

  return (
    <div className="sidebar-container">
      <div
        role="link"
        tabIndex={0}
        onClick={() => navigate("/home")}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate("/home");
        }}
      >
        <i className="pi pi-clipboard" />
        <h1>Dashboard</h1>
      </div>
      <nav className="sidebar">
        <NavLink
          className={({ isActive }) => `link${isActive ? " active" : ""}`}
          to="/home"
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
            type="button"
            label="Login"
            className="w-full"
            onClick={() => navigate("/login")}
          />
        ) : (
          <Button
            type="button"
            label="Logout"
            className="w-full"
            onClick={handleLogout}
          />
        )}
      </nav>
    </div>
  );
}
