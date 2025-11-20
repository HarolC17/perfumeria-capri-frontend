import { useState, useEffect } from 'react';
import { getUserOrders } from '../services/orderService';
import { getUserId } from '../utils/auth';
import './Orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const usuarioId = getUserId();
            const data = await getUserOrders(usuarioId);

            let orderArray = [];

            // Si es un array directamente
            if (Array.isArray(data)) {
                orderArray = data;
            }
            // Si es un objeto
            else if (data && typeof data === 'object') {
                // Si tiene mensaje de "no encontrados", es un array vacío
                if (data.mensaje && data.mensaje.toLowerCase().includes('no se encontraron')) {
                    orderArray = [];
                }
                // Intentar extraer de propiedades comunes
                else if (Array.isArray(data.content)) {
                    orderArray = data.content;
                } else if (Array.isArray(data.data)) {
                    orderArray = data.data;
                } else {
                    console.warn('⚠️ Estructura desconocida:', data);
                    orderArray = [];
                }
            }

            setOrders(orderArray);
            setError('');
        } catch (err) {
            setError('Error al cargar los pedidos');
            setOrders([]);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div className="loading">Cargando pedidos...</div>;
    }

    // Asegurar que orders sea siempre un array
    const ordersList = Array.isArray(orders) ? orders : [];

    return (
        <div className="orders-container">
            <h1>Mis Pedidos</h1>

            {error && <div className="error-message">{error}</div>}

            {ordersList.length === 0 ? (
                <div className="no-orders">
                    <p>No tienes pedidos todavía</p>
                </div>
            ) : (
                <div className="orders-list">
                    {ordersList.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <h3>Pedido #{order.id}</h3>
                                    <p className="order-date">
                                        {new Date(order.fechaPedido).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="order-status">
                  <span className={`status-badge status-${order.estado.toLowerCase()}`}>
                    {order.estado}
                  </span>
                                </div>
                            </div>

                            <div className="order-details">
                                <p><strong>Dirección:</strong> {order.direccionEnvio}</p>
                                <p><strong>Tipo de pago:</strong> {order.tipoPago}</p>
                            </div>

                            <div className="order-items">
                                <h4>Productos:</h4>
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span>{item.nombreProducto}</span>
                                        <span>x{item.cantidad}</span>
                                        <span>${item.subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-total">
                                <span>Total:</span>
                                <span className="total-price">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;
