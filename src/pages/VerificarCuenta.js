import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verificar } from 'scripts/verificar';

const VerificarCuenta = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener el parámetro del token desde la URL
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        verificar(token).then((data) => {
            console.log(data)
            navigate('/login?mensaje=verificado');
        })
        
    }, [location, navigate]);

    return null;
};

export default VerificarCuenta;