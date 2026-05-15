import { Navigate } from "react-router-dom";
import Layout from "../layout/dashboard/Layout";
import AuthLayout from "../layout/auth/AuthLayout";
import LoginForm from "../features/auth/components/login/LoginForm";
import Vendors from "../features/vendors/Vendors";
import ProtectedRoute from "./ProtectedRoute";

const ROLES = {
    SUPER_ADMIN: 1,
    VENDOR_ADMIN: 2,
};

const routes = [
    {
        element: <AuthLayout />,
        children: [{ path: "/login", element: <LoginForm /> }],
    },
    // SUPER_ADMIN
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { path: "", element: <h1>Admin Dashboard</h1> },
            { path: "vendors", element: <Vendors /> },
            { path: "branches", element: <h1>Branches</h1> },
            { path: "catalog", element: <h1>Catalog</h1> },
            { path: "analytics", element: <h1>Analytics</h1> },
        ],
    },
    // VENDOR_ADMIN
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.VENDOR_ADMIN]}>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { path: "", element: <h1>Vendor Dashboard</h1> },
            { path: "catalog", element: <h1>Catalog</h1> },
        ],
    },
    { path: "/unauthorized", element: <h1>No tienes permiso</h1> },
    { path: "*", element: <Navigate to="/login" replace /> },
];

export default routes;
