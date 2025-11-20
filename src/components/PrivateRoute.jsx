import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';

// Ruta protegida para usuarios autenticados
export const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Ruta protegida solo para admins
export const AdminRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (!isAdmin()) {
        return <Navigate to="/" />;
    }

    return children;
};
