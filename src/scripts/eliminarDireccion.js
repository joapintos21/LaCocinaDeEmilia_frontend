import apiClient from '../utils/apiCliente';
import { toast } from 'react-toastify';

export const eliminarDireccion = async (id, token) => {
    try {
        const response = await apiClient.delete(`/direcciones/delete?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.error || 'Error al eliminar la dirección.');
        } else {
            toast.error('No se pudo conectar con el servidor.');
        }
        throw error;
    }
};
