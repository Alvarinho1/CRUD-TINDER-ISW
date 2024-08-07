import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getMatchesByUserId } from '../services/match.service';
import '../styles/matches.css';  // Asegúrate de importar el archivo de estilos

const Matches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('usuario'));
        if (user && user._id) {
          const response = await getMatchesByUserId(user._id);
          console.log("Fetched matches: ", response); // Log para verificar los datos de los matches
          if (response && response.data) {
            setMatches(response.data); // Accede a la propiedad 'data' de la respuesta
          } else {
            console.error("No data found in response: ", response);
          }
        }
      } catch (error) {
        console.error("Error fetching matches: ", error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <main className="matches-page">
      <Navbar />
      <div className="matches-container">
        <h1>Tus Matches</h1>
        {matches.length > 0 ? (
          <table className="matches-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Carrera</th>
                <th>Descripción</th>
                <th>Áreas de Interés</th>
                <th>Cursos</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match._id}>
                  <td>{match.nombre}</td>
                  <td>{match.apellidos}</td>
                  <td>{match.carrera}</td>
                  <td>{match.descripcion}</td>
                  <td>{Array.isArray(match.areasDeInteres) ? match.areasDeInteres.join(', ') : match.areasDeInteres}</td>
                  <td>{Array.isArray(match.cursos) ? match.cursos.join(', ') : match.cursos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tienes matches</p>
        )}
      </div>
    </main>
  );
};

export default Matches;