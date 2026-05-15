import { NavLink, useNavigate } from "react-router-dom";
import { getMenuByRole } from "./menuConfig";
import { getUser, logout } from "../../../app/auth";
import "./Sidebar.css";
import LogoutIcon from "../../../assets/logout-icon.svg?react";

export default function Sidebar() {
    const user = getUser();
    const menuItems = getMenuByRole(user?.roleId);

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">A</div>
                <span className="sidebar-brand">AdminPanel</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={
                            item.path === "/admin" || item.path === "/dashboard"
                        }
                        className={({ isActive }) =>
                            isActive ? "sidebar-item active" : "sidebar-item"
                        }
                    >
                        <item.icon className="sidebar-item-icon" />
                        <span className="sidebar-item-text">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={logout}>
                    <LogoutIcon className="sidebar-item-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
