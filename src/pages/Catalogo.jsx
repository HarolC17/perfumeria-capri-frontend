import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import './Catalogo.css';

function Catalogo() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');
    const [sortBy, setSortBy] = useState('nombre');

    // ✅ PAGINACIÓN
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(9); // 12 productos por página

    // Obtener tipos y marcas únicos
    const [types, setTypes] = useState([]);
    const [marcas, setMarcas] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const marcaFromUrl = searchParams.get('marca');
        if (marcaFromUrl) {
            setSelectedMarca(marcaFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        applyFilters();
        setCurrentPage(1); // ✅ Resetear a página 1 cuando cambien filtros
    }, [products, searchTerm, selectedType, selectedMarca, sortBy]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();

            setProducts(data);

            const uniqueTypes = [...new Set(data.map(p => p.tipo).filter(Boolean))];
            setTypes(uniqueTypes);

            const uniqueMarcas = [...new Set(data.map(p => p.marca).filter(Boolean))];
            setMarcas(uniqueMarcas);

            setError('');
        } catch (err) {
            setError('Error al cargar los productos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.marca && product.marca.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedType) {
            filtered = filtered.filter(product => product.tipo === selectedType);
        }

        if (selectedMarca) {
            filtered = filtered.filter(product => product.marca === selectedMarca);
        }

        switch (sortBy) {
            case 'precio-asc':
                filtered.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-desc':
                filtered.sort((a, b) => b.precio - a.precio);
                break;
            case 'nombre':
            default:
                filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
        }

        setFilteredProducts(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('');
        setSelectedMarca('');
        setSortBy('nombre');
        setCurrentPage(1);
        navigate('/catalogo');
    };

    // ✅ LÓGICA DE PAGINACIÓN
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Scroll al tope
    };

    if (loading) {
        return <div className="loading">Cargando catálogo...</div>;
    }

    return (
        <div className="catalogo-container">
            <div className="catalogo-header">
                <h1>CATÁLOGO COMPLETO</h1>
                <p className="catalogo-subtitle">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} disponibles
                    {selectedMarca && ` - Marca: ${selectedMarca}`}
                </p>
            </div>

            {/* Filtros */}
            <div className="filters-section">
                <div className="filters-container">
                    <div className="filter-group">
                        <label>Buscar</label>
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-group">
                        <label>Marca</label>
                        <select
                            value={selectedMarca}
                            onChange={(e) => setSelectedMarca(e.target.value)}
                            className="sort-select"
                        >
                            <option value="">Todas las marcas</option>
                            {marcas.map(marca => (
                                <option key={marca} value={marca}>{marca}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Categoría</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="sort-select"
                        >
                            <option value="">Todas las categorías</option>
                            {types.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Ordenar por</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="nombre">Nombre (A-Z)</option>
                            <option value="precio-asc">Precio (Menor a Mayor)</option>
                            <option value="precio-desc">Precio (Mayor a Menor)</option>
                        </select>
                    </div>

                    {(searchTerm || selectedType || selectedMarca || sortBy !== 'nombre') && (
                        <button onClick={clearFilters} className="clear-filters-button">
                            Limpiar Filtros
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Productos */}
            {filteredProducts.length === 0 ? (
                <div className="no-products">
                    <p>No se encontraron productos</p>
                    {(searchTerm || selectedType || selectedMarca) && (
                        <button onClick={clearFilters} className="reset-search-button">
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="products-grid">
                        {currentProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => navigate(`/product/${product.id}`)}
                            />
                        ))}
                    </div>

                    {/* ✅ PAGINACIÓN */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                ← Anterior
                            </button>

                            <div className="pagination-numbers">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Catalogo;
