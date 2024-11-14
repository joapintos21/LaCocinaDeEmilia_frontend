import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Paper, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';

const CategoryManagement = () => {
  // Datos simulados de categorías
  const [categories, setCategories] = useState([
    { id: 1, name: 'Ropa' },
    { id: 2, name: 'Electrónica' },
    { id: 3, name: 'Hogar' },
    { id: 4, name: 'Deportes' },
  ]);

  // Estado para el formulario
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: null,
    name: '',
  });

  // Función para abrir el formulario (para agregar o editar categoría)
  const handleOpen = (category = null) => {
    if (category) {
      // Si es una categoría existente, editamos
      setNewCategory({ ...category });
    } else {
      // Si no se pasa ninguna categoría, es para agregar una nueva
      setNewCategory({ id: null, name: '' });
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
    setNewCategory({ ...newCategory, [name]: value });
  };

  // Función para agregar o editar categoría
  const handleSaveCategory = () => {
    if (newCategory.name) {
      if (newCategory.id === null) {
        // Si no tiene ID, es una nueva categoría
        const newId = categories.length ? categories[categories.length - 1].id + 1 : 1; // Asigna un ID único
        const categoryToAdd = { ...newCategory, id: newId };
        setCategories([...categories, categoryToAdd]);
      } else {
        // Si tiene ID, es una categoría que se va a editar
        const updatedCategories = categories.map((category) =>
          category.id === newCategory.id ? { ...category, name: newCategory.name } : category
        );
        setCategories(updatedCategories);
      }
      setNewCategory({ id: null, name: '' }); // Limpiar formulario
      handleClose(); // Cerrar el formulario
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  // Función para eliminar categoría
  const handleDelete = (id) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
  };

  return (
    <div>
      {/* Botón para abrir el formulario de agregar categoría */}
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ marginBottom: 2 }}>
        Agregar Categoría
      </Button>

      {/* Tabla de categorías */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpen(category)} // Abre el formulario en modo edición
                    sx={{ marginRight: 2 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(category.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario para agregar o editar una categoría */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{newCategory.id ? 'Editar Categoría' : 'Agregar Categoría'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="name"
            value={newCategory.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveCategory} color="primary">
            {newCategory.id ? 'Guardar Cambios' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
