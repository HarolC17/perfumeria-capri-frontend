import axios from 'axios';

const PEDIDO_URL = 'http://localhost:1212/api/perfumeria/pedido';
const PAGO_URL = 'http://localhost:1212/api/perfumeria/pago';

export const createOrder = async (usuarioId, direccionEnvio) => {
    const response = await axios.post(`${PEDIDO_URL}/crear`, {
        usuarioId,
        direccionEnvio
    });
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await axios.get(`${PEDIDO_URL}/${id}`);
    return response.data;
};

export const getUserOrders = async (usuarioId) => {
    const response = await axios.get(`${PEDIDO_URL}/usuario/${usuarioId}`);
    return response.data;
};

export const getPaymentById = async (idPago) => {
    const response = await axios.get(`${PAGO_URL}/${idPago}`);
    return response.data;
};

export const updatePaymentStatus = async (idPago, nuevoEstado) => {
    const response = await axios.put(`${PAGO_URL}/${idPago}/estado`, null, {
        params: { nuevoEstado }
    });
    return response.data;
};

export const registerPaymentReference = async (idPago, referencia) => {
    const response = await axios.put(`${PAGO_URL}/${idPago}/referencia`, null, {
        params: { referencia }
    });
    return response.data;
};
