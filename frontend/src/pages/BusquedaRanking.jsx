// src/pages/Busqueda.jsx
import  { useEffect, useState } from 'react';
import { RankingUsers } from '../services/buqueda.service';
import Navbar from '../components/Navbar';

const BusquedaRanking = () => {
    const [ranking, setRanking] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            const [data, err] = await RankingUsers();
            console.log('Datos recibidos:', data); // Verifica qué datos estás recibiendo
            if (err) {
                setError(err);
            } else {
                setRanking(data || []);
            }
            setLoading(false);
        };
        

        fetchRanking();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Navbar />
            <h1>Ranking de Usuarios</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>RUT</th>
                        <th>Likes</th>
                        <th>Puntos</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(ranking) && ranking.length > 0 ? (
                        ranking.map(user => (
                            <tr key={user.rut}>
                                <td>{user.nombre}</td>
                                <td>{user.apellidos}</td>
                                <td>{user.rut}</td>
                                <td>{user.likeCount}</td>
                                <td>{user.points}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No se encontraron usuarios con likes</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BusquedaRanking;
