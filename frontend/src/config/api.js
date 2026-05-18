export const API = {
    AUTH: import.meta.env.VITE_AUTH_URL || "http://localhost:3000/api",
    VENDORS: import.meta.env.VITE_VENDOR_URL || "http://localhost:3001/api",
    BRANCHES: import.meta.env.VITE_BRANCH_URL || "http://localhost:3002/api",
};