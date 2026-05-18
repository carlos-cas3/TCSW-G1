import { Navigate } from "react-router-dom";
import { getUser, isAuthenticated } from "./auth";

export default function ProtectedRoute({ children, allowedRoles }) {
    console.log('isAuthenticated:', isAuthenticated());
    console.log('user:', getUser());
    console.log('allowedRoles:', allowedRoles);

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const user = getUser();
    console.log('user.roleId:', user?.roleId);
    console.log('includes:', allowedRoles?.includes(user?.roleId));

    if (allowedRoles && !allowedRoles.includes(user?.roleId)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}