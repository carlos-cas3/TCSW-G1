import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";
import { Outlet, useLocation } from "react-router-dom";
import "./Layout.css";

const pageTitles = {
  "/": "Dashboard",
  "/vendors": "Gestión de Vendedores",
  "/settings": "Settings",
};

export default function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="layout">
      <Sidebar />
      <Topbar title={title} />
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}