import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const actualizarUsuario = async (id, telefono, nombre, email, rolId, status, token) => {
	const body = {
		telefono: telefono,
		nombre: nombre,
		email: email,
		rol_id: parseInt(rolId),
		status: status,
	};

	try {
		const response = await apiClient.put(`/usuarios/update?id=${id}`, body, {
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
