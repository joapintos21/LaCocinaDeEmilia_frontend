import apiClient from '../utils/apiCliente'; 

export const resetearPassword = async (token, password) => {
	try {
		const response = await apiClient.post('/usuarios/resetPassword', { token, password });

		return response.data;
	} catch (error) {
		if (error.response) {
			const errorData = error.response.data;
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		} else if (error.request) {
			throw new Error('No se pudo establecer conexión con el servidor.');
		} else {
			throw new Error('Error al realizar la solicitud.');
		}
	}
};
