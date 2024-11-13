import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Esto utiliza localStorage
import usuarioReducer from './usuarioSlice';
import productoReducer from './productoSlice';
import categoriaReducer from './categoriaSlice';

// Configuración de persistencia para el estado de usuario
const persistConfig = {
    key: 'usuario',
    storage,
    whitelist: ['userInfo', 'isLoggedIn'], // Solo persiste el estado de usuario
};

const persistedUsuarioReducer = persistReducer(persistConfig, usuarioReducer);

const store = configureStore({
    reducer: {
        usuario: persistedUsuarioReducer,
        productos: productoReducer,
        categorias: categoriaReducer,
    },
});

export const persistor = persistStore(store);
export default store;