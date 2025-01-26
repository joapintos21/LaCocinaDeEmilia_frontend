import { setPacks } from 'store/packSlice';

export const obtenerPacks = async (dispatch) => {
	let url = '/packs';

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		const data = await response.json();
		dispatch(setPacks(data)); 
	} catch (error) {
		console.error(error);
	}
};
