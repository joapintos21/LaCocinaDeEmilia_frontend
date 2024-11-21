// productoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productos: [],  // Asegúrate de que el estado de productos se inicialice como un array vacío
};

const productoSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    setProductos: (state, action) => {
      state.productos = action.payload;
    },
    addProduct: (state, action) => {
      state.productos.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.productos.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.productos[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      // Asegúrate de que 'productos' siempre sea un array, incluso si está vacío o es undefined
      state.productos = state.productos ? state.productos.filter(product => product.id !== action.payload) : [];
    },
  },
});

export const { setProductos, addProduct, updateProduct, deleteProduct } = productoSlice.actions;

export default productoSlice.reducer;
