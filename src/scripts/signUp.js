import apiCliente from 'utils/apiCliente';

let request, body;

export const crearUsuario = async (email, password, nombre, telefono, rol_id) => {
	request = '/usuarios/create';

	body = {
		email: email,
		password: password,
		nombre: nombre,
		telefono: telefono,
		rol_id: rol_id,
	};

	try {
		const response = await apiCliente.post(request, body);
		return response.data; 
	} catch (error) {
		if (error.response) {
			const errorData = error.response.data;
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		} else if (error.request) {
			throw new Error('No se pudo establecer conexión con el servidor.');
		} else {
			throw new Error('Error al realizar la solicitud.');
		}
	}
};
