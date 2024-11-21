import { createSlice } from '@reduxjs/toolkit';

const packSlice = createSlice({
    name: 'packs',
    initialState: [],
    reducers: {
        setPacks: (state, action) => {
            return action.payload;
        },
    },
});

export const { setPacks } = packSlice.actions;
export default packSlice.reducer;