import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';

const OrderManagement = () => {
  // Datos simulados de pedidos
  const [orders, setOrders] = useState([
    { id: 1, customerName: 'Juan Pérez', items: 'Pizza, Coca-Cola', total: 25.50, status: 'Enviado' },
    { id: 2, customerName: 'Ana Gómez', items: 'Hamburguesa, Papas fritas', total: 15.75, status: 'Enviado' },
    { id: 3, customerName: 'Carlos Rodríguez', items: 'Ensalada, Jugo', total: 12.30, status: 'Pendiente' },
    { id: 4, customerName: 'Laura Díaz', items: 'Pasta, Agua', total: 18.40, status: 'Pendiente' },
  ]);

  // Estado para el formulario de agregar y editar pedido
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Para determinar si estamos editando un pedido
  const [currentOrder, setCurrentOrder] = useState({
    id: '',
    customerName: '',
    items: '',
    total: '',
    status: 'Pendiente',
  });

  // Función para abrir el formulario (agregar o editar)
  const handleOpen = (order = null) => {
    if (order) {
      setIsEditing(true);
      setCurrentOrder(order);
    } else {
      setIsEditing(false);
      setCurrentOrder({
        id: '',
        customerName: '',
        items: '',
        total: '',
        status: 'Pendiente',
      });
    }
    setOpen(true);
  };

  // Función para cerrar el formulario
  const handleClose = () => {
    setOpen(false);
  };

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOrder({ ...currentOrder, [name]: value });
  };

  // Función para agregar o editar un pedido
  const handleSaveOrder = () => {
    if (currentOrder.customerName && currentOrder.items && currentOrder.total) {
      if (isEditing) {
        // Actualizar un pedido existente
        const updatedOrders = orders.map((order) =>
          order.id === currentOrder.id ? currentOrder : order
        );
        setOrders(updatedOrders);
      } else {
        // Agregar un nuevo pedido
        const newId = orders.length ? orders[orders.length - 1].id + 1 : 1; // Asigna un ID único
        const orderToAdd = { ...currentOrder, id: newId, total: parseFloat(currentOrder.total) };
        setOrders([...orders, orderToAdd]);
      }
      setCurrentOrder({ customerName: '', items: '', total: '', status: 'Pendiente' }); // Limpiar formulario
      handleClose(); // Cerrar el formulario
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  // Función para eliminar un pedido
  const handleDelete = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
  };

  return (
    <div>
      {/* Botón para abrir el formulario de agregar pedido */}
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ marginBottom: 2 }}>
        Agregar Pedido
      </Button>

      {/* Tabla de pedidos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Artículos</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  {/* Botón de editar pedido */}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpen(order)}
                    sx={{ marginRight: 2 }}
                  >
                    Editar
                  </Button>
                  {/* Botón de eliminar pedido */}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(order.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario para agregar o editar un pedido */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Editar Pedido' : 'Agregar Pedido'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del Cliente"
            name="customerName"
            value={currentOrder.customerName}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Artículos"
            name="items"
            value={currentOrder.items}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Total"
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
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveOrder} color="primary">
            {isEditing ? 'Guardar Cambios' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
