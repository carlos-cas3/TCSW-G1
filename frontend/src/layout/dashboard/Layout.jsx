import { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
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
