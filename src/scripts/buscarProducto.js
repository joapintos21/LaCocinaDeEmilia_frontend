// buscarProducto.js
export const buscarProducto = async (textoBusqueda) => {
	const request = `/productos/buscar?query=${encodeURIComponent(textoBusqueda)}`;

	try {
		const response = await fetch(request, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Error en la búsqueda de productos');
		}

		const data = await response.json();
		return data; // Devuelve los productos encontrados
	} catch (error) {
		console.error('Error al buscar productos:', error);
		throw error;
	}
};
