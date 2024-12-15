let url, body;

export const crearUsuario = async (emailInput, passwordInput, nombreInput, telefonoInput, rolIdInput) => {
  url = "/usuarios/create";

  body = {
    email: emailInput,
    password: passwordInput,
    nombre: nombreInput,
    telefono: telefonoInput, 
    rol_id: rolIdInput
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();
    return data; 

  } catch (error) {
    console.error(error);
    throw error; 
  }
};