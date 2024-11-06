let request, queryParams, url;

export const iniciarSesion = async (emailInput, passwordInput) => {
  request = "/login/iniciarSesion";

  queryParams = new URLSearchParams({
    email: emailInput,
    password: passwordInput,
  }).toString();

  url = `${request}?${queryParams}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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