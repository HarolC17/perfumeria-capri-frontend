import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, isAdmin } from '../utils/auth';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const authenticated = isAuthenticated();
    const admin = isAdmin();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            {/* Barra superior con mensaje */}
            <div className="top-bar">
                <p>Envíos gratis en compras superiores a $250.000</p>
            </div>

            {/* Navbar principal */}
            <div className="navbar-main">
                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">✨</span>
                        <span className="logo-text">PERFUMERÍA CAPRI</span>
                    </Link>

                    {/* Menú de navegación */}
                    <ul className="navbar-menu">
                        <li>
                            <Link to="/" className="nav-link">Inicio</Link>
                        </li>
                        <li>
                            <Link to="/catalogo" className="nav-link">Catálogo</Link>
                        </li>
                        {authenticated && (
                            <li>
                                <Link to="/orders" className="nav-link">Mis Pedidos</Link>
                            </li>
                        )}
                        {admin && (
                            <li>
                                <Link to="/admin" className="nav-link">Administración</Link>
                            </li>
                        )}
                    </ul>


                    {/* Iconos de usuario y carrito */}
                    <div className="navbar-actions">
                        {authenticated ? (
                            <>
                                <Link to="/cart" className="nav-icon">
                                    <span className="icon">🛒</span>
                                    <span className="icon-text">Carrito</span>
                                </Link>
                                <button onClick={handleLogout} className="nav-icon nav-logout">
                                    <span className="icon">🚪</span>
                                    <span className="icon-text">Salir</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-button nav-button-outline">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/register" className="nav-button nav-button-solid">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
