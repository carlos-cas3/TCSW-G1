import { useNavigate } from "react-router-dom";

import SidebarItem from "./SidebarItem";
import menuConfig from "./menuConfig";
import "./Sidebar.css";

import LogoutIcon from "../../assets/logout-icon.svg?react";

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">A</div>
                <span className="sidebar-brand">AdminPanel</span>
            </div>

            <nav className="sidebar-nav">
                {menuConfig.map((item) => (
                    <SidebarItem
                        key={item.path}
                        path={item.path}
                        label={item.label}
                        icon={item.icon}
                    />
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={handleLogout}>
                    <LogoutIcon className="sidebar-item-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
