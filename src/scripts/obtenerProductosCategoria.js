// obtenerProductosCategoria.js
import { setProductos } from 'store/productoSlice';

export const obtenerProductos = async (dispatch) => {
  let url = "/productos"; // Aquí debería ir la URL correcta de tu API

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    // Maneja errores fuera del rango 200-299
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();
    dispatch(setProductos(data)); // Almacena los productos en Redux

  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error; // Lanza el error para que sea capturado en el evento
  }
};
