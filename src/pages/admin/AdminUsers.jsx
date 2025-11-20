import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, register, updateUser } from '../../services/authService';
import './AdminUsers.css';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        id_usuario: null,
        nombre: '',
        email: '',
        password: '',
        numeroTelefono: '',
        role: 'USER'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers(0, 50);
            setUsers(data);
            setError('');
        } catch (err) {
            setError('Error al cargar usuarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
            return;
        }

        try {
            await deleteUser(id);
            loadUsers();
        } catch (err) {
            setError('Error al eliminar usuario');
            console.error(err);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            email: user.email,
            password: '',
            numeroTelefono: user.numeroTelefono || '',
            role: user.role
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar que la contraseña tenga al menos 6 caracteres
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            if (editingUser) {
                // Actualizar usuario existente
                await updateUser(formData);
            } else {
                // Crear nuevo usuario
                await register(
                    formData.nombre,
                    formData.email,
                    formData.numeroTelefono,
                    formData.password,
                    formData.role
                );
            }

            resetForm();
            loadUsers();
        } catch (err) {
            setError(editingUser ? 'Error al actualizar usuario' : 'Error al crear usuario');
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({
            id_usuario: null,
            nombre: '',
            email: '',
            password: '',
            numeroTelefono: '',
            role: 'USER'
        });
        setEditingUser(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="loading">Cargando usuarios...</div>;
    }

    return (
        <div className="admin-users-container">
            <div className="admin-users-header">
                <h1>Gestión de Usuarios</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-new">
                    {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="user-form-container">
                    <h2>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h2>
                    <form onSubmit={handleSubmit} className="user-form">
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Teléfono:</label>
                            <input
                                type="tel"
                                value={formData.numeroTelefono}
                                onChange={(e) => setFormData({ ...formData, numeroTelefono: e.target.value })}
                                placeholder="3001234567"
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña:</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Rol:</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit">
                                {editingUser ? 'Actualizar' : 'Crear'}
                            </button>
                            <button type="button" onClick={resetForm} className="btn-cancel">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id_usuario}>
                            <td>{user.id_usuario}</td>
                            <td>{user.nombre}</td>
                            <td>{user.email}</td>
                            <td>{user.numeroTelefono || 'Sin teléfono'}</td>
                            <td>
                                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                            </td>
                            <td>
                                <button onClick={() => handleEdit(user)} className="btn-edit">
                                    ✏️ Editar
                                </button>
                                <button onClick={() => handleDelete(user.id_usuario)} className="btn-delete">
                                    🗑️ Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;
