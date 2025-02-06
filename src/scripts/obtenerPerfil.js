import apiClient from '../utils/apiCliente';

export const obtenerPerfil = async (userId, token) => {
    try {
        const response = await apiClient.get(`/usuarios/show?id=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        throw error;
    }
};