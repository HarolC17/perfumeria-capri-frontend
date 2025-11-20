import { useState } from 'react';
import { getOrderById, getUserOrders, updatePaymentStatus, registerPaymentReference } from '../../services/orderService';
import './AdminOrders.css';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchType, setSearchType] = useState('pedido');
    const [searchId, setSearchId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [formData, setFormData] = useState({
        estadoPago: '',
        referenciaEnvio: ''
    });

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchId.trim()) {
            setError('Por favor ingresa un ID');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let data;

            if (searchType === 'pedido') {
                data = await getOrderById(parseInt(searchId));
                setOrders(data ? [data] : []);
            } else {
                data = await getUserOrders(parseInt(searchId));

                if (Array.isArray(data)) {
                    setOrders(data);
                } else if (data && typeof data === 'object' && data.mensaje) {
                    setOrders([]);
                    setError(`No se encontraron pedidos para el usuario ID: ${searchId}`);
                } else {
                    setOrders([]);
                }
            }
        } catch (err) {
            console.error('❌ Error en búsqueda:', err);
            if (searchType === 'pedido') {
                setError('No se encontró el pedido con ese ID');
            } else {
                setError('No se encontraron pedidos para ese usuario');
            }
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrder = async () => {
        try {
            const pagoId = selectedOrder.idPago || selectedOrder.id_pago || selectedOrder.pagoId;

            if (!pagoId) {
                setError('Este pedido no tiene un pago asociado');
                return;
            }

            // Validar que haya algo que actualizar
            if (!formData.estadoPago && !formData.referenciaEnvio.trim()) {
                setError('Debes seleccionar un estado de pago o ingresar una guía de envío');
                return;
            }

            // Actualizar el estado del pago (RECHAZADO o APROBADO)
            if (formData.estadoPago) {
                await updatePaymentStatus(pagoId, formData.estadoPago);
            }

            // Registrar guía de envío
            if (formData.referenciaEnvio.trim()) {
                await registerPaymentReference(pagoId, formData.referenciaEnvio);
            }

            setShowModal(false);
            setFormData({ estadoPago: '', referenciaEnvio: '' });
            setSelectedOrder(null);
            setError('');

            // Recargar búsqueda
            if (searchId) {
                handleSearch({ preventDefault: () => {} });
            }
        } catch (err) {
            setError('Error al actualizar el pedido');
            console.error('❌ Error:', err);
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setFormData({
            estadoPago: order.estadoPago || '',
            referenciaEnvio: order.referenciaPago || ''
        });
        setShowModal(true);
    };

    const clearSearch = () => {
        setSearchId('');
        setOrders([]);
        setError('');
    };

    if (loading) {
        return <div className="loading">Buscando...</div>;
    }

    return (
        <div className="admin-orders-container">
            <h1>Gestión de Pedidos</h1>

            <div className="search-section">
                <div className="search-type-selector">
                    <label>
                        <input
                            type="radio"
                            value="pedido"
                            checked={searchType === 'pedido'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        Buscar por ID de Pedido
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="usuario"
                            checked={searchType === 'usuario'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        Buscar por ID de Usuario
                    </label>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="number"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder={searchType === 'pedido' ? 'ID del pedido' : 'ID del usuario'}
                        className="search-input"
                    />
                    <button type="submit" className="btn-search">
                        🔍 Buscar
                    </button>
                    {searchId && (
                        <button type="button" onClick={clearSearch} className="btn-clear">
                            ✖️ Limpiar
                        </button>
                    )}
                </form>
            </div>

            {error && <div className="error-message">{error}</div>}

            {orders.length === 0 && !error && searchId && (
                <div className="no-results">
                    No se encontraron resultados
                </div>
            )}

            {orders.length > 0 && (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <h3>Pedido #{order.id}</h3>
                                    <p className="order-info">Usuario ID: {order.usuarioId}</p>
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
                                <p>
                                    <strong>Estado de pago:</strong>
                                    {order.estadoPago ? (
                                        <span className={`payment-status status-${order.estadoPago.toLowerCase()}`}>
                      {order.estadoPago}
                    </span>
                                    ) : (
                                        <span className="payment-status status-pendiente">PENDIENTE</span>
                                    )}
                                </p>
                                {order.referenciaPago && (
                                    <p><strong>Guía de envío:</strong> {order.referenciaPago}</p>
                                )}
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

                            <div className="order-actions">
                                <button onClick={() => openModal(order)} className="btn-manage-order">
                                    📦 Gestionar Pedido
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Gestionar Pedido #{selectedOrder.id}</h2>
                        <p className="modal-info">Tipo de pago: {selectedOrder.tipoPago}</p>

                        <div className="form-group">
                            <label>Estado del Pago:</label>
                            <select
                                value={formData.estadoPago}
                                onChange={(e) => setFormData({ ...formData, estadoPago: e.target.value })}
                            >
                                <option value="">No cambiar</option>
                                <option value="APROBADO">CONFIRMADO</option>
                                <option value="RECHAZADO">RECHAZADO</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Guía de Envío:</label>
                            <input
                                type="text"
                                value={formData.referenciaEnvio}
                                onChange={(e) => setFormData({ ...formData, referenciaEnvio: e.target.value })}
                                placeholder="Ej: GUIA123456"
                            />
                            <small className="field-help">Al ingresar la guía, el pedido pasará a ENVIADO</small>
                        </div>

                        <div className="info-box">
                            <p><strong>ℹ️ Flujo:</strong></p>
                            <ul>
                                <li><strong>RECHAZADO:</strong> Cancela el pedido y devuelve el stock</li>
                                <li><strong>CONFIRMADO:</strong> Confirma el pago</li>
                                <li><strong>Guía de envío:</strong> Marca el pedido como ENVIADO</li>
                            </ul>
                        </div>

                        <div className="modal-actions">
                            <button onClick={handleUpdateOrder} className="btn-submit">
                                Actualizar
                            </button>
                            <button onClick={() => setShowModal(false)} className="btn-cancel">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
