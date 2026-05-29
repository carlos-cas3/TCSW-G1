import { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";
import { Outlet, useLocation } from "react-router-dom";

const pageTitles = {
    "/admin": "Admin Dashboard",
    "/admin/vendors": "Gestión de Vendedores",
    "/admin/branches": "Gestión de Sucursales",
    "/admin/catalog": "Gestión de Catálogo",
    "/admin/analytics": "Análisis y Reportes",
    "/user": "Dashboard",
    "/user/catalog": "Catálogo",
};

export default function Layout() {
    const location = useLocation();
    const title = pageTitles[location.pathname] || "Dashboard";
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleToggle = () => {
        if (window.innerWidth < 768) {
            setMobileOpen((prev) => !prev);
        } else {
            setCollapsed((prev) => !prev);
        }
    };

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 767px)");
        const sync = (e) => {
            setCollapsed(false);
            if (!e.matches) setMobileOpen(false);
        };
        sync(mql);
        mql.addEventListener("change", sync);
        return () => mql.removeEventListener("change", sync);
    }, []);

    return (
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />
            <Topbar
                title={title}
                collapsed={collapsed}
                onToggle={handleToggle}
            />
            <main
                className={[
                    "flex-1 mt-16 p-6 bg-gray-50 transition-[margin-left] duration-200 ease min-h-[calc(100vh-4rem)]",
                    "ml-64",
                    collapsed ? "ml-[4.5rem]" : "",
                    "max-md:ml-0",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <Outlet />
            </main>
        </div>
    );
}
