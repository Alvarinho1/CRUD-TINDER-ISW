import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from '../services/auth.service.js';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const storedUser = JSON.parse(sessionStorage.getItem('usuario'));
    const userRole = storedUser?.data?.rolName;

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <img
                        src="/logotinder.png"
                        alt="Logo tinder"
                    />
                </li>
                <li className={location.pathname === "/inicio" ? "active" : ""}>
                    <NavLink to="/home">Inicio</NavLink>
                </li>
                <li className={location.pathname === "/chat" ? "active" : ""}>
                    <NavLink to="/chat">Chat</NavLink>
                </li>
                {userRole === 'administrador' && (
                    <li className={location.pathname === "/usuarios" ? "active" : ""}>
                        <NavLink to="/users">Usuarios</NavLink>
                    </li>
                )}
                <li className={location.pathname === "/perfil" ? "active" : ""}>
                    <NavLink to="/profile">Perfil</NavLink>
                </li>
                <li className={location.pathname === "/" ? "active" : ""}>
                    <NavLink to="/" onClick={logoutSubmit}>Cerrar</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
