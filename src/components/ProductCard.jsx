import { PLACEHOLDER_IMAGE_100 } from '../utils/placeholderImage';
import './ProductCard.css';

function ProductCard({ product, onClick }) {
    const hasDiscount = product.precioAnterior && product.precioAnterior > product.precio;

    return (
        <div className="product-card" onClick={onClick}>
            <div className="product-image-container">
                <img
                    src={product.imagenUrl || PLACEHOLDER_IMAGE_100}
                    alt={product.nombre}
                    className="product-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMAGE_100;
                    }}
                />
                {product.stock < 5 && product.stock > 0 && (
                    <span className="badge badge-stock">Últimas unidades</span>
                )}
                {product.stock === 0 && (
                    <span className="badge badge-out">Agotado</span>
                )}
            </div>

            <div className="product-info">
                <p className="product-brand">{product.marca || 'CAPRI'}</p>
                <h3 className="product-name">{product.nombre}</h3>

                <div className="product-pricing">
                    {hasDiscount && (
                        <span className="price-old">${product.precioAnterior.toFixed(2)}</span>
                    )}
                    <span className="price-current">${product.precio.toFixed(2)}</span>
                </div>

                <button className="product-button">
                    Ver Detalles
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
