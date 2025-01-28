function signUp() {
  const server = "http://localhost:8080";

  const request = "/usuarios/create";

  const data = {
    email: "pedro@gmail.com",
    password: "P@ssw0rd",
    nombre: "Pedro Bonilla",
    telefono: "093557484",
    rol_id: 1,
  };

  const url = `${server}${request}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      // Errores fuera del rango 200-299
      if (!response.ok) {
        throw new Error(
          "Se produjo un error con la solicitud: " + response.statusText
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

signUp();