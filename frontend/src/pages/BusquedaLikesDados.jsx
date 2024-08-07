import React, { useEffect, useState } from 'react';
import { BuscarLikesDados } from '../services/buqueda.service'; // Asegúrate de que la ruta sea correcta
import Navbar from '../components/Navbar';
import '../styles/BusquedaLikesDados.css'; // Asegúrate de importar el archivo de estilos

const BusquedaLikesDados = () => {
    const [likesDados, setLikesDados] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const [data, err] = await BuscarLikesDados();
                console.log('Datos de Likes Dados:', data); // Verifica qué datos estás recibiendo
                if (err) {
                    setError(err.message || 'Ha ocurrido un error');
                } else {
                    setLikesDados(data || []);
                }
            } catch (error) {
                setError(error.message || 'Ha ocurrido un error');
            } finally {
                setLoading(false);
            }
        };

        fetchLikes();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <main className="likes-page">
            <Navbar />
            <div className="likes-container">
                
                {error ? (
                    <div className="error-message">Error: {error}</div>
                ) : (
                    <table className="likes-table">
                        <thead>
                        <h1>Likes Recibidos por el Usuario</h1>
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
        </main>
    );
};

export default BusquedaLikesDados;
