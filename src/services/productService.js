import axios from 'axios';

const API_URL = import.meta.env.VITE_API_CATALOG_URL || 'http://localhost:1111';
const PRODUCTOS_ENDPOINT = `${API_URL}/api/perfumeria/producto`;

export const getAllProducts = async (page = 0, size = 50) => {
    const response = await axios.get(`${PRODUCTOS_ENDPOINT}/all`, {
        params: { page, size }
    });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(`${PRODUCTOS_ENDPOINT}/${id}`);
    return response.data;
};

export const searchByBrand = async (marca, page = 0, size = 50) => {
    const response = await axios.post(`${PRODUCTOS_ENDPOINT}/buscar/marca`, {
        valor: marca,
        page,
        size
    });
    return response.data;
};

export const searchByType = async (tipo, page = 0, size = 50) => {
    const response = await axios.post(`${PRODUCTOS_ENDPOINT}/buscar/tipo`, {
        valor: tipo,
        page,
        size
    });
    return response.data;
};

export const searchByName = async (nombre, page = 0, size = 50) => {
    const response = await axios.post(`${PRODUCTOS_ENDPOINT}/buscar/nombre`, {
        valor: nombre,
        page,
        size
    });
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await axios.post(`${PRODUCTOS_ENDPOINT}/save`, productData);
    return response.data;
};

export const updateProduct = async (productData) => {
    const response = await axios.put(`${PRODUCTOS_ENDPOINT}/update`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axios.delete(`${PRODUCTOS_ENDPOINT}/delete/${id}`);
    return response.data;
};

export const restockProduct = async (productoId, cantidad) => {
    const response = await axios.put(`${PRODUCTOS_ENDPOINT}/reponer-stock`, {
        productoId,
        cantidad
    });
    return response.data;
};