import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategorias, addCategory, updateCategory, deleteCategory } from 'store/categoriaSlice';
import { crearCategoria } from 'scripts/crearCategoria';
import { actualizarCategoria } from 'scripts/actualizarCategoria';
import { borrarCategoria } from 'scripts/borrarCategoria';
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
	InputAdornment,
	Box,
	Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { obtenerCategorias } from 'scripts/obtenerCategorias';
import { toast } from 'react-toastify';
import CustomDialog from 'helpers/Dialog';

const CategoryManagement = () => {
	const dispatch = useDispatch();
	const categories = useSelector((state) => state.categorias);
	const fetchCategorias = async () => {
		obtenerCategorias(dispatch).catch((e) => {
			toast.error(e.message);
		});
	};

	const [open, setOpen] = useState(false);
	const [newCategory, setNewCategory] = useState({ id: null, titulo: '', descripcion: '' });
	const [searchTerm, setSearchTerm] = useState('');
	const [searchDescription, setSearchDescription] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [id, setId] = useState(null);

	const handleOpenDialog = (id) => {
		setId(id);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setId(null);
		setDialogOpen(false);
	};

	const handleConfirmDialog = () => {
		borrarCategoria(id, sessionStorage.getItem('token'))
			.then((data) => {
				toast.success('Categoría eliminada correctamente.');
				fetchCategorias();
			})
			.catch((error) => {
				toast.error('Error al eliminar la categoria.');
			});
		setDialogOpen(false);
	};

	useEffect(() => {
		try {
			fetchCategorias();
		} catch (e) {
			console.log(e);
		}
	}, []);

	const handleOpen = (category = null) => {
		if (category) {
			setNewCategory({ ...category });
		} else {
			setNewCategory({ id: null, titulo: '', descripcion: '' });
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewCategory({ ...newCategory, [name]: value });
	};

	const handleSaveCategory = () => {
		if (newCategory.titulo && newCategory.descripcion) {
			if (newCategory.id === null) {
				crearCategoria(newCategory.titulo, newCategory.descripcion, sessionStorage.getItem('token'))
					.then((data) => {
						toast.success('Categoría creada correctamente.');
						fetchCategorias();
					})
					.catch((error) => {
						toast.error('Error al crear la categoria.');
					});
			} else {
				actualizarCategoria(
					newCategory.id,
					newCategory.titulo,
					newCategory.descripcion,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						toast.success('Categoría actualizada correctamente.');
						fetchCategorias();
					})
					.catch((error) => {
						toast.error('Error al actualizar la categoria.');
					});
			}
			setNewCategory({ titulo: '', descripcion: '' });
			handleClose();
		} else {
			toast.error('Por favor, complete todos los campos.');
		}
	};

	const filteredCategories = categories.filter((category) => {
		return (
			category.titulo.toLowerCase().includes(searchTerm.toLowerCase()) &&
			category.descripcion.toLowerCase().includes(searchDescription.toLowerCase())
		);
	});

	return (
		<div style={{ marginTop: '20px' }}>
			{/* Barra de búsqueda y botón "Agregar" */}
			<Box sx={{ marginBottom: 2, paddingBottom: 2, borderBottom: '2px solid #ccc' }}>
				<Grid container spacing={2} alignItems="center">
					{/* Coloca el botón de agregar a la izquierda */}
					<Grid item xs={12} sm={2} md={1}>
						<Button variant="contained" color="success" onClick={() => handleOpen()}>
							<AddIcon />
						</Button>
					</Grid>

					{/* Buscador por título */}
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Buscar por nombre"
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

					{/* Buscador por descripción */}
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Buscar por descripción"
							variant="outlined"
							fullWidth
							value={searchDescription}
							onChange={(e) => setSearchDescription(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
				</Grid>
			</Box>

			{/* Tabla de categorías con Scrollbar */}
			<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
				<Table>
					<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 1 }}>
						<TableRow>
							<TableCell>Nombre</TableCell>
							<TableCell>Descripción</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredCategories.length > 0 ? (
							filteredCategories.map((category) => (
								<TableRow key={category.id}>
									<TableCell>{category.titulo}</TableCell>
									<TableCell>{category.descripcion}</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => handleOpen(category)}
											sx={{ marginRight: 2 }}
										>
											Editar
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleOpenDialog(category.id)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={3} style={{ textAlign: 'center' }}>
									No hay categorías disponibles.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Formulario para agregar o editar categoría */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{newCategory.id ? 'Editar Categoría' : 'Agregar Categoría'}</DialogTitle>
				<DialogContent>
					Titulo
					<TextField
						name="titulo"
						value={newCategory.titulo}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Descripción
					<TextField
						name="descripcion"
						value={newCategory.descripcion}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancelar
					</Button>
					<Button onClick={handleSaveCategory} color="primary">
						{newCategory.id ? 'Guardar Cambios' : 'Agregar'}
					</Button>
				</DialogActions>
			</Dialog>
			<CustomDialog
				open={dialogOpen}
				title="Confirmar eliminación"
				content="¿Está seguro de que desea eliminar esta categoría?"
				onClose={handleCloseDialog}
				onConfirm={handleConfirmDialog}
			/>
		</div>
	);
};

export default CategoryManagement;
