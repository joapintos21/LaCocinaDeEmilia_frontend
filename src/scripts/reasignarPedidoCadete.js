import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const reasignarPedidoCadete = async (pedidoId, userId, token) => {
    try {
        const response = await apiClient.put('/pedidos/reasignarCadete', 
            { pedido_id: pedidoId, userId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success('Pedido reasignado a cadete correctamente.');
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
                toast.error(error.response.data.error || 'No se pudo reasignar el pedido.');
            }
        } else if (error.request) {
            toast.error('No se pudo establecer conexión con el servidor.');
        } else {
            toast.error('Error al realizar la solicitud.');
        }

        console.error('Error al reasignar pedido:', error);
        throw error;
    }
};
