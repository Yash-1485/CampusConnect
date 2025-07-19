// components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ProtectedRoute = ({ isAuthenticated, children }) => {
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated && location.pathname=='/login') {
            toast.error("Please login to access this page", {
                toastId: "auth-error", // 👈 ensures it's not shown multiple times
            });
        }
    }, [isAuthenticated, location]);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
