import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategorias,
  addCategory,
  updateCategory,
  deleteCategory,
} from "store/categoriaSlice";
import { crearCategoria } from "scripts/crearCategoria";
import { actualizarCategoria } from "scripts/actualizarCategoria";
import { borrarCategoria } from "scripts/borrarCategoria";
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
} from "@mui/material";

const CategoryManagement = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categorias); // Obtenemos las categorías desde el store

  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: null, titulo: "", descripcion: "" });

  // Función para abrir el formulario (para agregar o editar categoría)
  const handleOpen = (category = null) => {
    if (category) {
      setNewCategory({ ...category });
    } else {
      setNewCategory({ id: null, name: "" });
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
    if (newCategory.titulo) {
      if (newCategory.id === null) {
        const categoryToAdd = { ...newCategory, titulo: newCategory.titulo, descripcion: newCategory.descripcion};
        dispatch(addCategory(categoryToAdd));
        crearCategoria(
          newCategory.titulo,
          newCategory.descripcion,
          sessionStorage.getItem("token")
        )
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error("Error al crear la categoria:", error.message);
            setError(error.message); // Asigna el mensaje de error a un estado para mostrarlo
          });
      } else {
        actualizarCategoria(
          newCategory.id,
          newCategory.titulo,
          newCategory.descripcion,
          sessionStorage.getItem("token")
        )
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error("Error al actualizar la categoria:", error.message);
            setError(error.message); // Asigna el mensaje de error a un estado para mostrarlo
          });
        dispatch(updateCategory(newCategory));
      }
      setNewCategory({ titulo: "", descripcion: "" }); // Limpiar formulario
      handleClose(); // Cerrar el formulario
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  // Función para eliminar categoría
  const handleDelete = (id) => {
    borrarCategoria(
      id,
      sessionStorage.getItem("token")
    )
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al eliminar la categoria:", error.message);
        setError(error.message); // Asigna el mensaje de error a un estado para mostrarlo
      });
    dispatch(deleteCategory(id));
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{ marginBottom: 2 }}
      >
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
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.titulo}</TableCell>
                  <TableCell>{category.descripcion}</TableCell>
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
                <TableCell colSpan={2}>
                  No hay categorías disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario para agregar o editar una categoría */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {newCategory.id ? "Editar Categoría" : "Agregar Categoría"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Titulo"
            name="titulo"
            value={newCategory.titulo}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Descripcion"
            name="descripcion"
            value={newCategory.descripcion}
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
            {newCategory.id ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
