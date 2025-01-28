import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';
import { setCategorias } from 'store/categoriaSlice';

export const obtenerCategorias = async (dispatch) => {
	try {
		const response = await apiClient.get('/categorias');

		dispatch(setCategorias(response.data));
	} catch (error) {
		if (error.response) {
			if (error.response.status === 401) {
				toast.info('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', {
					onClose: () => {
						window.location.href = '/login';
					},
				});
			}
			const errorData = error.response.data;
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		} else if (error.request) {
			throw new Error('No se pudo establecer conexión con el servidor.');
		} else {
			throw new Error('Error al realizar la solicitud.');
		}
	}
};
