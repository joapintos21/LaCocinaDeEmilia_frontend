import { setEmpresa } from '../store/empresaSlice';

export const obtenerEmpresa = async (dispatch, token) => {
	let url = '/empresa';

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
		dispatch(setEmpresa(data));
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export default obtenerEmpresa;
