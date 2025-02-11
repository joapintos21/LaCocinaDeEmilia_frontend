import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { obtenerTiposDescuento } from 'scripts/obtenerTiposDescuento';
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
import { mostrarValorDescuento } from 'utils/descuentosUtils';
import { toast } from 'react-toastify';
import CustomDialog from 'helpers/Dialog';
import { obtenerCupones } from 'scripts/obtenerCupones';
import { crearCupon } from 'scripts/crearCupon';
import { obtenerUsuarios } from 'scripts/obtenerUsuarios';
import { actualizarCupon } from 'scripts/actualizarCupon';
import { borrarCupon } from 'scripts/borrarCupon';

const CuponesManagement = () => {
	const dispatch = useDispatch();
	const fetchCupones = async () => {
		obtenerCupones(dispatch, sessionStorage.getItem('token')).catch((e) => {
			toast.error(e.message);
		});
	};
	const fetchTiposDescuento = async () => {
		obtenerTiposDescuento(dispatch, sessionStorage.getItem('token')).catch((e) => {
			toast.error(e.message);
		});
	};
	const fetchUsuarios = async () => {
		obtenerUsuarios(dispatch, sessionStorage.getItem('token')).catch((e) => {
			toast.error(e.message);
		});
	};
	const [open, setOpen] = useState(false);
	const [newCupon, setNewCupon] = useState({
		id: null,
		nutricionista_id: null,
		codigo: '',
		tipoDescuento: null,
		valor: null,
		fechainicio: null,
		fechafin: null,
		descripcion: '',
	});
	const [searchDescripcion, setSearchDescripcion] = useState('');

	useEffect(() => {
		try {
			fetchCupones();
			fetchTiposDescuento();
			fetchUsuarios();
		} catch (e) {
			console.log(e);
		}
	}, []);

	const cupones = useSelector((state) => state.cupones || []);
	const tiposDescuento = useSelector((state) => state.tiposDescuento || []);
	const usuarios = useSelector((state) => state.usuarios || []);

	const nutricionistas = usuarios.filter((user) => user.rol_id === 5);

	const [searchNutricionistas, setSearchNutricionistas] = useState('');

	const filteredNutricionistas = nutricionistas.filter((nutri) =>
		nutri.nombre.toLowerCase().includes(searchNutricionistas.toLowerCase()),
	);

	const handleOpen = (cupon = null) => {
		const tipoId =
			cupon && cupon.descuento.tipo
				? tiposDescuento.find((tipo) => tipo.nombre === cupon.descuento.tipo)?.id
				: null;

		setNewCupon(
			cupon
				? {
						id: cupon.id,
						nutricionista_id: cupon.nutricionista_id,
						codigo: cupon.codigo,
						tipoDescuento: tipoId,
						valor: cupon.descuento.valor,
						fechainicio: cupon.descuento.fechainicio,
						fechafin: cupon.descuento.fechafin,
						descripcion: cupon.descuento.descripcion,
				  }
				: {
						id: null,
						nutricionista_id: null,
						codigo: '',
						tipoDescuento: null,
						valor: null,
						fechainicio: null,
						fechafin: null,
						descripcion: '',
				  },
		);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewCupon({ ...newCupon, [name]: value.toUpperCase() });
	};

	const handleSaveCupon = () => {
		if (newCupon.tipoDescuento && newCupon.valor && newCupon.fechainicio && newCupon.fechafin && newCupon.codigo) {
			if (newCupon.id === null) {
				crearCupon(
					newCupon.nutricionista_id,
					newCupon.codigo,
					newCupon.tipoDescuento,
					newCupon.valor,
					newCupon.fechainicio,
					newCupon.fechafin,
					newCupon.descripcion,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						toast.success('Cupon creado correctamente.');
						fetchCupones();
					})
					.catch((error) => {
						toast.error('Error al crear el cupon.');
					});
			} else {
				actualizarCupon(
					newCupon.id,
					newCupon.tipoDescuento,
					newCupon.valor,
					newCupon.fechainicio,
					newCupon.fechafin,
					newCupon.codigo,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						toast.success('Cupon actualizado correctamente.');
						fetchCupones();
					})
					.catch((error) => {
						toast.error('Error al actualizar el cupon.');
					});
			}

			setNewCupon({
				nutricionista_id: null,
				codigo: '',
				descuento: {
					valor: 0,
					fechainicio: null,
					fechafin: null,
					descripcion: '',
					tipoDescuento: null,
				},
			});
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
		borrarCupon(id, sessionStorage.getItem('token'))
			.then((data) => {
				toast.success('Cupon eliminado correctamente.');
				fetchCupones();
			})
			.catch((error) => {
				toast.error('Error al eliminar el cupon.');
			});
		setDialogOpen(false);
	};

	const filteredCupones = Array.isArray(cupones)
		? cupones.filter((cupon) => {
				return cupon.codigo.toLowerCase().includes(searchDescripcion.toLowerCase());
		  })
		: [];

	return (
		<div style={{ marginTop: '20px' }}>
			{/* Barra de búsqueda y botón "Agregar" */}
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

			{/* Tabla de cupones */}
			<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
				<Table>
					<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF' }}>
						<TableRow>
							<TableCell>Codigo</TableCell>
							<TableCell>Tipo</TableCell>
							<TableCell>Valor</TableCell>
							<TableCell>Fecha de Inicio</TableCell>
							<TableCell>Fecha de Fin</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredCupones.length > 0 ? (
							filteredCupones.map((cupon) => (
								<TableRow key={cupon.id}>
									<TableCell>{cupon.codigo}</TableCell>
									<TableCell>{cupon.descuento.tipo}</TableCell>
									<TableCell>
										{mostrarValorDescuento(cupon.descuento.valor, cupon.descuento.tipo)}
									</TableCell>
									<TableCell>{cupon.descuento.fechainicio}</TableCell>
									<TableCell>{cupon.descuento.fechafin}</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => handleOpen(cupon)}
											sx={{ marginRight: 2 }}
										>
											Editar
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleOpenDialog(cupon.id)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={4} style={{ textAlign: 'center' }}>
									No hay cupones disponibles.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Formulario de cupon */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{newCupon.id ? 'Editar Cupon' : 'Agregar Cupon'}</DialogTitle>
				<DialogContent>
					Codigo
					<TextField
						name="codigo"
						value={newCupon.codigo}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					{!newCupon.id && (
						<>
							Nutricionista
							<Box style={{ marginTop: '10px', marginBottom: '10px' }}>
								<TextField
									variant="outlined"
									fullWidth
									placeholder="Buscar nutricionista..."
									onChange={(e) => setSearchNutricionistas(e.target.value)}
									value={searchNutricionistas}
									style={{ marginBottom: '10px' }}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon />
											</InputAdornment>
										),
									}}
								/>
								<>
									{filteredNutricionistas.length > 0 ? (
										<TextField
											name="nutricionista_id"
											variant="outlined"
											value={newCupon.nutricionista_id}
											onChange={handleInputChange}
											fullWidth
											select
											SelectProps={{
												native: true,
											}}
											style={{ marginBottom: '10px' }}
										>
											<option value="">Seleccionar Nutricionista</option>
											{filteredNutricionistas.map((nutri) => (
												<option key={nutri.id} value={nutri.id}>
													{nutri.nombre}
												</option>
											))}
										</TextField>
									) : (
										<p style={{ textAlign: 'center', color: '#888' }}>
											No hay nutricionistas que coincidan con la busqueda
										</p>
									)}
								</>
							</Box>
						</>
					)}
					Tipo de descuento
					<TextField
						name="tipoDescuento"
						variant="outlined"
						value={newCupon.tipoDescuento}
						onChange={handleInputChange}
						fullWidth
						select
						SelectProps={{
							native: true,
						}}
						style={{ marginBottom: '10px' }}
					>
						<option value="">Seleccionar tipo de descuento</option>
						{tiposDescuento.map((tipoDescuento) => (
							<option key={tipoDescuento.id} value={tipoDescuento.id}>
								{tipoDescuento.nombre}
							</option>
						))}
					</TextField>
					Valor de Descuento
					<TextField
						name="valor"
						type="number"
						value={newCupon.valor}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Fecha de Inicio
					<TextField
						name="fechainicio"
						type="date"
						value={newCupon.fechainicio}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Fecha de Fin
					<TextField
						name="fechafin"
						type="date"
						value={newCupon.fechafin}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancelar
					</Button>
					<Button onClick={handleSaveCupon} color="primary">
						{newCupon.id ? 'Guardar Cambios' : 'Agregar'}
					</Button>
				</DialogActions>
			</Dialog>
			<CustomDialog
				open={dialogOpen}
				title="Confirmar eliminación"
				content="¿Está seguro de que desea eliminar este cupon?"
				onClose={handleCloseDialog}
				onConfirm={handleConfirmDialog}
			/>
		</div>
	);
};

export default CuponesManagement;
