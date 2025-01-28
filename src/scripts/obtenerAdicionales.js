export const obtenerAdicionales = async (productoId, dispatch, token) => {
	let url = `/productos/listarAdicionales?producto_id=${productoId}`;

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
		return data; 
	} catch (error) {
		console.error(error);
		throw error; 
	}
};

export default obtenerAdicionales;
