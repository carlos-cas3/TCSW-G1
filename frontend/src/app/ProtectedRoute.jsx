 import { Navigate } from "react-router-dom";
 import { getUser, isAuthenticated } from "./auth";

export default function ProtectedRoute({ children, allowedRoles }) {

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const user = getUser();

    if (allowedRoles && !allowedRoles.includes(user?.roleId)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
