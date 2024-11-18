import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // Array de productos en el carrito
    cantidadProductos: 0, // Cantidad total de productos en el carrito
    precioTotal: 0, // Precio total del carrito
};

const carritoSlice = createSlice({
    name: 'carrito',
    initialState,
    reducers: {
        agregarItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (existingItem) {
                existingItem.cantidad += newItem.cantidad;
                existingItem.precioTotal += newItem.precio;
            } else {
                state.items.push({
                    id: newItem.id,
                    descripcion: newItem.descripcion,
                    precio: newItem.precio,
                    cantidad: newItem.cantidad,
                    precioTotal: newItem.precio,
                });
            }

            state.cantidadProductos += 1;
            state.precioTotal += newItem.precio;
        },
        quitarItem: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                state.cantidadProductos -= 1;
                state.precioTotal -= existingItem.precio;

                if (existingItem.cantidad === 1) {
                    state.items = state.items.filter(item => item.id !== id);
                } else {
                    existingItem.cantidad -= 1;
                    existingItem.precioTotal -= existingItem.precio;
                }
            }
        },
        limpiarCarrito: (state) => {
            state.items = [];
            state.cantidadProductos = 0;
            state.precioTotal = 0;
        },
    },
});

export const { agregarItem, quitarItem, limpiarCarrito } = carritoSlice.actions;
export default carritoSlice.reducer;