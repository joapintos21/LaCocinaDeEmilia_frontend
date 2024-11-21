import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProductos,
  addProduct,
  updateProduct,
  deleteProduct,
} from 'store/productoSlice';
import { crearProducto } from 'scripts/crearProducto';
import { actualizarProducto } from 'scripts/actualizarProducto';
import { borrarProducto } from 'scripts/borrarProducto';
import { obtenerProductos } from 'scripts/obtenerProductosCategoria'; // Usamos este script para obtener productos
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

const ProductManagement = () => {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const productos = useSelector((state) => state.productos); // Accedemos al estado de productos
  const categorias = useSelector((state) => state.categorias); // Accedemos a las categorías

  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: null,
    descripcion: '',
    precio: '',
    categoria_id: '',
    visible: true,
  });

  // Recargar productos al montar el componente
  useEffect(() => {
    obtenerProductos(sessionStorage.getItem("token"))
      .then((data) => {
        dispatch(setProductos(data)); // Guardamos los productos en el store
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
        setError('No se pudieron cargar los productos.');
      });
  }, [dispatch]);

  // Función para abrir el formulario (para agregar o editar producto)
  const handleOpen = (product = null) => {
    if (product) {
      // Si estamos editando un producto, aseguramos que 'categoria_id' se setee correctamente
      setNewProduct({ ...product });
    } else {
      // Si estamos creando un nuevo producto, dejamos el valor vacío para 'categoria_id'
      setNewProduct({
        id: null,
        descripcion: '',
        precio: '',
        categoria_id: '', // Aquí dejamos vacío para un nuevo producto
        visible: true,
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
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Función para manejar el cambio en la selección de categoría
  const handleCategoryChange = (e) => {
    setNewProduct({ ...newProduct, categoria_id: e.target.value });
  };

  // Función para agregar o editar producto
  const handleSaveProduct = () => {
    if (newProduct.descripcion && newProduct.precio && newProduct.categoria_id) {
      const productToSave = {
        ...newProduct,
        precio: parseFloat(newProduct.precio),
        categoria_id: parseInt(newProduct.categoria_id),
      };

      if (newProduct.id === null) {
        // Crear nuevo producto
        crearProducto(newProduct.descripcion, newProduct.precio, newProduct.categoria_id, newProduct.visible, sessionStorage.getItem("token"))
          .then((data) => {
            if (data && data.id) {
              // Despachamos la acción para agregar el producto al store
              dispatch(addProduct(data)); // Asegúrate de pasar el objeto correcto
              console.log('Producto creado:', data);
            } else {
              setError('Error al crear el producto en la base de datos.');
            }
          })
          .catch((error) => {
            console.error('Error al crear el producto:', error.message);
            setError(error.message);
          });
      } else {
        // Editar producto existente
        dispatch(updateProduct(productToSave));

        actualizarProducto(newProduct.id, newProduct.descripcion, newProduct.precio, newProduct.categoria_id, newProduct.visible, sessionStorage.getItem("token"))
          .then((data) => {
            console.log('Producto actualizado:', data);
          })
          .catch((error) => {
            console.error('Error al actualizar el producto:', error.message);
            setError(error.message);
          });
      }

      setNewProduct({ descripcion: '', precio: '', categoria_id: '', visible: true });
      handleClose();
    } else {
      setError('Por favor, complete todos los campos.');
    }
  };

  // Función para eliminar producto
  const handleDelete = (id) => {
    borrarProducto(id, sessionStorage.getItem("token"))
      .then((data) => {
        console.log('Producto eliminado:', data);
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error.message);
        setError(error.message);
      });

    dispatch(deleteProduct(id)); // Actualizamos el store después de eliminar el producto
  };

  // Función para obtener el nombre de la categoría a partir del categoria_id del producto
  const getCategoryNameById = (categoria_id) => {
    const categoria = categorias.find((categoria) => categoria.id === categoria_id); // Buscamos por el id de categoría
    return categoria ? categoria.titulo : 'Categoría no encontrada'; // Si no se encuentra, mostrar un mensaje de error
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{ marginBottom: 2 }}
      >
        Agregar Producto
      </Button>

      {/* Tabla de productos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Visible</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(productos) && productos.length > 0 ? (
              productos.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.descripcion}</TableCell>
                  <TableCell>{product.precio}</TableCell>
                  <TableCell>{getCategoryNameById(product.categoria_id)}</TableCell> {/* Mostrar el nombre de la categoría */}
                  <TableCell>{product.visible ? 'Sí' : 'No'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen(product)} // Abre el formulario en modo edición
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No hay productos disponibles.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario para agregar o editar producto */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{newProduct.id ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Descripción"
            name="descripcion"
            value={newProduct.descripcion}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Precio"
            name="precio"
            type="number"
            value={newProduct.precio}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          {/* Campo de selección para la categoría con el título mostrado y el id asignado */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={newProduct.categoria_id} // Aquí se asegura de que el valor de categoría se actualice
              onChange={handleCategoryChange}
              label="Categoría"
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.titulo} {/* Usamos el campo 'titulo' para mostrar la categoría */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campo de visibilidad */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Visibilidad</InputLabel>
            <Select
              value={newProduct.visible}
              onChange={(e) => setNewProduct({ ...newProduct, visible: e.target.value })}
            >
              <MenuItem value={true}>Visible</MenuItem>
              <MenuItem value={false}>No Visible</MenuItem>
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSaveProduct}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default ProductManagement;
