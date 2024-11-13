import { createSlice } from '@reduxjs/toolkit';

const categoriaSlice = createSlice({
    name: 'categorias',
    initialState: [],
    reducers: {
        setCategorias: (state, action) => {
            return action.payload;
        },
    },
});

export const { setCategorias } = categoriaSlice.actions;
export default categoriaSlice.reducer;