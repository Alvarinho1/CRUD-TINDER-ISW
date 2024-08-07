import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const storedUser = JSON.parse(sessionStorage.getItem('usuario'));

    if (!storedUser) {
        return <Navigate to="/" />;
    }

    const userRole = storedUser.roles[0].name;
    const isAuthenticated = !!storedUser;
    const isAuthorized = allowedRoles ? allowedRoles.includes(userRole) : true;

    // Redirigir a "Ranking" si el usuario es admin y está intentando acceder a "Home"
    if (userRole === 'admin' && window.location.pathname === '/home') {
        return <Navigate to="/users" />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (!isAuthorized) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
