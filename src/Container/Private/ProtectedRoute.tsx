import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
    const authToken = localStorage.getItem('token');

    if (!authToken) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}