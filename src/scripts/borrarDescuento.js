export const borrarDescuento = async (id, token) => {
	const url = `/descuentos/delete/${id}`; // URL del endpoint

	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`, // Incluir el token en el header de autorización
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		// Si la respuesta es exitosa y no tiene cuerpo, devolver mensaje de éxito
		return { message: 'Descuento eliminado exitosamente' };
	} catch (error) {
		console.error(error);
		throw error; // Lanza el error para que lo maneje el llamador
	}
};
