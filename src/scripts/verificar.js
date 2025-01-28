export const verificar = async (token) => {
	let request = 'http://localhost:8080/usuarios/validarToken';

	const queryParams = new URLSearchParams({
		token: token,
	}).toString();

	let url = `${request}?${queryParams}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (!response.ok) {
			const errorData = response.error;
			throw new Error(errorData || 'Se produjo un error desconocido.');
		}
		return response.json();
	} catch (error) {
		console.log(error);
		throw error; 
	}
};
