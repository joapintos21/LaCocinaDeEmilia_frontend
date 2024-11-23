import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    cantidadProductos: 0,
    precioTotal: 0,
    costoEnvio: 0,
};

const carritoSlice = createSlice({
    name: 'carrito',
    initialState,
    reducers: {
        agregarItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(
                item => item.id === newItem.id && item.tipo === newItem.tipo
            );

            if (existingItem) {
                existingItem.cantidad += newItem.cantidad || 1; // Si no se especifica cantidad, agrega 1 por defecto
                existingItem.precioTotal += newItem.precio * (newItem.cantidad || 1);
            } else {
                state.items.push({
                    id: newItem.id,
                    descripcion: newItem.descripcion,
                    tipo: newItem.tipo, // Tipo del item: "producto" o "pack"
                    precio: newItem.precio,
                    cantidad: newItem.cantidad || 1,
                    precioTotal: newItem.precio * (newItem.cantidad || 1),
                });
            }

            state.cantidadProductos += newItem.cantidad || 1;
            state.precioTotal += newItem.precio * (newItem.cantidad || 1);
        },
        quitarItem: (state, action) => {
            const { id, tipo } = action.payload; // El payload incluye el id y el tipo (producto o pack)
        
            // Busca el elemento en el carrito
            const existingItemIndex = state.items.findIndex(
                item => item.id === id && item.tipo === tipo
            );
        
            if (existingItemIndex !== -1) {
                // Si el elemento existe, actualizamos el estado
                const existingItem = state.items[existingItemIndex];
        
                // Resta la cantidad y el precio total del estado global
                state.cantidadProductos -= existingItem.cantidad;
                state.precioTotal -= existingItem.precioTotal;
        
                // Elimina el elemento del array de items
                state.items.splice(existingItemIndex, 1);
            }
        },
        incrementarCantidad: (state, action) => {
            const { id, tipo } = action.payload; // Ahora el payload incluye el tipo
            const existingItem = state.items.find(
                item => item.id === id && item.tipo === tipo
            );

            if (existingItem) {
                existingItem.cantidad += 1;
                existingItem.precioTotal += existingItem.precio;
                state.cantidadProductos += 1;
                state.precioTotal += existingItem.precio;
            }
        },
        decrementarCantidad: (state, action) => {
            const { id, tipo } = action.payload; // Ahora el payload incluye el tipo
            const existingItem = state.items.find(
                item => item.id === id && item.tipo === tipo
            );

            if (existingItem) {
                if (existingItem.cantidad > 1) {
                    existingItem.cantidad -= 1;
                    existingItem.precioTotal -= existingItem.precio;
                    state.cantidadProductos -= 1;
                    state.precioTotal -= existingItem.precio;
                } else {
                    // Si la cantidad es 1, elimina el producto o pack
                    state.items = state.items.filter(
                        item => item.id !== id || item.tipo !== tipo
                    );
                    state.cantidadProductos -= 1;
                    state.precioTotal -= existingItem.precio;
                }
            }
        },
        limpiarCarrito: (state) => {
            state.items = [];
            state.cantidadProductos = 0;
            state.precioTotal = 0;
            state.costoEnvio = 0;
        },
        
        setCostoEnvio: (state, action) => {
            state.costoEnvio = action.payload;
        },
    },
});

export const {
    agregarItem,
    quitarItem,
    incrementarCantidad,
    decrementarCantidad,
    limpiarCarrito,
    setCostoEnvio,
} = carritoSlice.actions;

export default carritoSlice.reducer;