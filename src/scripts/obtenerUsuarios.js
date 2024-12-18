import { setUsuarios } from '../store/usuariosSlice';

export const obtenerUsuarios  = async (dispatch, token) => {
  let url = "/usuarios";

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
    dispatch(setUsuarios(data)); 
    console.log(data);
  } catch (error) {
    console.error(error);
    throw error; 
  }
};
export default obtenerUsuarios;