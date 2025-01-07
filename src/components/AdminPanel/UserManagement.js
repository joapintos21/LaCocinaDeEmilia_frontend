import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUsuario, updateUsuario, deleteUsuario } from 'store/usuariosSlice'; // Asegúrate de que las acciones estén correctamente definidas en el slice
import { crearUsuario } from 'scripts/crearUsuario';
import { actualizarUsuario } from 'scripts/actualizarUsuario';
import { borrarUsuario } from 'scripts/borrarUsuario';
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
import { obtenerUsuarios } from 'scripts/obtenerUsuarios';
import { obtenerRolesUsuario } from 'scripts/obtenerRolesUsuario';

const UserManagement = () => {
	const [error, setError] = useState('');
	const dispatch = useDispatch();
	const fetchUsuarios = async () => {
		await obtenerUsuarios(dispatch, sessionStorage.getItem('token'));
	};
	const fetchRolesUsuario = async () => {
		await obtenerRolesUsuario(dispatch, sessionStorage.getItem('token'));
	};
	const usuarios = useSelector((state) => state.usuarios || []);
	const roles = useSelector((state) => state.rolesUsuario || []);

	const [open, setOpen] = useState(false);
	const [newUsuario, setNewUsuario] = useState({
		id: null,
		nombre: '',
		password: '',
		email: '',
		telefono: '',
		rol: '',
		status: '',
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [searchEmail, setSearchEmail] = useState('');

	useEffect(() => {
		try {
			fetchUsuarios();
			fetchRolesUsuario();
		} catch (e) {
			console.log(e);
		}
		setError('');
	}, [dispatch]);

	const handleOpen = (usuario = null) => {
		setNewUsuario(
			usuario
				? { ...usuario }
				: {
						id: null,
						nombre: '',
						password: '',
						email: '',
						telefono: '',
						rol: '',
						status: '',
				  },
		);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewUsuario({ ...newUsuario, [name]: value });
	};

	const handleSaveUsuario = () => {
		if (newUsuario.nombre && newUsuario.email && newUsuario.telefono && newUsuario.rol) {
			if (newUsuario.id === null) {
				const usuarioToAdd = { ...newUsuario };
				dispatch(addUsuario(usuarioToAdd));

				crearUsuario(
					newUsuario.email,
					newUsuario.password,
					newUsuario.nombre,
					newUsuario.telefono,
					newUsuario.rol,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						console.log('Usuario agregado:', data);
						fetchUsuarios();
						fetchRolesUsuario();
					})
					.catch((error) => {
						console.error('Error al crear el usuario:', error.message);
						setError(error.message);
					});
			} else {
				if (newUsuario.status) {
					actualizarUsuario(
						newUsuario.id,
						newUsuario.telefono,
						newUsuario.nombre,
						newUsuario.email,
						newUsuario.rol,
						newUsuario.status,
						sessionStorage.getItem('token'),
					)
						.then((data) => {
							fetchUsuarios();
							fetchRolesUsuario();
							console.log('Usuario actualizado:', data);
						})
						.catch((error) => {
							console.error('Error al actualizar el usuario:', error.message);
							setError(error.message);
						});
					dispatch(updateUsuario(newUsuario));
				} else {
					setError('Por favor, complete todos los campos.');
				}
			}

			setNewUsuario({
				nombre: '',
				password: '',
				email: '',
				telefono: '',
				rol: '',
				status: '',
			});
			handleClose();
		} else {
			setError('Por favor, complete todos los campos.');
		}
	};

	const handleDelete = (id) => {
		borrarUsuario(id, sessionStorage.getItem('token'))
			.then((data) => {
				fetchUsuarios();
				fetchRolesUsuario();
				console.log('Usuario eliminado:', data);
			})
			.catch((error) => {
				console.error('Error al eliminar el usuario:', error.message);
				setError(error.message);
			});
		dispatch(deleteUsuario(id));
	};

	const filteredUsuarios = Array.isArray(usuarios)
		? usuarios.filter((usuario) => {
				return (
					usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
					usuario.email.toLowerCase().includes(searchEmail.toLowerCase())
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

					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Buscar por correo"
							variant="outlined"
							fullWidth
							value={searchEmail}
							onChange={(e) => setSearchEmail(e.target.value)}
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

			{/* Tabla de usuarios */}
			<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
				<Table>
					<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF' }}>
						<TableRow>
							<TableCell>Nombre</TableCell>
							<TableCell>Correo</TableCell>
							<TableCell>Telefono</TableCell>
							<TableCell>Rol</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredUsuarios.length > 0 ? (
							filteredUsuarios.map((usuario) => (
								<TableRow key={usuario.id}>
									<TableCell>{usuario.nombre}</TableCell>
									<TableCell>{usuario.email}</TableCell>
									<TableCell>{usuario.telefono}</TableCell>
									<TableCell>{usuario.rol}</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => handleOpen(usuario)}
											sx={{ marginRight: 2 }}
										>
											Editar
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleDelete(usuario.id)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={3} style={{ textAlign: 'center' }}>
									No hay usuarios disponibles.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Formulario de usuario */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{newUsuario.id ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
				<DialogContent>
					{/* Campo de nombre */}
					Nombre y apellido
					<TextField
						name="nombre"
						value={newUsuario.nombre}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					{/* Campo de correo */}
					Correo
					<TextField
						name="email"
						value={newUsuario.email}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					{/* Campos de contraseña y teléfono: solo visibles si el usuario está siendo creado */}
					{!newUsuario.id && (
						<>
							{/* Campo de contraseña */}
							Contraseña
							<TextField
								name="password"
								type="password"
								value={newUsuario.password}
								onChange={handleInputChange}
								fullWidth
								sx={{ marginBottom: 2 }}
							/>
						</>
					)}
          {/* Campo de teléfono */}
							Teléfono
							<TextField
								name="telefono"
								type="number"
								value={newUsuario.telefono}
								onChange={handleInputChange}
								fullWidth
								sx={{ marginBottom: 2 }}
							/>
					{/* Campo de rol */}
					Rol
					<TextField
						name="rol"
						variant="outlined"
						value={newUsuario.rol}
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
					{/* Campo de estado */}
					Estado
					<TextField
						name="status"
						variant="outlined"
						value={newUsuario.status}
						onChange={handleInputChange}
						fullWidth
						select
						SelectProps={{
							native: true,
						}}
						style={{ marginBottom: '10px' }}
					>
						<option value="">Seleccionar estado</option>
						<option value={'activo'}>Activo</option>
						<option value={'pendiente'}>Pendiente</option>
					</TextField>
				</DialogContent>

				{/* Botones de acción */}
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancelar
					</Button>
					<Button onClick={handleSaveUsuario} color="primary">
						{newUsuario.id ? 'Guardar Cambios' : 'Agregar'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Mostrar errores */}
			{error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
		</div>
	);
};

export default UserManagement;
