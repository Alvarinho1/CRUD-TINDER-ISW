import { useEffect, useState } from 'react';
import { BuscarLikesUser } from '../services/buqueda.service';
import Navbar from '../components/Navbar';

const BusquedaLikesUser = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsuarios = async () => {
            const [data, err] = await BuscarLikesUser();
            console.log('Datos recibidos:', data); // Verifica qué datos estás recibiendo
            if (err) {
                setError(err);
            } else {
                setUsuarios(data || []);
            }
            setLoading(false);
        };

        fetchUsuarios();
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
            <h1>Usuarios con Likes</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>RUT</th>
                        <th>Likes</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(usuarios) && usuarios.length > 0 ? (
                        usuarios.map(user => (
                            <tr key={user.rut}>
                                <td>{user.nombre}</td>
                                <td>{user.apellidos}</td>
                                <td>{user.rut}</td>
                                <td>{user.likes.length}</td> {/* Asegúrate de que `likes` sea un array */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No se encontraron usuarios con likes</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BusquedaLikesUser;
