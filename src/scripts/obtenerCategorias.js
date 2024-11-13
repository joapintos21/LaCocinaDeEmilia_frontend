import { setCategorias } from '../store/categoriaSlice';

export const obtenerCategorias = async (dispatch) => {
  let url = "/categorias";

  try {
    // Obtén el token desde sessionStorage o localStorage
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado. Por favor, inicie sesión.');
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Agrega el token al encabezado
      },
    });

    // Maneja errores fuera del rango 200-299
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();
    dispatch(setCategorias(data)); // Almacena las categorías en Redux

  } catch (error) {
    console.error(error);
    throw error; // Lanza el error para que sea capturado en el evento
  }
};