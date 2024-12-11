import { setUsuarios } from '../store/usuarioSlice';

export const obtenerUsuarios  = async (dispatch) => {
  let url = "/usuarios";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();
    dispatch(setUsuarios(data)); 

  } catch (error) {
    console.error(error);
    throw error; 
  }
};
export default obtenerUsuarios;