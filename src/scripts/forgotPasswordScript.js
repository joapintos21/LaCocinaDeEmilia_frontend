// Ruta: src/scripts/loginScript.js
import apiClient from '../utils/apiCliente'; // Asegúrate de que la ruta sea correcta

export const recuperarPassword = async (email) => {
	try {
		// Realiza la solicitud POST usando el cliente API
		const response = await apiClient.post('/usuarios/forgotPassword', { email: email });

		// Devuelve los datos de la respuesta
		return response.data;
	} catch (error) {
		// Manejo de errores
		if (error.response) {
			// Si el error tiene respuesta, lanza el mensaje adecuado
			const errorData = error.response.data;
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		} else if (error.request) {
			// Si no se recibe respuesta del servidor
			throw new Error('No se pudo establecer conexión con el servidor.');
		} else {
			// Error al configurar la solicitud
			throw new Error('Error al realizar la solicitud.');
		}
	}
};
