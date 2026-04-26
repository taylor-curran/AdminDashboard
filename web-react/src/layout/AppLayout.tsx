import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import "./AppLayout.css";

export function AppLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}
