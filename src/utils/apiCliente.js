import axios from 'axios';

// Crea una instancia de Axios
const apiCliente = axios.create({
	baseURL: '/api',

	timeout: 20000, // Tiempo de espera máximo
});

// Interceptor de solicitudes para agregar el token solo si está en los headers
apiCliente.interceptors.request.use(
	(config) => {
		// Verifica si ya se pasó un token en los headers manualmente
		if (!config.headers.Authorization) {
			// Si no hay token en la petición, no hace nada
			return config;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Interceptor de respuestas para manejar errores globales
apiCliente.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response) {
			const { status } = error.response;

			// Manejo de errores 401 (No autorizado)
			if (status === 401) {
				// Limpia el sessionStorage
				sessionStorage.clear();
			}

			// Manejo de otros errores globales
			if (status === 403) {
				alert('No tienes permiso para realizar esta acción.');
			} else if (status === 400) {
				alert('Error en la solicitud. Por favor, verifica los datos ingresados.');
			} else if (status === 500) {
				alert('Ocurrió un error en el servidor. Intenta nuevamente más tarde.');
			}
		} else {
			// Error de red (sin respuesta del servidor)
			alert('Error de red. Por favor, verifica tu conexión a internet.');
		}

		return Promise.reject(error); // Rechaza el error para manejarlo localmente si es necesario
	},
);

export default apiCliente;
