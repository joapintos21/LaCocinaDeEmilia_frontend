import { agregarPackACarrito } from "scripts/agregarPackCarrito";
import { agregarProductoACarrito } from "scripts/agregarProductoCarrito";
import { quitarPackCarrito } from "scripts/quitarPackCarrito";
import { quitarProductoCarrito } from "scripts/quitarProductoCarrito";
import { agregarItem } from "store/carritoSlice";

/**
 * Agregar un producto al carrito
 */
export const handleAddToCart = async (producto, cantidad, token, clienteId, tipo, dispatch) => {
    if(tipo === "producto"){
        await agregarProductoACarrito(clienteId, producto.id, cantidad, token);
    }else{
        await agregarPackACarrito(clienteId, producto.id, cantidad, token);
    }
    const productoConCantidad = { ...producto, cantidad, tipo: tipo };
    dispatch(agregarItem(productoConCantidad));
};

/**
 * Quitar un producto del carrito
 */
export const handleQuitarDeCarrito = async (userId, productoId, cantidad, tipo, token) => {
    try {
        if(tipo === "producto"){
            await quitarProductoCarrito(userId, productoId, cantidad, token);
        }else{
            await quitarPackCarrito(userId, productoId, cantidad, token);
        }
    } catch (error) {
        alert("Error al quitar producto del carrito");
    }
};