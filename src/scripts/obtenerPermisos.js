import { setPermisos } from '../store/gestionPermisosSlice';

export const obtenerPermisos = async (dispatch, token) => {
	let url = '/permisos';

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		const data = await response.json();
		dispatch(setPermisos(data));
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export default obtenerPermisos;
