import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ( {children}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div>Cargando...</div>; // espera a que lea el localStorage
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
}

export { ProtectedRoute };