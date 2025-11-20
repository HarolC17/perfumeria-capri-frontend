import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService';
import { isAuthenticated, getUserId } from '../utils/auth';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await getProductById(id);
            setProduct(data);
            setError('');
        } catch (err) {
            setError('Error al cargar el producto');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        if (cantidad > product.stock) {
            setError('Cantidad solicitada no disponible en stock');
            return;
        }

        try {
            setAddingToCart(true);
            setError('');
            const usuarioId = getUserId();
            await addToCart(usuarioId, product.id, cantidad);
            setSuccessMessage('¡Producto agregado al carrito!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Error al agregar al carrito');
            console.error(err);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return <div className="loading">Cargando producto...</div>;
    }

    if (!product) {
        return <div className="error-page">Producto no encontrado</div>;
    }

    return (
        <div className="product-detail-container">
            <button onClick={() => navigate(-1)} className="btn-back">
                ← Volver
            </button>

            <div className="product-detail">
                <div className="product-detail-image">
                    {product.imagenUrl ? (
                        <img
                            src={product.imagenUrl}
                            alt={product.nombre}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                        />
                    ) : (
                        <span className="detail-icon">🌸</span>
                    )}
                </div>

                <div className="product-detail-info">
                    <h1>{product.nombre}</h1>

                    <div className="product-meta">
            <span className="meta-item">
              <strong>Marca:</strong> {product.marca}
            </span>
                        <span className="meta-item">
              <strong>Tipo:</strong> {product.tipo}
            </span>
                        <span className="meta-item">
              <strong>Stock:</strong> {product.stock} unidades
            </span>
                    </div>

                    <div className="product-price-section">
                        <span className="detail-price">${product.precio.toFixed(2)}</span>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    {product.stock > 0 ? (
                        <div className="add-to-cart-section">
                            <div className="quantity-selector">
                                <label>Cantidad:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={cantidad}
                                    onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                                />
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className="btn-add-to-cart"
                            >
                                {addingToCart ? 'Agregando...' : '🛒 Agregar al Carrito'}
                            </button>
                        </div>
                    ) : (
                        <div className="out-of-stock">
                            ❌ Producto sin stock
                        </div>
                    )}

                    <div className="product-description">
                        <h3>Descripción</h3>
                        <p>
                            Perfume {product.nombre} de la marca {product.marca}.
                            Fragancia tipo {product.tipo} de alta calidad.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
