export const obtenerIGMedia = async () => {
	let url = '/instagram/obtenerMedia';

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		// Maneja errores fuera del rango 200-299
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error; // Lanza el error para que sea capturado en el evento
	}
};
