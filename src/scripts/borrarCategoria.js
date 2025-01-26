export const borrarCategoria = async (id, token) => {
	const url = `/categorias/delete/${id}`; 

	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		return { message: 'Categoría eliminada exitosamente' };
	} catch (error) {
		console.error(error);
		throw error; 
	}
};
