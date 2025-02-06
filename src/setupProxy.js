const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	const apiPaths = [
		'/api/instagram',
		'/api/usuarios',
		'/api/login',
		'/api/productos',
		'/api/packs',
		'/api/categorias',
		'/api/pedidos',
		'/api/carrito',
		'/api/adicionales',
		'/api/descuentos',
		'/api/permisos',
		'/api/empresa',
		'/api/gastos',
		'/api/dashboard',
		'/api/direcciones',
		'/api/reporte',
	];

	apiPaths.forEach((path) => {
		app.use(
			path,
			createProxyMiddleware({
				target: process.env.REACT_APP_PROXY_URL || 'http://127.0.0.1:8080',
				changeOrigin: true,
				pathRewrite: {
					[`^${path}`]: path.replace('/api', ''), // Elimina el prefijo "/api"
				},
				logLevel: 'debug', // Habilita logs para verificar las redirecciones
			}),
		);
	});
};
