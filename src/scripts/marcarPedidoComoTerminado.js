import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const marcarPedidoComoTerminado = async (pedidoId, token) => {
    try {
        const response = await apiClient.put('/pedidos/marcarComoTerminado', 
            { pedido_id: pedidoId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success('Pedido marcado como terminado.');
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
                toast.error(error.response.data.error || 'Error al marcar el pedido como terminado.');
            }
        } else if (error.request) {
            toast.error('No se pudo establecer conexión con el servidor.');
        } else {
            toast.error('Error al realizar la solicitud.');
        }

        console.error('Error al marcar pedido como terminado:', error);
        throw error;
    }
};
