import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addDescuento,
  updateDescuento,
  deleteDescuento,
} from "store/descuentoSlice"; // Asegúrate de que las acciones estén correctamente definidas en el slice
import { crearDescuento } from "scripts/crearDescuento"; // Función para crear descuento
import { actualizarDescuento } from "scripts/actualizarDescuento"; // Función para actualizar descuento
import { borrarDescuento } from "scripts/borrarDescuento"; // Función para eliminar descuento
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { obtenerDescuentos } from "scripts/obtenerDescuentos";

const DiscountManagement = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const fetchDescuentos = async () => {
    await obtenerDescuentos(dispatch, sessionStorage.getItem("token")); // Llama al script para cargar los descuentos en Redux
  };
  const [open, setOpen] = useState(false);
  const [newDescuento, setNewDescuento] = useState({ id: null, tipo: "", valor: "", fechaInicio: "", fechaFin: "" , descripcion: "" });
  const [searchDescripcion, setSearchDescripcion] = useState("");
  
  useEffect(() => {

    try {
      fetchDescuentos(); 
    } catch (e) {
      console.log(e)
    }
    setError("");
  }, []);

  // Obtén los descuentos del store; si no están disponibles, usa un array vacío
  const descuentos = useSelector((state) => state.descuentos || []);

  const handleOpen = (descuento = null) => {
    setNewDescuento(descuento ? { ...descuento } : { id: null, tipo: "", valor: "", fechaInicio: "", fechaFin: "" , descripcion: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDescuento({ ...newDescuento, [name]: value });
  };

  const handleSaveDescuento = () => {
    if (newDescuento.valor && newDescuento.fechaInicio && newDescuento.fechaFin && newDescuento.descripcion) {
      if (newDescuento.id === null) {
        const descuentoToAdd = { ...newDescuento };
        dispatch(addDescuento(descuentoToAdd));

        crearDescuento(
          newDescuento.valor,
          newDescuento.fechaInicio,
          newDescuento.fechaFin,
          newDescuento.descripcion,
          sessionStorage.getItem("token")
        )
          .then((data) => console.log("Descuento agregado:", data))
          .catch((error) => {
            console.error("Error al crear el descuento:", error.message);
            setError(error.message);
          });
          fetchDescuentos();
      } else {
        actualizarDescuento(
          newDescuento.id,
          newDescuento.valor,
          newDescuento.fechaInicio,
          newDescuento.fechaFin,
          newDescuento.descripcion,
          sessionStorage.getItem("token")
        )
          .then((data) => console.log("Descuento actualizado:", data))
          .catch((error) => {
            console.error("Error al actualizar el descuento:", error.message);
            setError(error.message);
          });
        dispatch(updateDescuento(newDescuento));
        fetchDescuentos();
      }

      setNewDescuento({ valor: "", fechaInicio: "", fechaFin: "", descripcion : "" });
      handleClose();
    } else {
      setError("Por favor, complete todos los campos.");
    }
  };

  const handleDelete = (id) => {
    borrarDescuento(id, sessionStorage.getItem("token"))
      .then((data) => console.log("Descuento eliminado:", data))
      .catch((error) => {
        console.error("Error al eliminar el descuento:", error.message);
        setError(error.message);
      });
    dispatch(deleteDescuento(id));
    fetchDescuentos();
  };

  // Filtra los descuentos asegurándote de que `descuentos` es un array
  const filteredDescuentos = Array.isArray(descuentos)
    ? descuentos.filter((descuento) => {
        return (
          descuento.descripcion.toLowerCase().includes(searchDescripcion.toLowerCase())
        );
      })
    : [];

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Barra de búsqueda y botón "Agregar" */}
      <Box sx={{ marginBottom: 2, paddingBottom: 2, borderBottom: "2px solid #ccc" }}>
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

      {/* Tabla de descuentos */}
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
        <Table>
          <TableHead sx={{ position: "sticky", top: 0 }}>
            <TableRow>
              <TableCell>Valor (%)</TableCell>
              <TableCell>Fecha de Inicio</TableCell>
              <TableCell>Fecha de Fin</TableCell>
              <TableCell>Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDescuentos.length > 0 ? (
              filteredDescuentos.map((descuento) => (
                <TableRow key={descuento.id}>
                  <TableCell>{descuento.valor}%</TableCell>
                  <TableCell>{descuento.fechaInicio}</TableCell>
                  <TableCell>{descuento.fechaFin}</TableCell>
                  <TableCell>{descuento.descripcion}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen(descuento)}
                      sx={{ marginRight: 2 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(descuento.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                  No hay descuentos disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario de descuento */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{newDescuento.id ? "Editar Descuento" : "Agregar Descuento"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Valor de Descuento"
            name="valor"
            type="number"
            value={newDescuento.valor}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Fecha de Inicio"
            name="fechaInicio"
            value={newDescuento.fechaInicio}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Fecha de Fin"
            name="fechaFin"
            value={newDescuento.fechaFin}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={newDescuento.descripcion}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveDescuento} color="primary">
            {newDescuento.id ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mostrar errores */}
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default DiscountManagement;
