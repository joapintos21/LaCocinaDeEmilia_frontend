import { setDescuentos } from '../store/descuentoSlice';

export const obtenerDescuentos = async (dispatch, token) => {
  let url = "/descuentos";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();
    dispatch(setDescuentos(data));

  } catch (error) {
    console.error(error);
    throw error; 
  }
};
