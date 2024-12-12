let request, url, body;

export const finalizarPedido = async (pedidoId, metodoPagoId, paymentId, direccionId, token) => {
  request = "/pedidos/finalizarPedido";
  url = `${request}`;

  body = {
    pedido_id: pedidoId,
    metodo_pago_id: metodoPagoId,
    payment_id: paymentId,
    direccion_id: direccionId
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Incluir el token en el header de autorización
      },
      body: JSON.stringify(body),
    });

    // Maneja errores fuera del rango 200-299
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();

    return data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error(error);
    throw error; // Lanza el error para que sea capturado en el evento
  }
};