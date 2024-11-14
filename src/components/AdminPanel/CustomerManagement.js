import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Paper, Typography, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Box
} from '@mui/material';

const CustomerManagement = () => {
  // Datos simulados de clientes
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Ana Gómez', email: 'ana@example.com', phone: '987-654-3210' },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos@example.com', phone: '555-123-4567' },
  ]);

  // Estado para controlar el modal
  const [open, setOpen] = useState(false);

  // Estado para el formulario de agregar cliente
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Función para abrir el modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Función para cerrar el modal
  const handleClose = () => {
    setOpen(false);
  };

  // Función para manejar el cambio de valores en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  // Función para agregar un nuevo cliente
  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      const newCustomerWithId = { ...newCustomer, id: customers.length + 1 };
      setCustomers([...customers, newCustomerWithId]);
      handleClose(); // Cerrar el modal después de agregar
      setNewCustomer({ name: '', email: '', phone: '' }); // Limpiar formulario
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  // Función para editar cliente (ejemplo)
  const handleEdit = (id) => {
    alert(`Editar cliente con ID: ${id}`);
    // Aquí agregarías la lógica de edición, como abrir un formulario modal
  };

  // Función para eliminar cliente
  const handleDelete = (id) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    setCustomers(updatedCustomers);
  };

  return (
    <div>
      {/* Botón para agregar cliente */}
      <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ marginBottom: 2 }}>
        Agregar Cliente
      </Button>

      {/* Tabla de clientes */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(customer.id)}
                    sx={{ marginRight: 2 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para agregar cliente */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Cliente</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={newCustomer.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Teléfono"
              name="phone"
              value={newCustomer.phone}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddCustomer} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
