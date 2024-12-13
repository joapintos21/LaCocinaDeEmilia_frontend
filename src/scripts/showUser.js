const request = '/usuarios/show';

const queryParams = new URLSearchParams({
	id: 1,
}).toString();

let token =
	'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzMwNDE4MjkyLCJleHAiOjE3MzEwMjMwOTJ9.Jrhu4CxQEF30DpaCX-QURchLuMhvDmAD603l4-VkR98h8_ny-iBaTqH5rkMY-Oozrpqe9JyxRB_W4wk_DSmqag';

const url = `${request}?${queryParams}`;

fetch(url, {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
		Authorization: token,
	},
})
	.then((response) => {
		// Errores fuera del rango 200-299
		if (!response.ok) {
			throw new Error('Se produjo un error con la solicitud: ' + response.statusText);
		}
		return response.json();
	})
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.error(error);
	});
