import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Esto utiliza localStorage
import { combineReducers } from 'redux';
import usuarioReducer from './usuarioSlice';
import productoReducer from './productoSlice';
import categoriaReducer from './categoriaSlice';

// Configuración de persistencia para el estado de la aplicación
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['usuario', 'productos', 'categorias'], // Persistir estos reducers
};

// Combina los reducers
const rootReducer = combineReducers({
    usuario: usuarioReducer,
    productos: productoReducer,
    categorias: categoriaReducer,
});

// Aplica persistencia al rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;