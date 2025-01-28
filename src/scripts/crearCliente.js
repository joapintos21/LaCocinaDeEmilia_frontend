let request, queryParams, url;

export const crearCliente = async (emailInput, passwordInput) => {
	request = '/usuarios/create';

	queryParams = new URLSearchParams({
		email: emailInput,
		password: passwordInput,
	}).toString();

	url = `${request}?${queryParams}`;

	try {
		const response = await fetch(url, {
			method: 'POST',
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
