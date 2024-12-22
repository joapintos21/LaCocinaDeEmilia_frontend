// src/utils/descuentoUtils.js

/**
 * Calcula el precio con descuento aplicando una lista de descuentos.
 *
 * @param {number} precio - El precio original del producto/pack.
 * @param {Array} descuentos - Lista de descuentos aplicables.
 * @returns {number} - Precio final con los descuentos aplicados.
 */
export const calcularPrecioConDescuento = (precio, descuentos) => {
	return descuentos.reduce((precioFinal, item) => {
		const { tipo, valor } = item.descuento;
		if (tipo === 'PORCENTAJE') {
			return precioFinal * (1 - valor);
		} else if (tipo === 'IMPORTE') {
			return precioFinal - valor;
		}
		return precioFinal;
	}, precio);
};
