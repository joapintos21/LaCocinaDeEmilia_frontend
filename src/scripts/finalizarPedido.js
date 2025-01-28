let request, url, body;

export const finalizarPedido = async (pedidoId, metodoPagoId, paymentId, direccionId, fechaEnvio, token) => {
	request = '/pedidos/finalizarPedido';
	url = `${request}`;

	body = {
		pedido_id: pedidoId,
		metodo_pago_id: metodoPagoId,
		payment_id: paymentId,
		direccion_id: direccionId,
		fecha_envio: fechaEnvio,
	};

	try {
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, 
			},
			body: JSON.stringify(body),
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
