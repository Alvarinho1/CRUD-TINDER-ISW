import { useEffect, useState } from 'react';
import { BuscarLikesDados } from '../services/buqueda.service'; // Asegúrate de que la ruta sea correcta
import Navbar from '../components/Navbar';
import '../styles/BusquedaLikesDados.css';

const BusquedaLikesDados = () => {
    const [likesDados, setLikesDados] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikes = async () => {
            const [data, err] = await BuscarLikesDados();
            console.log('Datos de Likes Dados:', data); // Verifica qué datos estás recibiendo
            if (err) {
                setError(err.message || 'Ha ocurrido un error');
            } else {
                setLikesDados(data || []);
            }
            setLoading(false);
        };

        fetchLikes();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <Navbar />
            <h1>Likes Dados por el Usuario</h1>
            {error ? (
                <div>Error: {error}</div>
            ) : (
                <table>
                    <thead>
                    <h1>Likes Dados por el Alumno</h1>
                        <tr>
                       
                            <th>Nombre</th>
                            <th>Apellidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {likesDados.length > 0 ? (
                            likesDados.map((usuario) => (
                                <tr key={usuario._id}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.apellidos}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No se encontraron datos</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BusquedaLikesDados;
