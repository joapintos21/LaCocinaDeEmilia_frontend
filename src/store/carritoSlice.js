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
                existingItem.cantidad += newItem.cantidad || 1; // Si no se especifica cantidad, agrega 1 por defecto
                existingItem.precioTotal += newItem.precio * (newItem.cantidad || 1);
            } else {
                state.items.push({
                    id: newItem.id,
                    descripcion: newItem.descripcion,
                    precio: newItem.precio,
                    cantidad: newItem.cantidad || 1,
                    precioTotal: newItem.precio * (newItem.cantidad || 1),
                });
            }

            state.cantidadProductos += newItem.cantidad || 1;
            state.precioTotal += newItem.precio * (newItem.cantidad || 1);
        },
        quitarItem: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                state.cantidadProductos -= existingItem.cantidad;
                state.precioTotal -= existingItem.precioTotal;
                state.items = state.items.filter(item => item.id !== id);
            }
        },
        incrementarCantidad: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                existingItem.cantidad += 1;
                existingItem.precioTotal += existingItem.precio;
                state.cantidadProductos += 1;
                state.precioTotal += existingItem.precio;
            }
        },
        decrementarCantidad: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                if (existingItem.cantidad > 1) {
                    existingItem.cantidad -= 1;
                    existingItem.precioTotal -= existingItem.precio;
                    state.cantidadProductos -= 1;
                    state.precioTotal -= existingItem.precio;
                } else {
                    // Si la cantidad es 1, elimina el producto
                    state.items = state.items.filter(item => item.id !== id);
                    state.cantidadProductos -= 1;
                    state.precioTotal -= existingItem.precio;
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

export const {
    agregarItem,
    quitarItem,
    incrementarCantidad,
    decrementarCantidad,
    limpiarCarrito,
} = carritoSlice.actions;

export default carritoSlice.reducer;