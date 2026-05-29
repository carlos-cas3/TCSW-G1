import { useState, useEffect } from "react";
import { getUser } from "../../../app/auth";
import { getVendorById } from "../../../features/vendors/services/vendor.service";

export default function Topbar({ collapsed, onToggle }) {
    const user = getUser();
    const shouldFetch = user?.roleId === 2 && !!user?.vendorId;
    const [vendorInfo, setVendorInfo] = useState(null);
    const [loading, setLoading] = useState(shouldFetch);

    useEffect(() => {
        if (!shouldFetch) return;

        let cancelled = false;

        (async () => {
            try {
                const res = await getVendorById(user.vendorId);
                if (!cancelled && res.data) {
                    setVendorInfo({
                        name: res.data.vendor_name,
                        logo: res.data.vendor_logo_url,
                    });
                }
            } catch {
                // silent fallback
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [shouldFetch, user.vendorId]);

    const displayName =
        vendorInfo?.name ||
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        "Usuario";

    const firstLetter =
        vendorInfo?.name?.[0] || user?.firstName?.[0] || displayName[0];

    const avatarUrl = vendorInfo?.logo || null;

    return (
        <header
            className={[
                "h-16 bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
                "flex items-center justify-between px-6",
                "fixed top-0 right-0 z-10",
                "transition-[left] duration-200 ease",
                "left-64",
                collapsed ? "left-[4.5rem]" : "",
                "max-md:left-0",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="flex items-center gap-3">
                <button
                    className="bg-none border-none p-1.5 cursor-pointer text-slate-500 rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-gray-100 hover:text-slate-900"
                    onClick={onToggle}
                    aria-label="Toggle navigation menu"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-default transition-colors duration-200 hover:bg-gray-50">
                    <div
                        className={[
                            "w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-200 hover:scale-105",
                            loading
                                ? "bg-gray-200 animate-[topbar-pulse_1.5s_ease-in-out_infinite]"
                                : "bg-gradient-to-br from-blue-500 to-purple-500",
                        ].join(" ")}
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={displayName}
                                className="w-full h-full object-cover block"
                            />
                        ) : (
                            <span className="text-white text-sm font-semibold leading-none">
                                {firstLetter}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-slate-900">
                            {displayName}
                        </span>
                        {user?.email && (
                            <span className="text-[0.7rem] text-slate-400">
                                {user.email}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
