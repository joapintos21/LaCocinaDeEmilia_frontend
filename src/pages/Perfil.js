import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { obtenerPerfil } from '../scripts/obtenerPerfil';
import { actualizarPerfil } from '../scripts/actualizarPerfil';
import { obtenerDireccionesUsuario } from '../scripts/obtenerDireccionesUsuario';
import { crearDireccion } from '../scripts/crearDireccion';
import { eliminarDireccion } from '../scripts/eliminarDireccion';
import { actualizarDireccion } from '../scripts/actualizarDireccion';
import DireccionesModal from '../components/Cart/DireccionesModal';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import tw from 'twin.macro';

const Container = tw.div`min-h-screen bg-gray-100 flex flex-col items-center p-8`;
const Content = tw.div`bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mt-8 flex flex-col md:flex-row gap-8`;
const FormContainer = tw.div`w-full md:w-1/2`;
const AddressContainer = tw.div`w-full md:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md`;
const Input = tw.input`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-3`;
const Label = tw.label`block text-sm font-medium text-gray-700 mt-4`;
const Button = tw.button`w-full bg-green-600 text-white p-3 rounded-lg mt-5 hover:bg-green-700 transition duration-300`;
const AddressItem = tw.div`flex justify-between items-center border-b pb-2 mb-2`;

const Perfil = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [originalData, setOriginalData] = useState({ nombre: '', telefono: '' });
    const [direcciones, setDirecciones] = useState([]);
    const [mostrarModalDirecciones, setMostrarModalDirecciones] = useState(false);
    const [formModificado, setFormModificado] = useState(false);

    const token = sessionStorage.getItem('token');
    const userId = useSelector((state) => state.usuario.userInfo?.id);

    useEffect(() => {
        if (!userId) {
            toast.error('No se encontró el usuario.');
            return;
        }

        const fetchPerfil = async () => {
            try {
                const data = await obtenerPerfil(userId, token);
                if (data) {
                    setNombre(data.nombre || '');
                    setEmail(data.email || '');
                    setTelefono(data.telefono || '');
                    setOriginalData({ nombre: data.nombre || '', telefono: data.telefono || '' });
                }
            } catch (error) {
                toast.error('Error al cargar los datos del perfil');
            }
        };

        const fetchDirecciones = async () => {
            try {
                const data = await obtenerDireccionesUsuario(userId, token);
                setDirecciones(data);
            } catch (error) {
                toast.error('Error al obtener las direcciones.');
            }
        };

        fetchPerfil();
        fetchDirecciones();
    }, [userId, token]);

    const isFormChanged = () => {
        return (
            nombre !== originalData.nombre ||
            telefono !== originalData.telefono ||
            (password && password === repeatPassword)
        );
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        if (!nombre || !telefono) {
            toast.error('Por favor complete todos los campos obligatorios.');
            return;
        }

        if (password && password !== repeatPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }

        try {
            await actualizarPerfil(userId, nombre, telefono, password, token);
            toast.success('Perfil actualizado con éxito');
            setPassword('');
            setRepeatPassword('');
            setFormModificado(false);
            setOriginalData({ nombre, telefono });
        } catch (error) {
            toast.error('Error al actualizar el perfil');
        }
    };

    const handleGuardarDireccion = async (direccion) => {
        try {
            await crearDireccion(direccion, token);
            toast.success('Dirección guardada correctamente');
            setMostrarModalDirecciones(false);
            setDirecciones(await obtenerDireccionesUsuario(userId, token));
        } catch (error) {
            toast.error('Error al guardar la dirección.');
        }
    };

    const handleEliminarDireccion = async (id) => {
        eliminarDireccion(id, token)
            .then(() => {
                toast.success('Dirección eliminada correctamente');
                setDirecciones(direcciones.filter(d => d.id !== id));
            })
            .catch(() => {
                toast.error('Error al eliminar la dirección.');
            });
    };

    const handleActualizarDireccion = async (id, nuevaDireccion) => {
        try {
            await actualizarDireccion(id, nuevaDireccion, token);
            toast.success('Dirección actualizada correctamente');
            setDirecciones(await obtenerDireccionesUsuario(userId, token));
        } catch (error) {
            toast.error('Error al actualizar la dirección.');
        }
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
        setFormModificado(true);
    };

    return (
        <AnimationRevealPage>
            <Container>
                <Content>
                    <FormContainer>
                        <h2 className="text-xl font-bold text-center">Mi Perfil</h2>
                        <form onSubmit={handleUpdateProfile}>
                            <Label>Nombre</Label>
                            <Input type="text" value={nombre} onChange={handleInputChange(setNombre)} required />

                            <Label>Email</Label>
                            <Input type="email" value={email} readOnly disabled />

                            <Label>Teléfono</Label>
                            <Input type="text" value={telefono} onChange={handleInputChange(setTelefono)} required />

                            <Label>Nueva Contraseña (opcional)</Label>
                            <Input type="password" value={password} onChange={handleInputChange(setPassword)} />

                            <Label>Repetir Contraseña</Label>
                            <Input type="password" value={repeatPassword} onChange={handleInputChange(setRepeatPassword)} />

                            <Button type="submit" disabled={!isFormChanged()}>Guardar Cambios</Button>
                        </form>
                    </FormContainer>
                    <AddressContainer>
                        <h3 className="text-lg font-bold">Mis Direcciones</h3>
                        {direcciones.length > 0 ? (
                            direcciones.map((direccion) => (
                                <AddressItem key={direccion.id}>
                                    <div>
                                        <p tw="text-sm font-semibold">{direccion.titulo}</p>
                                        <p>{direccion.direccion}</p>
                                    </div>
                                    <button
                                        onClick={() => handleEliminarDireccion(direccion.id)}
                                        tw="text-red-600 hover:text-red-800"
                                    >
                                        Eliminar
                                    </button>
                                </AddressItem>
                            ))
                        ) : (
                            <p>No tienes direcciones registradas.</p>
                        )}
                        <Button onClick={() => setMostrarModalDirecciones(true)}>+ Agregar Dirección</Button>
                    </AddressContainer>
                </Content>
                <DireccionesModal
                    userId={userId}
                    mostrarModalDirecciones={mostrarModalDirecciones}
                    setMostrarModalDirecciones={setMostrarModalDirecciones}
                    onGuardarDireccion={handleGuardarDireccion}
                />
            </Container>
        </AnimationRevealPage>
    );
};

export default Perfil;
