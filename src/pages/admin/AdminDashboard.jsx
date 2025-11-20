import { Link } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import './AdminDashboard.css';

function AdminDashboard() {
    const user = getUser();

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Panel de Administración</h1>
                <p className="welcome-message">Bienvenido, {user.nombre}</p>
            </div>

            <div className="admin-cards">
                <Link to="/admin/users" className="admin-card">
                    <div className="card-icon">👥</div>
                    <h2>Gestión de Usuarios</h2>
                    <p>Administrar usuarios del sistema</p>
                    <ul className="card-features">
                        <li>Ver todos los usuarios</li>
                        <li>Crear nuevos usuarios</li>
                        <li>Editar información</li>
                        <li>Eliminar usuarios</li>
                    </ul>
                </Link>

                <Link to="/admin/products" className="admin-card">
                    <div className="card-icon">🌸</div>
                    <h2>Gestión de Productos</h2>
                    <p>Administrar catálogo de productos</p>
                    <ul className="card-features">
                        <li>Ver todos los productos</li>
                        <li>Agregar nuevos productos</li>
                        <li>Actualizar precios y stock</li>
                        <li>Eliminar productos</li>
                    </ul>
                </Link>

                <Link to="/admin/orders" className="admin-card">
                    <div className="card-icon">📦</div>
                    <h2>Gestión de Pedidos</h2>
                    <p>Administrar pedidos y pagos</p>
                    <ul className="card-features">
                        <li>Ver todos los pedidos</li>
                        <li>Actualizar estado de pagos</li>
                        <li>Registrar referencias</li>
                        <li>Consultar detalles</li>
                    </ul>
                </Link>
            </div>

            <div className="admin-info">
                <div className="info-box">
                    <h3>ℹ️ Información del Sistema</h3>
                    <p><strong>Versión:</strong> 1.0.0</p>
                    <p><strong>Rol actual:</strong> {user.role}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
