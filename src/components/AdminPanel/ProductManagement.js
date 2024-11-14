import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ProductManagement = () => {
  // Datos simulados de productos
  const [products, setProducts] = useState([
    { id: 1, name: 'Camiseta', category: 'Ropa', price: 20.99, stock: 50 },
    { id: 2, name: 'Laptop', category: 'Electrónica', price: 899.99, stock: 15 },
    { id: 3, name: 'Zapatos Deportivos', category: 'Ropa', price: 45.49, stock: 30 },
    { id: 4, name: 'Auriculares', category: 'Electrónica', price: 59.99, stock: 100 },
  ]);

  // Estado para el formulario
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
  });

  // Función para abrir el formulario
  const handleOpen = () => {
    setOpen(true);
  };

  // Función para cerrar el formulario
  const handleClose = () => {
    setOpen(false);
  };

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Función para agregar un nuevo producto
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.price && newProduct.stock) {
      const newId = products.length ? products[products.length - 1].id + 1 : 1;  // Asigna un ID único
      const productToAdd = { ...newProduct, id: newId, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) };
      setProducts([...products, productToAdd]);
      setNewProduct({ name: '', category: '', price: '', stock: '' });  // Limpiar formulario
      handleClose();  // Cerrar el formulario
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  // Función para editar producto (ejemplo)
  const handleEdit = (id) => {
    alert(`Editar producto con ID: ${id}`);
  };

  // Función para eliminar producto
  const handleDelete = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
  };

  return (
    <div>
      {/* Botón para abrir el formulario de agregar producto */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginBottom: 2 }}>
        Agregar Producto
      </Button>

      {/* Tabla de productos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(product.id)}
                    sx={{ marginRight: 2 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario para agregar un nuevo producto */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Producto</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Categoría"
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Precio"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={newProduct.stock}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddProduct} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
