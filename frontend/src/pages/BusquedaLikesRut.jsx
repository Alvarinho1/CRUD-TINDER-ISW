import { useEffect, useState } from 'react';
import { BuscarLikesUserByRut } from '../services/buqueda.service'; // Asegúrate de que la ruta sea correcta
import Navbar from '../components/Navbar';

const BusquedaLikesRut = () => {
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsuario = async () => {
            const [data, err] = await BuscarLikesUserByRut();
            console.log('Datos de Likes por RUT:', data); // Verifica qué datos estás recibiendo
            if (err) {
                // Asegúrate de capturar el mensaje de error en un formato adecuado
                setError(err.message || 'Ha ocurrido un error');
            } else {
                setUsuario(data || {});
            }
            setLoading(false);
        };

        fetchUsuario();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <Navbar />
             <h1>Likes del Alumno</h1>
            {error ? (
                <div>Error: {error}</div>
            ) : (
                <table>
                     
                    <thead>
                  
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>RUT</th>
                            <th>Likes Recibidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuario ? (
                            <>
                                <tr key={usuario._id}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.apellidos}</td>
                                    <td>{usuario.rut}</td>
                                    <td>
                                        {usuario.likes && usuario.likes.length > 0 ? (
                                            usuario.likes.map((like, index) => (
                                                <div key={index}>
                                                    {like.nombreCompleto}
                                                </div>
                                            ))
                                        ) : (
                                            'No tiene likes'
                                        )}
                                    </td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan="4">No se encontraron datos</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BusquedaLikesRut;
