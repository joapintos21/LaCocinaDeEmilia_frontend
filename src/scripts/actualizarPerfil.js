import apiClient from '../utils/apiCliente';

export const actualizarPerfil = async (userId, nombre, telefono, password, token) => {
    const body = { nombre, telefono };
    if (password) body.password = password;

    try {
        const response = await apiClient.put(`/usuarios/update?id=${userId}`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        throw error;
    }
};
