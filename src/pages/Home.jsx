import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();

            // ✅ CORREGIDO: Mezclar 'data' en lugar de 'products'
            const shuffled = [...data]; // Usar 'data' que tiene los productos
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            // ✅ Mostrar solo los primeros 9 productos aleatorios
            setProducts(shuffled.slice(0, 9));
            setError('');
        } catch (err) {
            setError('Error al cargar los productos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Cargando productos...</div>;
    }

    return (
        <div className="home-container">
            {/* Hero Banner */}
            <section className="hero-banner">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1 className="hero-title">PERFUMERÍA CAPRI</h1>
                        <p className="hero-subtitle">Descubre tu fragancia perfecta</p>
                        <p className="hero-description">
                            Fragancias exclusivas que cuentan tu historia
                        </p>
                        <button
                            className="hero-button"
                            onClick={() => navigate('/catalogo')}
                        >
                            Ver Catálogo Completo
                        </button>
                    </div>
                </div>
            </section>

            {/* Barra de Beneficios */}
            <section className="benefits-bar">
                <div className="benefit-item">
                    <span className="benefit-icon">🚚</span>
                    <span className="benefit-text">Envío Gratis</span>
                </div>
                <div className="benefit-item">
                    <span className="benefit-icon">💯</span>
                    <span className="benefit-text">100% Originales</span>
                </div>
                <div className="benefit-item">
                    <span className="benefit-icon">🔒</span>
                    <span className="benefit-text">Compra Segura</span>
                </div>
                <div className="benefit-item">
                    <span className="benefit-icon">💳</span>
                    <span className="benefit-text">Pago Contra Entrega</span>
                </div>
            </section>

            {/* Sección de Destacados */}
            <section id="productos-destacados" className="featured-section">
                <h2 className="section-title">PRODUCTOS DESTACADOS</h2>
                <div className="section-divider"></div>

                {error && <div className="error-message">{error}</div>}

                {products.length === 0 ? (
                    <div className="no-products">
                        <p>No hay productos disponibles en este momento</p>
                    </div>
                ) : (
                    <>
                        <div className="products-grid">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                />
                            ))}
                        </div>

                        {/* Botón para ver todos */}
                        <div className="view-all-container">
                            <button
                                className="view-all-button"
                                onClick={() => navigate('/catalogo')}
                            >
                                Ver Todos los Productos
                            </button>
                        </div>
                    </>
                )}
            </section>

            {/* Sección de Marcas */}
            <section className="categories-section">
                <h2 className="section-title">EXPLORA POR MARCA</h2>
                <div className="section-divider"></div>

                <div className="categories-grid">
                    <div
                        className="category-card brand-dior"
                        onClick={() => navigate('/catalogo?marca=Dior')}
                    >
                        <div className="category-image">
                            <div className="category-overlay">
                                <h3>Dior</h3>
                                <button className="category-button">Ver Más</button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="category-card brand-versace"
                        onClick={() => navigate('/catalogo?marca=Versace')}
                    >
                        <div className="category-image">
                            <div className="category-overlay">
                                <h3>Versace</h3>
                                <button className="category-button">Ver Más</button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="category-card brand-armani"
                        onClick={() => navigate('/catalogo?marca=Giorgio Armani')}
                    >
                        <div className="category-image">
                            <div className="category-overlay">
                                <h3>Armani</h3>
                                <button className="category-button">Ver Más</button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="category-card brand-streamers"
                        onClick={() => navigate('/catalogo?marca=Streamers')}
                    >
                        <div className="category-image">
                            <div className="category-overlay">
                                <h3>Streamers</h3>
                                <button className="category-button">Ver Más</button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="category-card brand-valentino"
                        onClick={() => navigate('/catalogo?marca=Valentino')}
                    >
                        <div className="category-image">
                            <div className="category-overlay">
                                <h3>Valentino</h3>
                                <button className="category-button">Ver Más</button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="category-card brand-paco"
                        onClick={() => navigate('/catalogo?marca=Paco Rabanne')}
                    >
                        <div className="category-image">
                            <div className="category-overlay">
                                <h3>Paco Rabanne</h3>
                                <button className="category-button">Ver Más</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Info */}
            <section className="info-section">
                <div className="info-grid">
                    <div className="info-card">
                        <h3>¿Por qué elegirnos?</h3>
                        <p>Más de 10 años de experiencia en perfumería de lujo. Garantizamos la autenticidad de cada fragancia.</p>
                    </div>
                    <div className="info-card">
                        <h3>Envíos a Todo el País</h3>
                        <p>Recibe tus fragancias favoritas donde quieras. Envíos rápidos y seguros.</p>
                    </div>
                    <div className="info-card">
                        <h3>Asesoría Personalizada</h3>
                        <p>¿No sabes cuál elegir? Nuestro equipo te ayudará a encontrar tu fragancia perfecta.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
