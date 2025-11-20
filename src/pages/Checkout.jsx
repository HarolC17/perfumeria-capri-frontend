import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../services/cartService';
import { createOrder } from '../services/orderService';
import { getUserId } from '../utils/auth';
import { PLACEHOLDER_IMAGE_60, handleImageError } from '../utils/placeholderImage';
import './Checkout.css';

function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [direccionEnvio, setDireccionEnvio] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const usuarioId = getUserId();
            const data = await getCart(usuarioId);

            if (!data || !data.items || data.items.length === 0) {
                navigate('/cart');
                return;
            }

            setCart(data);
            setError('');
        } catch (err) {
            setError('Error al cargar el carrito');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!direccionEnvio.trim()) {
            setError('La dirección de envío es obligatoria');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            const usuarioId = getUserId();
            const pedido = await createOrder(usuarioId, direccionEnvio);

            alert(`¡Pedido creado exitosamente! ID: ${pedido.id}`);
            navigate('/orders');
        } catch (err) {
            setError('Error al crear el pedido');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="checkout-container">
            <h1>Finalizar Pedido</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="checkout-content">
                <div className="checkout-form">
                    <h2>Información de Envío</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Dirección de Envío *</label>
                            <textarea
                                value={direccionEnvio}
                                onChange={(e) => setDireccionEnvio(e.target.value)}
                                placeholder="Calle, número, ciudad, código postal..."
                                rows="4"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-submit-order"
                        >
                            {submitting ? 'Procesando...' : 'Confirmar Pedido'}
                        </button>
                    </form>
                </div>

                <div className="checkout-summary">
                    <h2>Resumen del Pedido</h2>

                    <div className="summary-items">
                        {cart && cart.items && cart.items.map((item) => (
                            <div key={item.productoId} className="summary-item">
                                <div className="summary-item-info">
                                    <img
                                        src={item.imagenUrl || PLACEHOLDER_IMAGE_60}
                                        alt={item.nombreProducto}
                                        className="summary-item-image"
                                        onError={(e) => handleImageError(e, PLACEHOLDER_IMAGE_60)}
                                    />
                                    <div>
                                        <span className="summary-item-name">{item.nombreProducto}</span>
                                        <span className="summary-item-quantity">x{item.cantidad}</span>
                                    </div>
                                </div>
                                <span className="summary-item-price">${item.subtotal.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-total">
                        <span>Total:</span>
                        <span className="total-amount">
                            ${cart ? cart.precioTotal.toFixed(2) : '0.00'}
                        </span>
                    </div>

                    <div className="payment-info">
                        <p><strong>Tipo de pago:</strong> Efectivo</p>
                        <p className="info-note">
                            El pago se realizará contra entrega del pedido.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;

