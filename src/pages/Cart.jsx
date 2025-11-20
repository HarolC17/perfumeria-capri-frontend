import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, clearCart } from '../services/cartService';
import { getUserId } from '../utils/auth';
import { PLACEHOLDER_IMAGE_100, handleImageError } from '../utils/placeholderImage';
import './Cart.css';

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const usuarioId = getUserId();
            const data = await getCart(usuarioId);
            setCart(data);
            setError('');
        } catch (err) {
            setError('Error al cargar el carrito');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (productoId) => {
        if (!window.confirm('¿Eliminar este producto del carrito?')) {
            return;
        }

        try {
            const usuarioId = getUserId();
            const updatedCart = await removeFromCart(usuarioId, productoId);
            setCart(updatedCart);
        } catch (err) {
            setError('Error al eliminar el producto');
            console.error(err);
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('¿Vaciar todo el carrito?')) {
            return;
        }

        try {
            const usuarioId = getUserId();
            await clearCart(usuarioId);
            setCart({ ...cart, items: [], precioTotal: 0 });
        } catch (err) {
            setError('Error al vaciar el carrito');
            console.error(err);
        }
    };

    const handleCheckout = () => {
        if (cart && cart.items && cart.items.length > 0) {
            navigate('/checkout');
        }
    };

    if (loading) {
        return <div className="loading">Cargando carrito...</div>;
    }

    const isEmpty = !cart || !cart.items || cart.items.length === 0;

    return (
        <div className="cart-container">
            <h1>Mi Carrito</h1>

            {error && <div className="error-message">{error}</div>}

            {isEmpty ? (
                <div className="empty-cart">
                    <p>Tu carrito está vacío</p>
                    <button onClick={() => navigate('/')} className="btn-continue">
                        Ir al Catálogo
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.items.map((item) => (
                            <div key={item.productoId} className="cart-item">
                                <img
                                    src={item.imagenUrl || PLACEHOLDER_IMAGE_100}
                                    alt={item.nombreProducto}
                                    className="item-image"
                                    onError={(e) => handleImageError(e, PLACEHOLDER_IMAGE_100)}
                                />

                                <div className="item-info">
                                    <h3>{item.nombreProducto}</h3>
                                    <p className="item-price">${item.precioUnitario.toFixed(2)} c/u</p>
                                </div>

                                <div className="item-quantity">
                                    <span>Cantidad: {item.cantidad}</span>
                                </div>

                                <div className="item-subtotal">
                                    <span className="subtotal-label">Subtotal:</span>
                                    <span className="subtotal-price">${item.subtotal.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={() => handleRemoveItem(item.productoId)}
                                    className="btn-remove"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="summary-row">
                            <span>Total:</span>
                            <span className="total-price">${cart.precioTotal.toFixed(2)}</span>
                        </div>

                        <div className="cart-actions">
                            <button onClick={handleClearCart} className="btn-clear-cart">
                                Vaciar Carrito
                            </button>
                            <button onClick={handleCheckout} className="btn-checkout">
                                Proceder al Pago
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
