let server, request, queryParams, url;

function login() {
  server = "http://localhost:8080";

  request = "/login/iniciarSesion";

  queryParams = new URLSearchParams({
    email: "joaquin@gmail.com",
    password: "P@ssw0rd",
  }).toString();

  url = `${server}${request}?${queryParams}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

login()
