import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct, deleteProduct } from 'store/productoSlice';
import { crearProducto } from 'scripts/crearProducto';
import { actualizarProducto } from 'scripts/actualizarProducto';
import { borrarProducto } from 'scripts/borrarProducto';
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

const ProductManagement = () => {
	const [error, setError] = useState('');
	const dispatch = useDispatch();
	const productos = useSelector((state) => state.productos);
	const categorias = useSelector((state) => state.categorias);
	const fetchProductos = async () => {
		await obtenerProductos(dispatch);
	};
	const [open, setOpen] = useState(false);
	const [newProduct, setNewProduct] = useState({
		id: null,
		descripcion: '',
		precio: '',
		categoria: '',
		visible: true,
	});

	useEffect(() => {
		try {
			fetchProductos();
		} catch (e) {
			console.log(e);
		}
		setError('');
	}, []);

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');

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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewProduct({ ...newProduct, [name]: value });
	};

	const handleCategoryChange = (e) => {
		setNewProduct({ ...newProduct, categoria: e.target.value });
	};

	const handleOpen = (product = null) => {
		if (product) {
			setNewProduct({ ...product });
		} else {
			setNewProduct({
				id: null,
				descripcion: '',
				precio: '',
				categoria: '',
				visible: true,
				imagen: null,
			});
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSaveProduct = () => {
		if (newProduct.descripcion && newProduct.precio && newProduct.categoria) {
			if (newProduct.id === null) {
				crearProducto(
					newProduct.descripcion,
					newProduct.precio,
					newProduct.categoria,
					newProduct.visible,
					newProduct.imagen,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						if (data && data.id) {
							console.log('Producto creado:', data);
						} else {
							setError('Error al crear el producto en la base de datos.');
						}
					})
					.catch((error) => {
						console.error('Error al crear el producto:', error.message);
						setError(error.message);
					});
				fetchProductos();
			} else {
				actualizarProducto(
					newProduct.id,
					newProduct.descripcion,
					parseFloat(newProduct.precio),
					parseInt(newProduct.categoria),
					newProduct.visible,
					newProduct.imagen,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						console.log('Producto actualizado:', data);
					})
					.catch((error) => {
						console.error('Error al actualizar el producto:', error.message);
						setError(error.message);
					});
				fetchProductos();
			}
			setNewProduct({
				descripcion: '',
				precio: '',
				categoria: '',
				visible: true,
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
				console.log('Producto eliminado:', data);
			})
			.catch((error) => {
				console.error('Error al eliminar el producto:', error.message);
				setError(error.message);
			});
		dispatch(deleteProduct(id));
		fetchProductos();
	};

	const filteredProducts = productos.filter((product) => {
		const matchesSearchTerm = product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory
			? product.categoria?.titulo?.toLowerCase().includes(selectedCategory.toLowerCase())
			: true;
		const matchesMinPrice = minPrice ? product.precio >= minPrice : true;
		const matchesMaxPrice = maxPrice ? product.precio <= maxPrice : true;

		return matchesSearchTerm && matchesCategory && matchesMinPrice && matchesMaxPrice;
	});

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
					Descripción
					<TextField
						name="descripcion"
						variant="outlined"
						value={newProduct.descripcion}
						onChange={handleInputChange}
						fullWidth
						style={{ marginBottom: '10px' }}
					/>
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
					Categoría
					<TextField
						name="categoria"
						variant="outlined"
						value={newProduct.categoria}
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
					Imagen
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange} // Evento para manejar cambios
						style={{ marginBottom: '10px', display: 'block' }}
					/>
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
