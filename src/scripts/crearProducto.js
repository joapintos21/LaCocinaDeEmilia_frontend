import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const crearProducto = async ({ titulo, descripcion, precio, categoria_id, visible, imagen }, token) => {
	const body = {
		titulo: titulo,
		descripcion: descripcion,
		precio: parseFloat(precio),
		categoria_id: parseInt(categoria_id),
		visible: visible,
		imagen: imagen,
	};

	try {
		const response = await apiClient.post('/productos/create', body, {
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
