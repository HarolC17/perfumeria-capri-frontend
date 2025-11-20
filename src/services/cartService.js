import axios from 'axios';

const API_URL = 'http://localhost:1111/api/perfumeria/carrito';

// Agregar producto al carrito
export const addToCart = async (usuarioId, productoId, cantidad) => {
    const response = await axios.post(
        `${API_URL}/agregar`,
        { productoId, cantidad },
        { params: { usuarioId } }
    );
    return response.data;
};

// Ver carrito del usuario
export const getCart = async (usuarioId) => {
    const response = await axios.get(`${API_URL}/ver`, {
        params: { usuarioId }
    });
    return response.data;
};

// Vaciar carrito
export const clearCart = async (usuarioId) => {
    const response = await axios.delete(`${API_URL}/vaciar`, {
        params: { usuarioId }
    });
    return response.data;
};

// Eliminar producto del carrito
export const removeFromCart = async (usuarioId, productoId) => {
    const response = await axios.delete(`${API_URL}/eliminar/${productoId}`, {
        params: { usuarioId }
    });
    return response.data;
};

// Vender carrito (confirmar venta)
export const sellCart = async (usuarioId) => {
    const response = await axios.post(`${API_URL}/vender/${usuarioId}`);
    return response.data;
};
