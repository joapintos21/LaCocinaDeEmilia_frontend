let request, url, body;

export const agregarPackACarrito = async (clienteId, productoId, cantidad, token) => {
  request = "/api/carrito/agregarPackACarrito";
  url = `${request}`;

  body = {
    userId: clienteId,
    productoId: productoId,
    cantidad: cantidad,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
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