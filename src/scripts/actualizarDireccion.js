import apiClient from '../utils/apiCliente';
import { toast } from 'react-toastify';

export const actualizarDireccion = async (id, direccionData, token) => {
    try {
        const response = await apiClient.put(`/direcciones?id=${id}`, direccionData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        toast.success('Dirección actualizada correctamente');
        return response.data;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.error || 'Error al actualizar la dirección.');
        } else {
            toast.error('No se pudo conectar con el servidor.');
        }
        throw error;
    }
};
