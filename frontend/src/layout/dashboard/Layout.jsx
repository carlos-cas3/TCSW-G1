import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";
import { Outlet, useLocation } from "react-router-dom";
import "./Layout.css";

const pageTitles = {
    "/admin":             "Admin Dashboard",
    "/admin/vendors":     "Gestión de Vendedores",
    "/admin/branches":    "Gestión de Sucursales",
    "/admin/catalog":     "Gestión de Catálogo",
    "/admin/analytics":   "Análisis y Reportes",
    "/dashboard":         "Dashboard",
    "/dashboard/catalog": "Catálogo",
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