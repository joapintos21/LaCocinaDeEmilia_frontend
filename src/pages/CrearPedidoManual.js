import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from 'components/headers/light.js';
import { setCostoEnvio, setDireccion } from 'store/carritoSlice';
import tw from 'twin.macro';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Paper,
	TextField,
	Box,
	Grid,
	Container,
	InputAdornment,
	Checkbox,
	FormControlLabel,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { calcularPrecioConDescuento } from '../utils/descuentoUtils';
import { obtenerTodosAdicionales } from 'scripts/obtenerTodosAdicionales';
import { obtenerProductos } from 'scripts/obtenerProductosCategoria';
import MapComponent from '../components/Cart/MapComponent';
import { obtenerUsuarios } from 'scripts/obtenerUsuarios';
import { setNotas } from '../store/carritoSlice';
import { handleAddToCart } from 'utils/carritoUtils';
import { toast } from 'react-toastify';

export default () => {
	const navigate = useNavigate();
	const FinalizarCompraButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800`;
	const SectionTitle = tw.h3`text-lg font-bold cursor-pointer flex justify-between items-center`;
	const NotasTextField = tw.textarea`w-full p-2 border rounded-lg mt-4`;
	const dispatch = useDispatch();
	const user = useSelector((state) => state.usuario);
	let clienteId = null;
	if (user.isLoggedIn) {
		clienteId = user.userInfo.id;
	}
	const usuarios = useSelector((state) => state.usuarios || []);
	const cartItems = useSelector((state) => state.carrito.items);
	const costoEnvio = useSelector((state) => state.carrito.costoEnvio);
	const comisionMP = useSelector((state) => state.carrito.comisionMP);
	const productos = useSelector((state) => state.productos);
	const packsRedux = useSelector((state) => state.packs);
	const [searchTermCliente, setSearchTermCliente] = useState('');
	const [searchEmail, setSearchEmail] = useState('');
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [openModalProduct, setOpenModalProduct] = useState(false);
	const [productToAdd, setProductToAdd] = useState(null);
	const [cantidadProduct, setCantidadProduct] = useState(1);
	const [adicionalProduct, setAdicionalProduct] = useState('');

	const notas = useSelector((state) => state.carrito.notas);

	const obtenerDescuentos = (item) => {
		if (item.tipo === 'producto') {
			const producto = productos.find((prod) => prod.id === item.id);
			return producto ? producto.descuentos || [] : [];
		} else if (item.tipo === 'pack') {
			const pack = packsRedux.find((pck) => pck.id === item.id);
			return pack ? pack.descuentos || [] : [];
		}
		return [];
	};

	const handleNotasChange = (event) => {
		dispatch(setNotas(event.target.value));
	};

	const calcularSubtotalItem = (item) => {
		const precioConDescuento = calcularPrecioConDescuento(item.precio, obtenerDescuentos(item));
		const adicionalCosto = item.adicional?.costoAdicional || 0;
		return (precioConDescuento + adicionalCosto) * item.cantidad;
	};

	const subtotal = cartItems.reduce((acc, item) => acc + calcularSubtotalItem(item), 0);
	const total = (subtotal + (costoEnvio > 0 ? costoEnvio : 0)) * (1 + (comisionMP > 0 ? comisionMP / 100 : 0));

	const handleOpen = (product) => {
		setSelectedProducts((prev) => [...prev, product]);
	};

	const [setDireccionSeleccionada] = useState(null);
	const handleDireccionSeleccionada = ({ direccion, coordenadas }) => {
		setDireccionSeleccionada({ direccion, coordenadas });
	};

	const fetchUsuarios = async () => {
		await obtenerUsuarios(dispatch, sessionStorage.getItem('token'));
	};

	useEffect(() => {
		try {
			obtenerProductos(dispatch);
			fetchUsuarios();
		} catch (e) {
			console.log(e);
		}
	}, [dispatch]);

	const filteredUsuarios = Array.isArray(usuarios)
		? usuarios.filter((usuario) => {
				return (
					usuario.rol_id === 4 && // Filtra solo los usuarios con rol_id igual a 4
					usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
					usuario.email.toLowerCase().includes(searchEmail.toLowerCase())
				);
		  })
		: [];

	const [clienteGenerico, setClienteGenerico] = useState(true); // Cliente genérico por defecto
	const [clienteGenericoNombre, setClienteGenericoNombre] = useState('');
	const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

	const handleSeleccionGenerico = (event) => {
		setClienteGenerico(event.target.checked);
		setClienteSeleccionado(null); // Desseleccionar cualquier cliente
	};

	const handleSeleccionCliente = (usuario) => {
		setClienteSeleccionado(usuario);
		setClienteGenerico(false); // Desactivar cliente genérico
	};

	const handleOpenProduct = (product) => {
		setProductToAdd(product);
		setOpenModalProduct(true);
	};

	const handleCloseProduct = () => {
		setOpenModalProduct(false);
		setProductToAdd(null);
		setCantidadProduct(1);
		setAdicionalProduct('');
	};

	const handleAddProduct = () => {
		if (productToAdd) {
			setSelectedProducts([...selectedProducts, { ...productToAdd, cantidadProduct, adicionalProduct }]);
		}
	};

	const handleAgregarACarrito = () => {
		if (adicionalProduct === null) {
			toast.error('Debe elegir un adicional.');
		} else {
			handleAddToCart(
				productToAdd,
				cantidadProduct,
				adicionalProduct,
				sessionStorage.getItem('token'),
				clienteId,
				'producto',
				dispatch,
			)
				.then(() => {
					toast.success('Producto agregado al carrito.');
				})
				.catch((e) => {
					console.log(e.message);
				});
		}
	};

	const handleRemoveProduct = (index) => {
		setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
	};

	const filteredProducts = productos.filter(
		(product) =>
			product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) &&
			(selectedCategory
				? product.categoria?.titulo?.toLowerCase().includes(selectedCategory.toLowerCase())
				: true),
	);

	return (
		<>
			<Header />
			<Container maxWidth="md" sx={{ marginTop: '180px', padding: '20px', borderRadius: '10px' }}>
				{/* Tabla de clientes */}
				<SectionTitle>Cliente</SectionTitle>
				<FormControlLabel
					control={<Checkbox checked={clienteGenerico} onChange={handleSeleccionGenerico} />}
					label="Usar cliente genérico"
				/>
				{clienteGenerico && (
					<TextField
						label="Nombre del cliente genérico"
						variant="outlined"
						fullWidth
						value={clienteGenericoNombre}
						onChange={(e) => setClienteGenericoNombre(e.target.value)}
						sx={{ marginBottom: 2 }}
					/>
				)}
				{!clienteGenerico && (
					<>
						<Box sx={{ marginBottom: 2, paddingBottom: 2, borderBottom: '2px solid #ccc' }}>
							<Grid container spacing={2} alignItems="center">
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										label="Buscar por nombre"
										variant="outlined"
										fullWidth
										value={searchTerm}
										onChange={(e) => setSearchTermCliente(e.target.value)}
									/>
								</Grid>

								<Grid item xs={12} sm={6} md={3}>
									<TextField
										label="Buscar por correo"
										variant="outlined"
										fullWidth
										value={searchEmail}
										onChange={(e) => setSearchEmail(e.target.value)}
									/>
								</Grid>
							</Grid>
						</Box>
						<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
							<Table>
								<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 1 }}>
									<TableRow>
										<TableCell>Nombre</TableCell>
										<TableCell>Correo</TableCell>
										<TableCell>Teléfono</TableCell>
										<TableCell>Acciones</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{filteredUsuarios.length > 0 ? (
										filteredUsuarios.map((usuario) => (
											<TableRow
												key={usuario.id}
												selected={clienteSeleccionado?.id === usuario.id}
											>
												<TableCell>{usuario.nombre}</TableCell>
												<TableCell>{usuario.email}</TableCell>
												<TableCell>{usuario.telefono}</TableCell>
												<TableCell>
													<Button
														variant="outlined"
														color="primary"
														onClick={() => handleSeleccionCliente(usuario)}
														sx={{ marginRight: 2 }}
													>
														Asignar
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={4} style={{ textAlign: 'center' }}>
												No hay clientes disponibles.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</>
				)}
				<Box mt={2}>
					{clienteGenerico ? (
						<p>
							Cliente seleccionado: <strong>{clienteGenericoNombre || 'Cliente Genérico'}</strong>
						</p>
					) : clienteSeleccionado ? (
						<p>
							Cliente seleccionado: <strong>{clienteSeleccionado.nombre}</strong>
						</p>
					) : (
						<p>No hay cliente seleccionado</p>
					)}
				</Box>

				{/* Productos */}
				<SectionTitle>Productos</SectionTitle>
				<Box sx={{ marginBottom: 2, paddingBottom: 2, borderBottom: '2px solid #ccc' }}>
					<Grid container spacing={2} alignItems="center">
						<Grid item xs={12} sm={6}>
							<TextField
								label="Buscar por titulo"
								variant="outlined"
								fullWidth
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Buscar por categoría"
								variant="outlined"
								fullWidth
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
							/>
						</Grid>
					</Grid>
				</Box>

				<TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
					<Table>
						<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 1 }}>
							<TableRow>
								<TableCell>Titulo</TableCell>
								<TableCell>Precio</TableCell>
								<TableCell>Categoría</TableCell>
								<TableCell>Acciones</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredProducts.length > 0 ? (
								filteredProducts.map((product) => (
									<TableRow key={product.id}>
										<TableCell>{product.titulo}</TableCell>
										<TableCell>{product.precio}</TableCell>
										<TableCell>{product.categoria?.titulo}</TableCell>
										<TableCell>
											<Button
												variant="outlined"
												color="primary"
												onClick={() => handleOpenProduct(product)}
											>
												Agregar
											</Button>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} align="center">
										No hay productos disponibles.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>

				<Dialog open={openModalProduct} onClose={openModalProduct && handleCloseProduct}>
					<DialogTitle>Seleccionar Cantidad y Adicionales</DialogTitle>
					<DialogContent>
						<TextField
							label="Cantidad"
							type="number"
							fullWidth
							value={cantidadProduct}
							onChange={(e) => setCantidadProduct(e.target.value)}
							sx={{ marginBottom: 2, marginTop: 2 }}
						/>
						<Select
							fullWidth
							value={adicionalProduct}
							onChange={(e) => setAdicionalProduct(e.target.value)}
							displayEmpty
						>
							<MenuItem value="">Sin adicional</MenuItem>
							<MenuItem value="extraQueso">Extra Queso</MenuItem>
							<MenuItem value="salsaEspecial">Salsa Especial</MenuItem>
						</Select>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseProduct} color="secondary">
							Cancelar
						</Button>
						<Button onClick={handleAgregarACarrito} color="primary">
							Agregar
						</Button>
					</DialogActions>
				</Dialog>

				<h3>Productos Seleccionados</h3>
				<TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Titulo</TableCell>
								<TableCell>Precio</TableCell>
								<TableCell>Cantidad</TableCell>
								<TableCell>Adicional</TableCell>
								<TableCell>Acciones</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{selectedProducts.map((product, index) => (
								<TableRow key={index}>
									<TableCell>{product.titulo}</TableCell>
									<TableCell>{product.precio}</TableCell>
									<TableCell>{product.cantidad}</TableCell>
									<TableCell>{product.adicional || 'Ninguno'}</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleRemoveProduct(index)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				{/* Dirección */}
				<SectionTitle>Dirección</SectionTitle>
				<MapComponent onDireccionSeleccionada={handleDireccionSeleccionada} />

				{/* Notas */}
				<SectionTitle>Notas</SectionTitle>
				<NotasTextField
					placeholder="Notas del Pedido: ej (no funciona el timbre)"
					rows={4}
					value={notas}
					onChange={handleNotasChange}
				/>

				{/* Resumen del pedido */}
				<SectionTitle>Resumen</SectionTitle>
				<Box sx={{ marginTop: 4 }}>
					<h3 tw="text-lg font-semibold">Resumen Total</h3>
					<p>Subtotal: ${subtotal.toFixed(2)}</p>
					<p>Total: ${total.toFixed(2)}</p>
				</Box>

				{/* Botón de finalizar */}
				<FinalizarCompraButton>Crear pedido</FinalizarCompraButton>
			</Container>
		</>
	);
};
