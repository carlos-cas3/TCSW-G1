import { NavLink } from "react-router-dom";
import { getMenuByRole } from "./menuConfig";
import { getUser, logout } from "../../../app/auth";
import LogoutIcon from "../../../assets/logout-icon.svg?react";

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
    const user = getUser();
    const menuItems = getMenuByRole(user?.roleId);

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                className={[
                    "fixed left-0 top-0 h-screen flex flex-col z-5 max-md:z-40 min-w-0",
                    "bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-gray-100",
                    "transition-all duration-200 ease overflow-hidden",
                    "w-64",
                    collapsed ? "w-[4.5rem]" : "",
                    "max-md:-translate-x-full",
                    mobileOpen ? "max-md:translate-x-0" : "",
                    "md:translate-x-0",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <div className="h-16 px-5 flex items-center gap-3 border-b border-white/[0.06] shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                        S
                    </div>
                    <span
                        className={[
                            "text-lg font-semibold whitespace-nowrap transition-opacity duration-200",
                            collapsed ? "opacity-0" : "opacity-100",
                        ].join(" ")}
                    >
                        SportMarket
                    </span>
                </div>

                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={
                                item.path === "/admin" || item.path === "/user"
                            }
                            className={({ isActive }) =>
                                [
                                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg",
                                    "text-slate-400 no-underline transition-colors duration-150",
                                    "hover:bg-white/[0.06] hover:text-gray-50",
                                    isActive
                                        ? "bg-blue-500/[0.12] text-blue-400"
                                        : "",
                                    "relative whitespace-nowrap",
                                ].join(" ")
                            }
                            onClick={mobileOpen ? onClose : undefined}
                        >
                            <item.icon className="w-5 h-5 shrink-0 text-current" />
                            <span
                                className={[
                                    "text-sm font-medium transition-opacity duration-150",
                                    collapsed ? "opacity-0" : "opacity-100",
                                ].join(" ")}
                            >
                                {item.label}
                            </span>
                            {collapsed && (
                                <span className="absolute left-[calc(100%+0.75rem)] top-1/2 -translate-y-1/2 -translate-x-1 bg-slate-700 text-gray-100 px-3 py-1.5 rounded-md text-xs whitespace-nowrap opacity-0 pointer-events-none transition-all duration-150 ease shadow-lg z-50 group-hover:opacity-100 group-hover:translate-x-0 max-md:hidden">
                                    {item.label}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-white/[0.06] shrink-0">
                    <button
                        className="group flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-400 bg-none border-none cursor-pointer text-sm font-medium transition-colors duration-150 hover:bg-white/[0.06] hover:text-red-400 relative whitespace-nowrap"
                        onClick={logout}
                    >
                        <LogoutIcon className="w-5 h-5 shrink-0 text-current" />
                        <span
                            className={[
                                "transition-opacity duration-150",
                                collapsed ? "opacity-0" : "opacity-100",
                            ].join(" ")}
                        >
                            Cerrar sesión
                        </span>
                        {collapsed && (
                            <span className="absolute left-[calc(100%+0.75rem)] top-1/2 -translate-y-1/2 -translate-x-1 bg-slate-700 text-gray-100 px-3 py-1.5 rounded-md text-xs whitespace-nowrap opacity-0 pointer-events-none transition-all duration-150 ease shadow-lg z-50 group-hover:opacity-100 group-hover:translate-x-0 max-md:hidden">
                                Cerrar sesión
                            </span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
