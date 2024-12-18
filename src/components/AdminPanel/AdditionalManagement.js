import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdicionales,
  addAdicional,
  updateAdicional,
  deleteAdicional,
} from "store/adicionalSlice"; // Asegúrate de que las acciones estén correctamente configuradas en tu slice
import { crearAdicional } from "scripts/crearAdicional"; // Función para crear adicional
import { actualizarAdicional } from "scripts/actualizarAdicional"; // Función para actualizar adicional
import { borrarAdicional } from "scripts/borrarAdicional"; // Función para eliminar adicional
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
import { obtenerAdicionales } from "scripts/obtenerAdicionales";

const AdditionalManagement = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const fetchAdicionales = async () => {
    await obtenerAdicionales(dispatch, sessionStorage.getItem("token"));
  };
  useEffect(() => {
    try {
      fetchAdicionales();
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  const adicionales = useSelector((state) => state.adicionales || []);

  const [open, setOpen] = useState(false);
  const [newAdicional, setNewAdicional] = useState({
    id: null,
    descripcion: "",
    costoAdicional: "",
    visible: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDescripcion, setSearchDescripcion] = useState("");

  const handleOpen = (adicional = null) => {
    if (adicional) {
      setNewAdicional({ ...adicional });
    } else {
      setNewAdicional({
        id: null,
        descripcion: "",
        costoAdicional: "",
        visible: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdicional({ ...newAdicional, [name]: value });
  };

  const handleSaveAdicional = () => {
    if (
      newAdicional.descripcion &&
      newAdicional.costoAdicional &&
      newAdicional.visible
    ) {
      if (newAdicional.id === null) {
        const adicionalToAdd = { ...newAdicional };
        dispatch(addAdicional(adicionalToAdd));

        crearAdicional(
          newAdicional.descripcion,
          newAdicional.costoAdicional,
          newAdicional.visible,
          sessionStorage.getItem("token")
        )
          .then((data) => {
            console.log("Adicional agregado:", data);
          })
          .catch((error) => {
            console.error("Error al crear el adicional:", error.message);
            setError(error.message);
          });
      } else {
        actualizarAdicional(
          newAdicional.id,
          newAdicional.descripcion,
          newAdicional.costoAdicional,
          newAdicional.visible,
          sessionStorage.getItem("token")
        )
          .then((data) => {
            console.log("Adicional actualizado:", data);
          })
          .catch((error) => {
            console.error("Error al actualizar el adicional:", error.message);
            setError(error.message);
          });
        dispatch(updateAdicional(newAdicional));
      }

      setNewAdicional({ descripcion: "", costoAdicional: "", visible: "" });
      handleClose();
    } else {
      setError("Por favor, complete todos los campos.");
    }
  };

  const handleDelete = (id) => {
    borrarAdicional(id, sessionStorage.getItem("token"))
      .then((data) => {
        console.log("Adicional eliminado:", data);
      })
      .catch((error) => {
        console.error("Error al eliminar el adicional:", error.message);
        setError(error.message);
      });
    dispatch(deleteAdicional(id));
  };

  // Filtramos adicionales solo si adicionales es un array (prevención de errores)
  const filteredAdicionales = Array.isArray(adicionales)
    ? adicionales.filter((adicional) => {
        return (
          adicional.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
          adicional.descripcion
            .toLowerCase()
            .includes(searchDescripcion.toLowerCase())
        );
      })
    : [];

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Barra de búsqueda y botón "Agregar" */}
      <Box
        sx={{
          marginBottom: 2,
          paddingBottom: 2,
          borderBottom: "2px solid #ccc",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Coloca el botón de agregar a la izquierda */}
          <Grid item xs={12} sm={2} md={1}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleOpen()}
            >
              <AddIcon />
            </Button>
          </Grid>

          {/* Buscador por descripción */}
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

      {/* Tabla de adicionales con Scrollbar */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflow: "auto" }}
      >
        <Table>
          <TableHead sx={{ position: "sticky", top: 0 , backgroundColor: "#FFFFFF", zIndex: 1 }}>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Costo adicional</TableCell>
              <TableCell>Visible</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdicionales.length > 0 ? (
              filteredAdicionales.map((adicional) => (
                <TableRow key={adicional.id}>
                  <TableCell>{adicional.descripcion}</TableCell>
                  <TableCell>{adicional.costoAdicional}</TableCell>
                  <TableCell>{adicional.visible}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen(adicional)}
                      sx={{ marginRight: 2 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(adicional.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} style={{ textAlign: "center" }}>
                  No hay adicionales disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario para agregar o editar adicional */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {newAdicional.id ? "Editar Adicional" : "Agregar Adicional"}
        </DialogTitle>
        <DialogContent>
          Descripción
          <TextField
            name="descripcion"
            value={newAdicional.descripcion}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          Costo adicional
          <TextField
            name="costoAdicional"
            value={newAdicional.costoAdicional}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          Visible
          <TextField
            name="visible"
            value={newAdicional.visible}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveAdicional} color="primary">
            {newAdicional.id ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mostrar errores */}
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default AdditionalManagement;
