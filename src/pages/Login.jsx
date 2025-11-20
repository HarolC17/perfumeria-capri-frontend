import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { saveUser, isAdmin } from '../utils/auth';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (!email.trim() || !password.trim()) {
            setError('Por favor completa todos los campos');
            return;
        }

        setLoading(true);

        try {
            const response = await login(email, password);

            console.log('🔍 Respuesta del login:', response);

            // ✅ VALIDAR si el backend devuelve un mensaje de error (aunque sea status 200)
            if (response.mensaje) {
                const mensaje = response.mensaje.toLowerCase();
                if (mensaje.includes('no encontrado') ||
                    mensaje.includes('incorrecta') ||
                    mensaje.includes('invalida')) {
                    setError('Email o contraseña incorrectos');
                    setLoading(false);
                    return;
                }
            }

            // ✅ VALIDAR que la respuesta contenga los datos del usuario
            if (!response || !response.id_usuario || !response.email) {
                setError('Credenciales incorrectas');
                setLoading(false);
                return;
            }

            // Guardar usuario en localStorage
            saveUser(response);

            // Redirigir según el rol
            if (isAdmin()) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('❌ Error completo:', err);
            console.error('❌ Respuesta del servidor:', err.response);

            // Manejar diferentes tipos de errores
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 404) {
                    setError('Email o contraseña incorrectos');
                } else if (err.response.status === 500) {
                    setError('Error en el servidor. Intenta más tarde.');
                } else {
                    setError('Error al iniciar sesión. Verifica tus datos.');
                }
            } else if (err.request) {
                setError('No se pudo conectar con el servidor');
            } else {
                setError('Error inesperado. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Iniciar Sesión</h1>
                <p className="login-subtitle">Perfumería Capri</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Iniciando...' : 'Ingresar'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="link-register">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
