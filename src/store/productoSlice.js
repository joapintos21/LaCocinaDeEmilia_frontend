import { createSlice } from '@reduxjs/toolkit';

const productoSlice = createSlice({
    name: 'productos',
    initialState: [],
    reducers: {
        setProductos: (state, action) => {
            return action.payload;
        },
    },
});

export const { setProductos } = productoSlice.actions;
export default productoSlice.reducer;