import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPermisos, addPermiso, updatePermiso, deletePermiso } from 'store/gestionPermisosSlice'; // Asegúrate de crear las acciones correspondientes en tu slice
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
import AddIcon from '@mui/icons-material/Add';
import { obtenerPermisos } from 'scripts/obtenerPermisos';
import { obtenerRolesUsuario } from 'scripts/obtenerRolesUsuario';
import CustomDialog from 'helpers/Dialog';
import { toast } from 'react-toastify';

const PermissionsManagement = () => {
	const dispatch = useDispatch();
	const fetchPermisos = async () => {
		await obtenerPermisos(dispatch, sessionStorage.getItem('token'));
	};
	const fetchRolesUsuario = async () => {
		await obtenerRolesUsuario(dispatch, sessionStorage.getItem('token'));
	};

	const [open, setOpen] = useState(false);
	const [newPermiso, setNewPermiso] = useState({
		id: null,
		endpoint: null,
		tipo: null,
		rol_id: null,
	});
	const [searchEndpoint, setSearchEndpoint] = useState('');
	const [searchTipo] = useState('');

	useEffect(() => {
		try {
			fetchPermisos();
			fetchRolesUsuario();
		} catch (e) {
			console.log(e);
		}
	}, [dispatch]);

	const permisos = useSelector((state) => state.gestionPermisos || []);
	const roles = useSelector((state) => state.rolesUsuario || []);

	const handleOpen = (permiso = null) => {
		if (permiso) {
			setNewPermiso({
				id: permiso.id || null,
				endpoint: permiso.endpoint || '',
				tipo: permiso.tipo || '',
				rol_id: permiso.rol_id || '',
			});
		} else {
			setNewPermiso({ id: null, endpoint: '', tipo: '', rol_id: '' });
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
		if (newPermiso.endpoint && newPermiso.tipo && newPermiso.rol_id) {
			if (newPermiso.id === null) {
				crearPermiso(
					newPermiso.endpoint,
					newPermiso.tipo.toUpperCase(),
					newPermiso.rol_id,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						toast.success('Permiso creado correctamente.');
						fetchPermisos();
						fetchRolesUsuario();
					})
					.catch((error) => {
						toast.error('Error al crear el permiso.');
					});
			} else {
				actualizarPermiso(
					newPermiso.id,
					newPermiso.endpoint,
					newPermiso.tipo.toUpperCase(),
					newPermiso.rol_id,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						toast.success('Permiso actualizado correctamente.');
						fetchPermisos();
						fetchRolesUsuario();
					})
					.catch((error) => {
						toast.error('Error al actualizar el permiso.');
					});
			}

			setNewPermiso({ endpoint: '', tipo: '', rol_id: '' });
			handleClose();
		} else {
			toast.error('Por favor, complete todos los campos.');
		}
	};

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
		borrarPermiso(id, sessionStorage.getItem('token'))
			.then((data) => {
				toast.success('Permiso eliminado correctamente.');
				fetchPermisos();
				fetchRolesUsuario();
			})
			.catch((error) => {
				toast.error('Error al eliminar el permiso.');
			});
		setId(null);
		setDialogOpen(false);
	};

	const filteredPermisos = Array.isArray(permisos)
		? permisos.filter((permiso) => {
				return (
					permiso.endpoint.toLowerCase().includes(searchEndpoint.toLowerCase()) &&
					permiso.tipo.toLowerCase().includes(searchTipo.toLowerCase())
				);
		  })
		: [];

	return (
		<div style={{ marginTop: '20px' }}>
			<Box
				sx={{
					marginBottom: 2,
					paddingBottom: 2,
					borderBottom: '2px solid #ccc',
				}}
			>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} sm={2} md={1}>
						<Button variant="contained" color="success" onClick={() => handleOpen()}>
							<AddIcon />
						</Button>
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Buscar por permiso"
							variant="outlined"
							fullWidth
							value={searchEndpoint}
							onChange={(e) => setSearchEndpoint(e.target.value)}
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

			<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
				<Table>
					<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 1 }}>
						<TableRow>
							<TableCell>Permiso</TableCell>
							<TableCell>Tipo</TableCell>
							<TableCell>Rol</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredPermisos.length > 0 ? (
							filteredPermisos.map((permiso) => (
								<TableRow key={permiso.id}>
									<TableCell>{permiso.endpoint}</TableCell>
									<TableCell>{permiso.tipo}</TableCell>
									<TableCell>{permiso.rol}</TableCell>
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
											onClick={() => handleOpenDialog(permiso.id)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={3} style={{ textAlign: 'center' }}>
									No hay permisos disponibles.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{newPermiso.id ? 'Editar Permiso' : 'Agregar Permiso'}</DialogTitle>
				<DialogContent>
					Permiso
					<TextField
						name="endpoint"
						variant="outlined"
						value={newPermiso.endpoint != null ? newPermiso.endpoint.toLowerCase() : newPermiso.endpoint}
						onChange={handleInputChange}
						fullWidth
						select
						SelectProps={{
							native: true,
						}}
						style={{ marginBottom: '10px' }}
					>
						<option value="">Seleccionar permiso</option>
						<option value={'carrito'}>Carrito</option>
						<option value={'usuarios'}>Usuarios</option>
						<option value={'packs'}>Packs</option>
						<option value={'descuentos'}>Descuentos</option>
						<option value={'direcciones'}>Direcciones</option>
						<option value={'categorias'}>Categorias</option>
						<option value={'pedidos'}>Pedidos</option>
						<option value={'permisos'}>Permisos</option>
						<option value={'adicionales'}>Adicionales</option>
						<option value={'pagos'}>Pagos</option>
						<option value={'productos'}>Productos</option>
					</TextField>
					Tipo de permiso
					<TextField
						name="tipo"
						variant="outlined"
						value={newPermiso.tipo}
						onChange={handleInputChange}
						fullWidth
						select
						SelectProps={{
							native: true,
						}}
						style={{ marginBottom: '10px' }}
					>
						<option value="">Seleccionar tipo de permiso</option>
						<option value={'Escritura'}>Escritura</option>
						<option value={'Lectura'}>Lectura</option>
					</TextField>
					Rol
					<TextField
						name="rol_id"
						variant="outlined"
						value={newPermiso.rol_id}
						onChange={handleInputChange}
						fullWidth
						select
						SelectProps={{
							native: true,
						}}
						style={{ marginBottom: '10px' }}
					>
						<option value="">Seleccionar rol</option>
						{roles.map((rol) => (
							<option key={rol.id} value={rol.id}>
								{rol.nombre}
							</option>
						))}
					</TextField>
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

			<CustomDialog
				open={dialogOpen}
				title="Confirmar eliminación"
				content="¿Está seguro de que desea eliminar este permiso?"
				onClose={handleCloseDialog}
				onConfirm={handleConfirmDialog}
			/>
		</div>
	);
};

export default PermissionsManagement;
