import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUsuario,
  updateUsuario,
  deleteUsuario,
} from "store/usuarioSlice"; // Asegúrate de que las acciones estén correctamente definidas en el slice
import { crearUsuario } from "scripts/crearUsuario";
import { actualizarUsuario } from "scripts/actualizarUsuario";
import { borrarUsuario } from "scripts/borrarUsuario";
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
import { obtenerUsuarios } from "scripts/obtenerUsuarios";

const UserManagement = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  // Obtén los usuarios del store; si no están disponibles, usa un array vacío
  const usuarios = useSelector((state) => state.usuarios || []);

  const [open, setOpen] = useState(false);
  const [newUsuario, setNewUsuario] = useState({ id: null, nombre: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {

    try {
      const fetchUsuarios = async () => {
        await obtenerUsuarios(dispatch); // Llama al script para cargar las categorías en Redux
      };
      fetchUsuarios();

    } catch (e) {
      console.log(e)
    }
    setError(""); // Limpiamos el error
  }, [dispatch]);

  const handleOpen = (usuario = null) => {
    setNewUsuario(usuario ? { ...usuario } : { id: null, nombre: "", email: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario({ ...newUsuario, [name]: value });
  };

  const handleSaveUsuario = () => {
    if (newUsuario.nombre && newUsuario.email) {
      if (newUsuario.id === null) {
        const usuarioToAdd = { ...newUsuario };
        dispatch(addUsuario(usuarioToAdd));

        crearUsuario(newUsuario.nombre, newUsuario.email, sessionStorage.getItem("token"))
          .then((data) => console.log("Usuario agregado:", data))
          .catch((error) => {
            console.error("Error al crear el usuario:", error.message);
            setError(error.message);
          });
      } else {
        actualizarUsuario(
          newUsuario.id,
          newUsuario.nombre,
          newUsuario.email,
          sessionStorage.getItem("token")
        )
          .then((data) => console.log("Usuario actualizado:", data))
          .catch((error) => {
            console.error("Error al actualizar el usuario:", error.message);
            setError(error.message);
          });
        dispatch(updateUsuario(newUsuario));
      }

      setNewUsuario({ nombre: "", email: "" });
      handleClose();
    } else {
      setError("Por favor, complete todos los campos.");
    }
  };

  const handleDelete = (id) => {
    borrarUsuario(id, sessionStorage.getItem("token"))
      .then((data) => console.log("Usuario eliminado:", data))
      .catch((error) => {
        console.error("Error al eliminar el usuario:", error.message);
        setError(error.message);
      });
    dispatch(deleteUsuario(id));
  };

  // Filtra los usuarios asegurándote de que `usuarios` es un array
  const filteredUsuarios = Array.isArray(usuarios)
    ? usuarios.filter((usuario) => {
        return (
          usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
          usuario.email.toLowerCase().includes(searchEmail.toLowerCase())
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
              label="Buscar por nombre"
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

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Buscar por correo"
              variant="outlined"
              fullWidth
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
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

      {/* Tabla de usuarios */}
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
        <Table>
          <TableHead sx={{ position: "sticky", top: 0 }}>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsuarios.length > 0 ? (
              filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen(usuario)}
                      sx={{ marginRight: 2 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(usuario.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} style={{ textAlign: "center" }}>
                  No hay usuarios disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario de usuario */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{newUsuario.id ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            value={newUsuario.nombre}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Correo"
            name="email"
            value={newUsuario.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveUsuario} color="primary">
            {newUsuario.id ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mostrar errores */}
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default UserManagement;
