import { setTiposDescuento } from '../store/tiposDescuentoSlice';

export const obtenerTiposDescuento = async (dispatch, token) => {
  let url = "/descuentos/tiposDescuntos";

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
    dispatch(setTiposDescuento(data));

  } catch (error) {
    console.error(error);
    throw error; 
  }
};