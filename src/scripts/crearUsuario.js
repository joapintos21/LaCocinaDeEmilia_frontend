import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const crearUsuario = async (emailInput, passwordInput, nombreInput, telefonoInput, rolIdInput, token) => {
	const body = {
		email: emailInput,
		password: passwordInput,
		nombre: nombreInput,
		telefono: telefonoInput,
		rol_id: parseInt(rolIdInput),
	};

	try {
		const response = await apiClient.post('/usuarios/create', body, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

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
				const errorData = error.response.data;
				throw new Error(errorData.error || 'Se produjo un error desconocido.');
			}
		} else if (error.request) {
			throw new Error('No se pudo establecer conexión con el servidor.');
		} else {
			throw new Error('Error al realizar la solicitud.');
		}
	}
};
