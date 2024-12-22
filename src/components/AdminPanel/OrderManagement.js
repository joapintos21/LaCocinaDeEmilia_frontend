import React, { useState } from 'react';
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
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Box,
	Grid,
	InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const OrderManagement = () => {
	const [orders, setOrders] = useState([]);

	const [open, setOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentOrder, setCurrentOrder] = useState({
		id: '',
		customerName: '',
		items: '',
		total: '',
		status: 'Pendiente',
	});
	const [searchTerm, setSearchTerm] = useState('');

	const handleOpen = (order = null) => {
		setIsEditing(!!order);
		setCurrentOrder(
			order || {
				id: '',
				customerName: '',
				items: '',
				total: '',
				status: 'Pendiente',
			},
		);
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCurrentOrder({ ...currentOrder, [name]: value });
	};

	const handleSaveOrder = () => {
		if (currentOrder.customerName && currentOrder.items && currentOrder.total) {
			if (isEditing) {
				setOrders((prevOrders) =>
					prevOrders.map((order) => (order.id === currentOrder.id ? currentOrder : order)),
				);
			} else {
				const newId = orders.length ? orders[orders.length - 1].id + 1 : 1;
				const orderToAdd = { ...currentOrder, id: newId, total: parseFloat(currentOrder.total) };
				setOrders((prevOrders) => [...prevOrders, orderToAdd]);
			}
			handleClose();
		} else {
			alert('Por favor, complete todos los campos.');
		}
	};

	const handleDelete = (id) => {
		setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
	};

	const filteredOrders = orders.filter((order) =>
		order.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div style={{ marginTop: '20px' }}>
			{/* Barra de búsqueda y botón de agregar */}
			<Box sx={{ marginBottom: 2, paddingBottom: 2, borderBottom: '2px solid #ccc' }}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} sm={2} md={1}>
						<Button variant="contained" color="success" onClick={() => handleOpen()}>
							<AddIcon />
						</Button>
					</Grid>
					<Grid item xs={12} sm={10} md={5}>
						<TextField
							label="Buscar por cliente"
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
				</Grid>
			</Box>

      {/* Tabla de pedidos */}
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
        <Table>
          <TableHead sx={{ position: "sticky", top: 0 , backgroundColor: "#FFFFFF" }}>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Artículos</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen(order)}
                      sx={{ marginRight: 2 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(order.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  No hay pedidos disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Editar Pedido" : "Agregar Pedido"}</DialogTitle>
        <DialogContent>
        Nombre del Cliente
          <TextField
            name="customerName"
            value={currentOrder.customerName}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          Artículos
          <TextField
            name="items"
            value={currentOrder.items}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          Total
          <TextField
            name="total"
            type="number"
            value={currentOrder.total}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              name="status"
              value={currentOrder.status}
              onChange={handleInputChange}
            >
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Enviado">Enviado</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveOrder} color="primary">
            {isEditing ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
