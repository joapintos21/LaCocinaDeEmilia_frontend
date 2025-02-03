import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const obtenerPedidosParaCadete = async (userId, token) => {
    try {
        const response = await apiClient.get('/pedidos/obtenerPedidosParaCadete', {
            params: { usuario_id: userId },
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                toast.info('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', {
                    onClose: () => {
                        window.location.href = '/login';
                    },
                });
            } else {
                toast.error(error.response.data.error || 'Hubo un problema al obtener los pedidos del cadete.');
            }
        } else if (error.request) {
            toast.error('No se pudo establecer conexión con el servidor.');
        } else {
            toast.error('Error al realizar la solicitud.');
        }

        console.error('Error al obtener pedidos:', error);
        throw error;
    }
};
