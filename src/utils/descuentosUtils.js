export const mostrarValorDescuento = (descuento, tipo) => {
	if (tipo === 'PORCENTAJE') return (descuento * 100) + '%';
	else return descuento;
};
