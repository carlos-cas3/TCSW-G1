import { NavLink } from "react-router-dom";

export default function SidebarItem({ path, label, icon: Icon }) {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
            }
        >
            <Icon className="sidebar-item-icon" />
            <span>{label}</span>
        </NavLink>
    );
}
