import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // ✅ Agregar useSearchParams
import { getAllProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import './Catalogo.css';

function Catalogo() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // ✅ NUEVO
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedMarca, setSelectedMarca] = useState(''); // ✅ NUEVO
    const [sortBy, setSortBy] = useState('nombre');

    // Obtener tipos y marcas únicos
    const [types, setTypes] = useState([]);
    const [marcas, setMarcas] = useState([]); // ✅ NUEVO

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        // ✅ Leer marca de la URL al cargar
        const marcaFromUrl = searchParams.get('marca');
        if (marcaFromUrl) {
            setSelectedMarca(marcaFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        applyFilters();
    }, [products, searchTerm, selectedType, selectedMarca, sortBy]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);

            // Extraer tipos únicos
            const uniqueTypes = [...new Set(data.map(p => p.tipo).filter(Boolean))];
            setTypes(uniqueTypes);

            // ✅ Extraer marcas únicas
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

        // Filtro de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.marca && product.marca.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filtro por tipo
        if (selectedType) {
            filtered = filtered.filter(product => product.tipo === selectedType);
        }

        // ✅ Filtro por marca
        if (selectedMarca) {
            filtered = filtered.filter(product => product.marca === selectedMarca);
        }

        // Ordenamiento
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
        setSelectedMarca(''); // ✅ NUEVO
        setSortBy('nombre');
        navigate('/catalogo'); // ✅ Limpiar URL
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
                    {/* Búsqueda */}
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

                    {/* ✅ Filtro por Marca */}
                    <div className="filter-group">
                        <label>Marca</label>
                        <select
                            value={selectedMarca}
                            onChange={(e) => setSelectedMarca(e.target.value)}
                            className="sort-select"
                        >
                            <option value="">Todas las marcas</option>
                            {marcas.map(marca => (
                                <option key={marca} value={marca}>
                                    {marca}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Tipo/Categoría */}
                    <div className="filter-group">
                        <label>Categoría</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="sort-select"
                        >
                            <option value="">Todas las categorías</option>
                            {types.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ordenar */}
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

                    {/* Limpiar filtros */}
                    {(searchTerm || selectedType || selectedMarca || sortBy !== 'nombre') && (
                        <button
                            onClick={clearFilters}
                            className="clear-filters-button"
                        >
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
                        <button
                            onClick={clearFilters}
                            className="reset-search-button"
                        >
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            ) : (
                <div className="products-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => navigate(`/product/${product.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Catalogo;
