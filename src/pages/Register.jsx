import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { saveUser } from '../utils/auth';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        numeroTelefono: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (!formData.nombre.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        if (!formData.email.trim()) {
            setError('El email es obligatorio');
            return;
        }

        if (!formData.numeroTelefono.trim()) {
            setError('El teléfono es obligatorio');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);

            // Registrar usuario (siempre con rol USER)
            const response = await register(
                formData.nombre,
                formData.email,
                formData.numeroTelefono,
                formData.password,
                'USER'
            );

            // Guardar usuario en localStorage y redirigir
            saveUser(response);
            navigate('/');

        } catch (err) {
            if (err.response?.status === 409) {
                setError('Este email ya está registrado');
            } else {
                setError('Error al registrar usuario. Intenta de nuevo.');
            }
            console.error('Error al registrar:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>Crear Cuenta</h1>
                <p className="register-subtitle">Perfumería Capri</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre completo:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Juan Pérez"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Teléfono:</label>
                        <input
                            type="tel"
                            name="numeroTelefono"  // ✅ CAMBIAR AQUÍ
                            value={formData.numeroTelefono}  // ✅ Y AQUÍ
                            onChange={handleChange}
                            placeholder="3001234567"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmar contraseña:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repite tu contraseña"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Registrando...' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className="register-footer">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="link-login">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
