import axios from 'axios';

// ✅ Lee la URL de las variables de entorno
const API_URL = import.meta.env.VITE_API_AUTH_URL || 'http://localhost:1010';
const USUARIO_ENDPOINT = `${API_URL}/api/perfumeria/usuario`;

// Login
export const login = async (email, password) => {
    const response = await axios.post(`${USUARIO_ENDPOINT}/login`, {
        email,
        password
    });
    return response.data;
};

export const register = async (nombre, email, numeroTelefono, password, role = 'USER') => {
    const response = await axios.post(`${USUARIO_ENDPOINT}/save`, {
        nombre,
        email,
        numeroTelefono,
        password,
        role
    });
    return response.data;
};

// ADMIN: Listar usuarios
export const getAllUsers = async (page = 0, size = 10) => {
    const response = await axios.get(`${USUARIO_ENDPOINT}/usuarios`, {
        params: { page, size }
    });
    return response.data;
};

// ADMIN: Obtener usuario por ID
export const getUserById = async (id) => {
    const response = await axios.get(`${USUARIO_ENDPOINT}/${id}`);
    return response.data;
};

// ADMIN: Actualizar usuario
export const updateUser = async (userData) => {
    const response = await axios.put(`${USUARIO_ENDPOINT}/update`, userData);
    return response.data;
};

// ADMIN: Eliminar usuario
export const deleteUser = async (id) => {
    const response = await axios.delete(`${USUARIO_ENDPOINT}/delete/${id}`);
    return response.data;
};
