import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategorias, addCategory, updateCategory, deleteCategory } from 'store/categoriaSlice';
import obtenerCategorias from 'scripts/obtenerCategorias'; // Importamos la función para obtener categorías
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories); // Obtenemos las categorías desde el store

  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: null, name: '' });

  // Función para abrir el formulario (para agregar o editar categoría)
  const handleOpen = (category = null) => {
    if (category) {
      setNewCategory({ ...category });
    } else {
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
        const newId = categories.length ? categories[categories.length - 1].id + 1 : 1;
        const categoryToAdd = { ...newCategory, id: newId };
        dispatch(addCategory(categoryToAdd));
      } else {
        dispatch(updateCategory(newCategory));
      }
      setNewCategory({ id: null, name: '' }); // Limpiar formulario
      handleClose(); // Cerrar el formulario
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  // Función para eliminar categoría
  const handleDelete = (id) => {
    dispatch(deleteCategory(id));
  };

  // Cargar categorías desde la API usando la función obtenerCategorias
  useEffect(() => {
    const loadCategories = async () => {
      const data = await obtenerCategorias(); // Llamamos a la función de la API
      dispatch(setCategorias(data)); // Despachamos las categorías a Redux
    };

    loadCategories();
  }, [dispatch]); // Solo se ejecuta una vez cuando el componente se monta

  return (
    <div>
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
            {(Array.isArray(categories) && categories.length > 0) ? (
              categories.map((category) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No hay categorías disponibles.</TableCell>
              </TableRow>
            )}
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
