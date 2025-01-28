export const obtenerIGMedia = async () => {
	let url = '/instagram/obtenerMedia';

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
		return data;
	} catch (error) {
		console.error(error);
		throw error; 
	}
};
