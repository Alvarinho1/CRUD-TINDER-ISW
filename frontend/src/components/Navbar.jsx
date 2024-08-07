import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from '../services/auth.service.js';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const storedUser = JSON.parse(sessionStorage.getItem('usuario'));
    const userRole = storedUser.roles[0].name

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
                {userRole === 'user' && (
                <li className={location.pathname === "/inicio" ? "active" : ""}>
                    <NavLink to="/home">Inicio</NavLink>
                </li>
                )} 

                {userRole === 'admin' && (
                    <li className={location.pathname === "/users" ? "active" : ""}>
                        <NavLink to="/users">Usuarios</NavLink>
                    </li>
                )}  

                <li className={location.pathname === "/chat" ? "active" : ""}>
                    <NavLink to="/chat">Chat</NavLink>
                </li>

                <li className={location.pathname === "/edit-user/:rut" ? "active" : ""}>
                    <NavLink to="/edit-user/:rut">Perfil</NavLink>
                </li>
                {userRole === 'admin' && (
                    <li className={location.pathname === "/ranking" ? "active" : ""}>
                        <NavLink to="/ranking">Ranking</NavLink>
                    </li>              
                    
                )}
                    {userRole === 'admin' && (
                    <li className={location.pathname === "/likes" ? "active" : ""}>
                        <NavLink to="/likes">Ver Likes alumnos</NavLink>
                    </li>  
                )}   

                    {userRole === 'user' && (
                    <li className={location.pathname === "/likesdados" ? "active" : ""}>
                        <NavLink to="/likesdados">Likes Recibidos</NavLink>
                    </li>  
                )}  


                    {userRole === 'user' && (
                    <li className={location.pathname === "/matches" ? "active" : ""}>
                        <NavLink to="/matches">Matches</NavLink>
                    </li>  
                )}  





                <li className={location.pathname === "/" ? "active" : ""}>
                    <NavLink to="/" onClick={logoutSubmit}>Cerrar</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;