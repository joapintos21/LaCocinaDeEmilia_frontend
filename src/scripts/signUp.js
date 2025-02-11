import apiCliente from 'utils/apiCliente';

export const crearUsuario = async (email, password, nombre, telefono, rol_id) => {
	let errores = {};

	if (!nombre || nombre.trim() === '') {
		errores.nombre = 'El nombre no puede estar vacío.';
	}

	if (!telefono || telefono.length < 8) {
		errores.telefono = 'El teléfono debe tener al menos 8 caracteres.';
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email || !emailRegex.test(email)) {
		errores.email = 'Ingrese un correo electrónico válido.';
	}

	if (!password || password.length < 6) {
		errores.password = 'La contraseña debe tener al menos 6 caracteres.';
	}

	if (Object.keys(errores).length > 0) {
		throw errores;
	}

	const request = '/usuarios/create';
	const body = {
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
			throw { general: error.response.data.error || 'Se produjo un error desconocido.' };
		} else if (error.request) {
			throw { general: 'No se pudo establecer conexión con el servidor.' };
		} else {
			throw { general: 'Error al realizar la solicitud.' };
		}
	}
};
