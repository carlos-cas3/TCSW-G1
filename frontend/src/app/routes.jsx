import { Navigate } from "react-router-dom";
import Layout from "../layout/dashboard/Layout";
import AuthLayout from "../layout/auth/AuthLayout";
import LoginForm from "../features/auth/components/login/LoginForm";
import AdminVendorsPage from "../features/vendors/views/AdminVendorsPage";
import AdminVendorDetailPage from "../features/vendors/views/AdminVendorDetailPage";
import UserVendorPage from "../features/vendors/views/UserVendorPage";
import AdminBranchesPage from "../features/branches/views/AdminBranchesPage";
import UserBranchesPage from "../features/branches/views/UserBranchesPage";
import UserStaffPage from "../features/staff/views/UserStaffPage";
import ProtectedRoute from "./ProtectedRoute";

import AdminCatalogPage from "../features/catalog/views/AdminCatalogPage";
import VendorCatalogPage from "../features/catalog/views/VendorCatalogPage";


//routes Grupo 3
import OrderPage from "../features/orders/views/OrderPage";
import VendorOrdersPage from "../features/orders/views/VendorOrdersPage";
import VendorOrdersPortal from "../features/orders/views/VendorOrdersPortal";
import LogisticaPage from "../features/logistica/views/LogisticaPage";
import HistorialPage from "../features/historial/views/HistorialPage";
import NuevoReclamoPage from "../features/reclamos/views/NuevoReclamoPage";
import EvaluarReclamosPage from "../features/reclamos/views/EvaluarReclamosPage";
import HistorialReclamosPage from "../features/reclamos/views/HistorialReclamosPage";

import SuperAdminDashboard from "../features/analytics/views/SuperAdminDashboard";
import VendorAdminDashboard from "../features/analytics/views/VendorAdminDashboard";
import SuperAdminAnalytics from "../features/analytics/views/SuperAdminAnalytics";
import VendorAdminAnalytics from "../features/analytics/views/VendorAdminAnalytics";

import DataTablePlayground from "../shared/dev/DataTablePlayground";
import StatsCardsPlayground from "../shared/dev/StatsCardsPlayground";

const ROLES = {
    SUPER_ADMIN: 1,
    VENDOR_ADMIN: 2,
};

const devRoutes = import.meta.env.DEV
  ? [{ path: "/dev/table", element: <DataTablePlayground /> },
     { path: "/dev/cards", element: <StatsCardsPlayground /> }]
  : [];

const routes = [
  ...devRoutes,
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
            { path: "", element: <SuperAdminDashboard /> },
            { path: "vendors", element: <AdminVendorsPage /> },
            { path: "vendors/:vendor_id", element: <AdminVendorDetailPage /> },
            { path: "branches", element: <AdminBranchesPage /> },
            { path: "catalog", element: <AdminCatalogPage /> },
            { path: "analytics", element: <SuperAdminAnalytics /> },
            { path: "orders", element: <OrderPage /> },
            { path: "vendor-orders", element: <VendorOrdersPortal /> },
            { path: "reclamos", element: <HistorialReclamosPage /> },
            { path: "reclamos/nuevo", element: <NuevoReclamoPage /> },
        ],
    },
    // VENDOR_ADMIN
    {
        path: "/user",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.VENDOR_ADMIN]}>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { path: "", element: <VendorAdminDashboard /> },
            { path: "analytics", element: <VendorAdminAnalytics /> },
            { path: "catalog", element: <VendorCatalogPage /> },
            { path: "seller-management", element: <UserVendorPage /> },
            { path: "branches", element: <UserBranchesPage /> },
            { path: "staff", element: <UserStaffPage /> },
            //routes Grupo 3
            
            { path: "sub-orders", element: <VendorOrdersPage /> },
            { path: "logistica", element: <LogisticaPage /> },
            { path: "historial", element: <HistorialPage /> },
            { path: "reclamos", element: <EvaluarReclamosPage /> },
        ],
    },
    { path: "/unauthorized", element: <h1>No tienes permiso</h1> },
    { path: "*", element: <Navigate to="/login" replace /> },
];

export default routes;
