import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPermisos, addPermiso, updatePermiso, deletePermiso } from 'store/permisoSlice'; // Asegúrate de crear las acciones correspondientes en tu slice
import { crearPermiso } from 'scripts/crearPermiso'; // Función para crear permiso
import { actualizarPermiso } from 'scripts/actualizarPermiso'; // Función para actualizar permiso
import { borrarPermiso } from 'scripts/borrarPermiso'; // Función para eliminar permiso
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
import AddIcon from '@mui/icons-material/Add'; // Importamos el ícono "+" (Add)

const PermissionsManagement = () => {
	const [error, setError] = useState('');
	const dispatch = useDispatch();

	// Asegúrate de que `permisos` tenga un valor por defecto (un array vacío)
	const permisos = useSelector((state) => state.permisos || []); // Usamos un array vacío como valor por defecto

	const [open, setOpen] = useState(false);
	const [newPermiso, setNewPermiso] = useState({ id: null, nombre: '', descripcion: '' });
	const [searchTerm, setSearchTerm] = useState('');
	const [searchDescripcion, setSearchDescripcion] = useState('');

	useEffect(() => {
		setError(''); // Limpiamos el error
	}, [dispatch]);

	const handleOpen = (permiso = null) => {
		if (permiso) {
			setNewPermiso({ ...permiso });
		} else {
			setNewPermiso({ id: null, nombre: '', descripcion: '' });
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewPermiso({ ...newPermiso, [name]: value });
	};

	const handleSavePermiso = () => {
		if (newPermiso.nombre && newPermiso.descripcion) {
			if (newPermiso.id === null) {
				const permisoToAdd = { ...newPermiso };
				dispatch(addPermiso(permisoToAdd));

				crearPermiso(newPermiso.nombre, newPermiso.descripcion, sessionStorage.getItem('token'))
					.then((data) => {
						console.log('Permiso agregado:', data);
					})
					.catch((error) => {
						console.error('Error al crear el permiso:', error.message);
						setError(error.message);
					});
			} else {
				actualizarPermiso(
					newPermiso.id,
					newPermiso.nombre,
					newPermiso.descripcion,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						console.log('Permiso actualizado:', data);
					})
					.catch((error) => {
						console.error('Error al actualizar el permiso:', error.message);
						setError(error.message);
					});
				dispatch(updatePermiso(newPermiso));
			}

			setNewPermiso({ nombre: '', descripcion: '' });
			handleClose();
		} else {
			setError('Por favor, complete todos los campos.');
		}
	};

	const handleDelete = (id) => {
		borrarPermiso(id, sessionStorage.getItem('token'))
			.then((data) => {
				console.log('Permiso eliminado:', data);
			})
			.catch((error) => {
				console.error('Error al eliminar el permiso:', error.message);
				setError(error.message);
			});
		dispatch(deletePermiso(id));
	};

	// Filtramos permisos solo si permisos es un array (prevención de errores)
	const filteredPermisos =
		Array.isArray(permisos) ?
			permisos.filter((permiso) => {
				return (
					permiso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
					permiso.descripcion.toLowerCase().includes(searchDescripcion.toLowerCase())
				);
			})
		:	[];

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

					{/* Buscador por nombre */}
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
							value={searchDescripcion}
							onChange={(e) => setSearchDescripcion(e.target.value)}
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

			{/* Tabla de permisos con Scrollbar */}
			<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
				<Table>
					<TableHead sx={{ position: 'sticky', top: 0 }}>
						<TableRow>
							<TableCell>Nombre</TableCell>
							<TableCell>Descripción</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredPermisos.length > 0 ?
							filteredPermisos.map((permiso) => (
								<TableRow key={permiso.id}>
									<TableCell>{permiso.nombre}</TableCell>
									<TableCell>{permiso.descripcion}</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => handleOpen(permiso)}
											sx={{ marginRight: 2 }}
										>
											Editar
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleDelete(permiso.id)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))
						:	<TableRow>
								<TableCell colSpan={3} style={{ textAlign: 'center' }}>
									No hay permisos disponibles.
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Formulario para agregar o editar permiso */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{newPermiso.id ? 'Editar Permiso' : 'Agregar Permiso'}</DialogTitle>
				<DialogContent>
					<TextField
						label="Nombre"
						name="nombre"
						value={newPermiso.nombre}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						label="Descripción"
						name="descripcion"
						value={newPermiso.descripcion}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancelar
					</Button>
					<Button onClick={handleSavePermiso} color="primary">
						{newPermiso.id ? 'Guardar Cambios' : 'Agregar'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Mostrar errores */}
			{error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
		</div>
	);
};

export default PermissionsManagement;
