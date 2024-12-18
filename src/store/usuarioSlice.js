import { createSlice } from "@reduxjs/toolkit";

const usuarioSlice = createSlice({
  name: "usuario",
  initialState: {
    isLoggedIn: false,
    userInfo: null,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
    }
  },
});

export const { login, logout } = usuarioSlice.actions;
export default usuarioSlice.reducer;
