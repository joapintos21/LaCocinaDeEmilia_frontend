import { createSlice } from '@reduxjs/toolkit';

export const tiposDescuentoSlice = createSlice({
  name: 'tiposDescuento',
  initialState: [],  
  reducers: {
    setTiposDescuento: (state, action) => {
      return action.payload;
    }
  },
});

export const { setTiposDescuento } = tiposDescuentoSlice.actions;

export default tiposDescuentoSlice.reducer;
