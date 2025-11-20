import axios from 'axios';

const API_URL = import.meta.env.VITE_API_CATALOG_URL || 'http://localhost:1111';
const CARRITO_ENDPOINT = `${API_URL}/api/perfumeria/carrito`;

// Agregar producto al carrito
export const addToCart = async (usuarioId, productoId, cantidad) => {
    const response = await axios.post(
        `${CARRITO_ENDPOINT}/agregar`,
        { productoId, cantidad },
        { params: { usuarioId } }
    );
    return response.data;
};

// Ver carrito del usuario
export const getCart = async (usuarioId) => {
    const response = await axios.get(`${CARRITO_ENDPOINT}/ver`, {
        params: { usuarioId }
    });
    return response.data;
};

// Vaciar carrito
export const clearCart = async (usuarioId) => {
    const response = await axios.delete(`${CARRITO_ENDPOINT}/vaciar`, {
        params: { usuarioId }
    });
    return response.data;
};

// Eliminar producto del carrito
export const removeFromCart = async (usuarioId, productoId) => {
    const response = await axios.delete(`${CARRITO_ENDPOINT}/eliminar/${productoId}`, {
        params: { usuarioId }
    });
    return response.data;
};

// Vender carrito (confirmar venta)
export const sellCart = async (usuarioId) => {
    const response = await axios.post(`${CARRITO_ENDPOINT}/vender/${usuarioId}`);
    return response.data;
};

// Vender carrito (confirmar venta)
export const sellCart = async (usuarioId) => {
    const response = await axios.post(`${API_URL}/vender/${usuarioId}`);
    return response.data;
};
