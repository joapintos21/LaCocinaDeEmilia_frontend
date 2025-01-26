import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Esto utiliza localStorage
import { combineReducers } from 'redux';
import usuarioReducer from './usuarioSlice';
import productoReducer from './productoSlice';
import packReducer from './packSlice';
import categoriaReducer from './categoriaSlice';
import carritoReducer from './carritoSlice'; 
import descuentoReducer from './descuentoSlice'; 
import permisoReducer from './permisoSlice'; 
import usuariosReducer from './usuariosSlice';
import tiposDescuentoReducer from './tiposDescuentoSlice';
import rolesUsuarioReducer from './rolesUsuarioSlice';
import gestionPermisosSlice from './gestionPermisosSlice';
import pedidosSlice from './pedidosSlice';
import gestionAdicionalesSlice from './gestionAdicionalesSlice'
import dashboardSlice from './dashboardSlice'
import empresaSlice from './empresaSlice'

// Configuración de persistencia para el estado de la aplicación
const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['usuario', 'productos', 'categorias', 'carrito', 'packs'], // Incluye el cart en la persistencia
};

// Combina los reducers
const rootReducer = combineReducers({
    usuario: usuarioReducer,
    productos: productoReducer,
    categorias: categoriaReducer,
    carrito: carritoReducer,
    packs: packReducer,
    descuentos : descuentoReducer,
    permisos : permisoReducer,
    usuarios : usuariosReducer,
    tiposDescuento : tiposDescuentoReducer,
    rolesUsuario : rolesUsuarioReducer,
    gestionPermisos : gestionPermisosSlice,
    pedidos : pedidosSlice,
    gestionAdicionales : gestionAdicionalesSlice,
    dashboard : dashboardSlice,
    empresa : empresaSlice
});

// Aplica persistencia al rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
