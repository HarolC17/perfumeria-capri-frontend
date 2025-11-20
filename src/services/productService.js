import axios from 'axios';

const API_URL = 'http://localhost:1111/api/perfumeria/producto';

export const getAllProducts = async (page = 0, size = 12) => {
    const response = await axios.get(`${API_URL}/all`, {
        params: { page, size }
    });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const searchByBrand = async (marca, page = 0, size = 12) => {
    const response = await axios.post(`${API_URL}/buscar/marca`, {
        valor: marca,
        page,
        size
    });
    return response.data;
};

export const searchByType = async (tipo, page = 0, size = 12) => {
    const response = await axios.post(`${API_URL}/buscar/tipo`, {
        valor: tipo,
        page,
        size
    });
    return response.data;
};

export const searchByName = async (nombre, page = 0, size = 12) => {
    const response = await axios.post(`${API_URL}/buscar/nombre`, {
        valor: nombre,
        page,
        size
    });
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await axios.post(`${API_URL}/save`, productData);
    return response.data;
};

export const updateProduct = async (productData) => {
    const response = await axios.put(`${API_URL}/update`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
};

export const restockProduct = async (productoId, cantidad) => {
    const response = await axios.put(`${API_URL}/reponer-stock`, {
        productoId,
        cantidad
    });
    return response.data;
};
