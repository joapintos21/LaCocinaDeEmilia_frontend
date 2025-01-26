import { setCategorias } from '../store/categoriaSlice';

export const obtenerCategorias = async (dispatch) => {
	let url = '/categorias';

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
		dispatch(setCategorias(data)); 
	} catch (error) {
		console.error(error);
		throw error; 
	}
};

export default obtenerCategorias;
