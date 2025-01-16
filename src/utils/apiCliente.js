import axios from 'axios';

// Crea una instancia de Axios

const apiCliente = axios.create({
	baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080', // URL base de tu backend

	timeout: 10000, // Tiempo de espera máximo
});

// Interceptor de solicitudes para agregar el token

apiCliente.interceptors.request.use(
	(config) => {
		const token = sessionStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
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
