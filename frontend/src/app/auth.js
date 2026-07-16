const TOKEN_KEY = "tcsw_token";
const USER_KEY = "tcsw_user";

// --- Mock desactivado — usamos el auth-service real ---
const MOCK_MODE = false;
if (localStorage.getItem("mock_role")) localStorage.removeItem("mock_role");

const SUPER_ADMIN_MOCK = {
    id: 1,
    email: "mike@gmail.com",
    nombre: "Super Admin",
    role: { roleName: "SUPER_ADMIN" },
    roleId: 1,
};

const VENDOR_ADMIN_MOCK = {
    id: 2,
    vendorId: 63,
    email: "g1@gmail.com",
    nombre: "Admin Vendor",
    role: { roleName: "VENDOR_ADMIN" },
    roleId: 2,
};

const getMockUser = () => {
    const stored = localStorage.getItem("mock_role");
    return stored === "vendor" ? VENDOR_ADMIN_MOCK : SUPER_ADMIN_MOCK;
};

export const setMockRole = (role) => {
    localStorage.setItem("mock_role", role);
    window.location.href = role === "vendor" ? "/user" : "/admin";
};

export const getMockRole = () => {
    return localStorage.getItem("mock_role") || "admin";
};
// --- fin mock ---

export const getUser = () => {
    if (MOCK_MODE) return getMockUser();
    const user = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    const parsed = user ? JSON.parse(user) : null;
    if (parsed && !parsed.id && parsed.userId) {
        parsed.id = parsed.userId;
    }
    return parsed;
};

export const getToken = () => {
    if (MOCK_MODE) return "mock-token";
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    if (MOCK_MODE) return true;
    return !!getToken();
};

export const logout = () => {
    if (MOCK_MODE) {
        localStorage.removeItem("mock_role");
        window.location.href = "/login";
        return;
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.location.href = "/login";
};