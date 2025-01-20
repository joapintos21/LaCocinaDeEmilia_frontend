import { setGestionAdicionales } from 'store/gestionAdicionalesSlice';

export const obtenerTodosAdicionales = async (dispatch, token) => {
	let url = `/adicionales`;

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
		dispatch(setGestionAdicionales(data)); 
	} catch (error) {
		console.error(error);
		throw error; 
	}
};

export default obtenerTodosAdicionales;
