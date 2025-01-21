import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct, deleteProduct } from 'store/productoSlice';
import { crearProducto } from 'scripts/crearProducto';
import { actualizarProducto } from 'scripts/actualizarProducto';
import { borrarProducto } from 'scripts/borrarProducto';
import { asociarProductoDescuento } from 'scripts/asociarProductoDescuento';
import { obtenerProductos } from 'scripts/obtenerProductosCategoria';
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
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Box,
	Grid,
	InputAdornment,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { obtenerTodosAdicionales } from 'scripts/obtenerTodosAdicionales';
import { obtenerDescuentos } from 'scripts/obtenerDescuentos';
import { mostrarValorDescuento } from 'utils/descuentosUtils';

const ProductManagement = () => {
	const [error, setError] = useState('');
	const dispatch = useDispatch();
	const [descuentosSeleccionados, setDescuentosSeleccionados] = useState([]);
	const productos = useSelector((state) => state.productos);
	const categorias = useSelector((state) => state.categorias);
	const adicionales = useSelector((state) => state.gestionAdicionales || []);
	const descuentos = useSelector((state) => state.descuentos || []);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [searchDescuentos, setSearchDescuentos] = useState('');
	const [open, setOpen] = useState(false);
	const [newProduct, setNewProduct] = useState({
		id: null,
		descripcion: '',
		precio: '',
		categoria: { id: '' },
		visible: true,
		adicionales: [],
		imagen: '',
	});

	const fetchProductos = async () => {
		await obtenerProductos(dispatch);
	};
	const fetchAdicionales = async () => {
		await obtenerTodosAdicionales(dispatch, sessionStorage.getItem('token'));
	};
	const fetchDescuentos = async () => {
		await obtenerDescuentos(dispatch, sessionStorage.getItem('token'));
	};
	
	useEffect(() => {
		try {
			fetchProductos();
			fetchAdicionales();
			fetchDescuentos();
		} catch (e) {
			console.log(e);
		}
	}, [dispatch]);

	const filteredDescuentos = descuentos.filter((descuento) =>
		descuento.descripcion.toLowerCase().includes(searchDescuentos.toLowerCase()),
	);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setNewProduct((prevState) => ({
					...prevState,
					imagen: reader.result.split(',')[1],
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDescuentoChange = (id) => {
		if (descuentosSeleccionados.includes(id)) {
			setDescuentosSeleccionados((prev) => prev.filter((descuentoId) => descuentoId !== id));
		} else {
			setDescuentosSeleccionados((prev) => [...prev, id]);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewProduct({ ...newProduct, [name]: value });
	};

	const handleCategoryChange = (e) => {
		const selectedCategory = categorias.find((categoria) => categoria.id === parseInt(e.target.value));
		setNewProduct({ ...newProduct, categoria: selectedCategory });
	};

	const handleOpen = (product = null) => {
		if (product) {
			setNewProduct({ ...product });
		} else {
			setNewProduct({
				descripcion: '',
				precio: '',
				categoria: { id: '' },
				adicionales: [],
				visible: 'true',
				imagen: null,
			});
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleAdicionalChange = (id) => {
		if (newProduct.adicionales.includes(id)) {
			setNewProduct((prevState) => ({
				...prevState,
				adicionales: prevState.adicionales.filter((adicionalId) => adicionalId !== id),
			}));
		} else {
			setNewProduct((prevState) => ({
				...prevState,
				adicionales: [...prevState.adicionales, id],
			}));
		}
	};

	const handleSaveProduct = () => {
		if (newProduct.descripcion && newProduct.precio && newProduct.categoria) {
			if (newProduct.id === null) {
				crearProducto(
					newProduct.descripcion,
					newProduct.precio,
					parseInt(newProduct.categoria.id),
					newProduct.visible,
					newProduct.imagen,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						if (data && data.id) {
							fetchProductos();
							setError('');
						} else {
							setError('Error al crear el producto en la base de datos.');
						}
					})
					.catch((error) => {
						setError('Error al crear el producto:');
					});
			} else {
				actualizarProducto(
					newProduct.id,
					newProduct.descripcion,
					parseFloat(newProduct.precio),
					parseInt(newProduct.categoria.id),
					newProduct.visible,
					newProduct.imagen,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						fetchProductos();
						setError('');
					})
					.catch((error) => {
						setError('Error al actualizar el producto:');
					});

				// Asociar los descuentos seleccionados
				if(0 < descuentosSeleccionados.length){
					const productId = newProduct.id;
					for(var i = 0; i < descuentosSeleccionados.length; i+=1){
						asociarProductoDescuento(descuentosSeleccionados[i], productId, sessionStorage.getItem('token')).then((data) => {
							fetchProductos();
							setError('');
						})
						.catch((error) => {
							setError('Error al asociar el descuento al producto.');
						});;
					}
					fetchProductos();
				}
			}
			setNewProduct({
				descripcion: '',
				precio: '',
				categoria: '',
				visible: 'true',
				imagen: null,
			});
			handleClose();
		} else {
			setError('Por favor, complete todos los campos.');
		}
	};

	const handleDelete = (id) => {
		borrarProducto(id, sessionStorage.getItem('token'))
			.then((data) => {
				setError('');
			})
			.catch((error) => {
				setError('Error al eliminar el producto:');
			});
		fetchProductos();
	};

	const [searchAdicionales, setSearchAdicionales] = useState('');

	const filteredAdicionales = adicionales.filter((adicional) =>
		adicional.descripcion.toLowerCase().includes(searchAdicionales.toLowerCase()),
	);

	const filteredProducts = productos.filter((product) => {
		const matchesSearchTerm = product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory
			? product.categoria?.titulo?.toLowerCase().includes(selectedCategory.toLowerCase())
			: true;
		const matchesMinPrice = minPrice ? product.precio >= minPrice : true;
		const matchesMaxPrice = maxPrice ? product.precio <= maxPrice : true;

		return matchesSearchTerm && matchesCategory && matchesMinPrice && matchesMaxPrice;
	});

	const adicionalesSeleccionados = Array.isArray(newProduct.adicionales) ? newProduct.adicionales : [];

	return (
		<div style={{ marginTop: '20px' }}>
			{/* Filtros y búsqueda */}
			<Box
				sx={{
					marginBottom: 2,
					paddingBottom: 2,
					borderBottom: '2px solid #ccc',
					position: 'relative',
				}}
			>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} sm={2} md={1} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
						<Button variant="contained" color="success" onClick={() => handleOpen()}>
							<AddIcon />
						</Button>
					</Grid>
					{/* Barra de búsqueda por descripción */}
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Buscar por descripción"
							variant="outlined"
							fullWidth
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					{/* Buscador por categoría */}
					<Grid item xs={12} sm={4} md={3}>
						<TextField
							label="Buscar por categoría"
							variant="outlined"
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							fullWidth
						/>
					</Grid>
					{/* Filtros de precios */}
					<Grid item xs={12} sm={3} md={2}>
						<TextField
							label="Precio mínimo"
							type="number"
							variant="outlined"
							value={minPrice}
							onChange={(e) => setMinPrice(e.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={3} md={2}>
						<TextField
							label="Precio máximo"
							type="number"
							variant="outlined"
							value={maxPrice}
							onChange={(e) => setMaxPrice(e.target.value)}
							fullWidth
						/>
					</Grid>
				</Grid>
			</Box>

			{/* Tabla de productos */}
			<TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
				<Table>
					<TableHead
						sx={{
							position: 'sticky',
							top: 0,
							backgroundColor: '#FFFFFF',
							zIndex: 1,
						}}
					>
						<TableRow>
							<TableCell>Descripción</TableCell>
							<TableCell>Precio</TableCell>
							<TableCell>Categoría</TableCell>
							<TableCell>Visible</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredProducts.length > 0 ? (
							filteredProducts.map((product) => (
								<TableRow key={product.id}>
									<TableCell>{product.descripcion}</TableCell>
									<TableCell>{product.precio}</TableCell>
									<TableCell>{product.categoria?.titulo}</TableCell>
									<TableCell>{product.visible ? 'Sí' : 'No'}</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											sx={{ marginRight: 2 }}
											color="primary"
											onClick={() => handleOpen(product)}
										>
											Editar
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleDelete(product.id)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} style={{ textAlign: 'center' }}>
									No hay productos disponibles.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Diálogo para agregar/editar producto */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{newProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
				<DialogContent>
					{/* Descripción */}
					Descripción
					<TextField
						name="descripcion"
						variant="outlined"
						value={newProduct.descripcion}
						onChange={handleInputChange}
						fullWidth
						style={{ marginBottom: '10px' }}
					/>
					{/* Precio */}
					Precio
					<TextField
						name="precio"
						variant="outlined"
						value={newProduct.precio}
						onChange={handleInputChange}
						fullWidth
						type="number"
						style={{ marginBottom: '10px' }}
					/>
					{/* Categoría */}
					Categoría
					<TextField
						name="categoria"
						variant="outlined"
						value={newProduct.categoria.id}
						onChange={handleCategoryChange}
						fullWidth
						select
						SelectProps={{
							native: true,
						}}
						style={{ marginBottom: '10px' }}
					>
						<option value="">Seleccionar categoría</option>
						{categorias.map((categoria) => (
							<option key={categoria.id} value={categoria.id}>
								{categoria.titulo}
							</option>
						))}
					</TextField>
					
					{newProduct.id && (
						<>
							{/* Lista de adicionales: Solo disponible en caso de actualizar producto */}
							Adicionales
							<Box style={{ marginTop: '10px', marginBottom: '10px' }}>
								<TextField
									variant="outlined"
									fullWidth
									placeholder="Buscar adicionales..."
									onChange={(e) => setSearchAdicionales(e.target.value)}
									value={searchAdicionales}
									style={{ marginBottom: '10px' }}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon />
											</InputAdornment>
										),
									}}
								/>
								<Box
									style={{
										border: '1px solid #ccc',
										borderRadius: '8px',
										padding: '10px',
										maxHeight: '200px',
										overflowY: 'auto',
										backgroundColor: '#f9f9f9',
									}}
								>
									{filteredAdicionales.length > 0 ? (
										filteredAdicionales.map((adicional) => (
											<Box
												key={adicional.id}
												style={{
													display: 'flex',
													alignItems: 'center',
													marginBottom: '5px',
													padding: '5px',
													borderBottom: '1px solid #e0e0e0',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															checked={adicionalesSeleccionados.includes(adicional.id)}
															onChange={() => handleAdicionalChange(adicional.id)}
															color="primary"
														/>
													}
													label={adicional.descripcion}
												/>
											</Box>
										))
									) : (
										<p style={{ textAlign: 'center', color: '#888' }}>
											No hay adicionales disponibles.
										</p>
									)}
								</Box>
							</Box>
							{/* Lista de descuentos: Solo disponible en caso de actualizar producto  */}
							Descuentos
							<Box style={{ marginTop: '10px', marginBottom: '10px' }}>
								<TextField
									variant="outlined"
									fullWidth
									placeholder="Buscar descuentos..."
									onChange={(e) => setSearchDescuentos(e.target.value)}
									value={searchDescuentos}
									style={{ marginBottom: '10px' }}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon />
											</InputAdornment>
										),
									}}
								/>
								<Box
									style={{
										border: '1px solid #ccc',
										borderRadius: '8px',
										padding: '10px',
										maxHeight: '200px',
										overflowY: 'auto',
										backgroundColor: '#f9f9f9',
									}}
								>
									{filteredDescuentos.length > 0 ? (
										filteredDescuentos.map((descuento) => (
											<Box
												key={descuento.id}
												style={{
													display: 'flex',
													alignItems: 'center',
													marginBottom: '5px',
													padding: '5px',
													borderBottom: '1px solid #e0e0e0',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															checked={descuentosSeleccionados.includes(descuento.id)}
															onChange={() => handleDescuentoChange(descuento.id)}
															color="primary"
														/>
													}
													label={`${descuento.descripcion} - (Valor: ${mostrarValorDescuento(
														descuento.valor,
														descuento.tipo,
													)})`}
												/>
											</Box>
										))
									) : (
										<p style={{ textAlign: 'center', color: '#888' }}>
											No hay descuentos disponibles.
										</p>
									)}
								</Box>
							</Box>
						</>
					)}
					{/* Imagen */}
					Imagen
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange} // Evento para manejar cambios
						style={{ marginBottom: '10px', display: 'block' }}
					/>
					{/* Visible */}
					<FormControlLabel
						control={
							<Checkbox
								checked={newProduct.visible}
								onChange={(e) => setNewProduct({ ...newProduct, visible: e.target.checked })}
								color="primary"
							/>
						}
						label="Visible"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancelar
					</Button>
					<Button onClick={handleSaveProduct} color="primary">
						{newProduct.id ? 'Guardar cambios' : 'Agregar producto'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ProductManagement;
