export const estadosPedidosDescripcion = {
	1: 'Su pedido está siendo procesado',
	2: 'Estamos preparando su pedido',
	3: 'Pedido listo para su envío',
	4: 'Pedido entregado',
	5: 'Pedido cancelado',
};

export const pedidoEstados = {
	1: 'EN_PROGRESO',
	2: 'LISTO_PARA_PREPARAR',
	3: 'LISTO_PARA_ENVIAR',
	4: 'ENTREGADO',
	5: 'CANCELADO',
};

export const metodosPago = [
	{
		id: 1,
		nombre: 'Transferencia',
		comision: 0,
	},
	{
		id: 2,
		nombre: 'Mercado Pago',
		comision: 5.99,
	},
	{
		id: 3,
		nombre: 'Efectivo al retirar',
		comision: 0,
	},
];
