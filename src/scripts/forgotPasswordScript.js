import apiClient from '../utils/apiCliente'; 

export const recuperarPassword = async (email) => {
	try {
		const response = await apiClient.post('/usuarios/forgotPassword', { email: email });

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
