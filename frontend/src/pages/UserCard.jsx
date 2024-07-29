import React from 'react';
import Swal from 'sweetalert2';
import { likeUser, dislikeUser } from '../services/user.service';
import '../styles/UserCard.css';

const UserCard = ({ user }) => {
  const handleLike = async () => {
    try {
      const usuario = JSON.parse(sessionStorage.getItem('usuario'));
      if (!usuario || !usuario._id) {
        throw new Error('Usuario no encontrado en sessionStorage');
      }

      const [response, error] = await likeUser(user._id); // Verifica que likeUser devuelva un array
      if (error) {
        console.error(error);
        
        // Formatea el mensaje de error
        const errorMessage = error.message || 'Error desconocido';
        const errorDetails = error.details ? JSON.stringify(error.details) : 'No hay detalles disponibles';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: `
            <div>
              <p><strong>Mensaje:</strong> ${errorMessage}</p>
              <p><strong>Detalles:</strong> ${errorDetails}</p>
            </div>
          `,
        });
      } else {
        console.log("User liked successfully", response);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Like Enviado',
        });
      }
    } catch (error) {
      console.error("Error liking user:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error Like',
      });
    }
  };

  const handleDislike = async () => {
    try {
      const usuario = JSON.parse(sessionStorage.getItem('usuario'));
      if (!usuario || !usuario._id) {
        throw new Error('Usuario no encontrado en sessionStorage');
      }

      const [response, error] = await dislikeUser(user._id); // Verifica que dislikeUser devuelva un array
      if (error) {
        console.error(error);

        // Formatea el mensaje de error
        const errorMessage = error.message || 'Error desconocido';
        const errorDetails = error.details ? JSON.stringify(error.details) : 'No hay detalles disponibles';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: `
            <div>
              <p><strong>Mensaje:</strong> ${errorMessage}</p>
              <p><strong>Detalles:</strong> ${errorDetails}</p>
            </div>
          `,
        });
      } else {
        console.log("User disliked successfully", response);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Dislike Enviado',
        });
      }
    } catch (error) {
      console.error("Error disliking user:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error Dislike',
      });
    }
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <h2>{user.nombre}</h2>
        <p>{user.genero}</p>
      </div>
      <div className="user-card-body">
        <p><strong>Carrera:</strong> {user.carrera}</p>
        <p><strong>Descripción:</strong> {user.descripcion || 'N/A'}</p>
        <p><strong>Áreas de Interés:</strong> {user.areasDeInteres.join(', ')}</p>
        <p><strong>Cursos:</strong> {user.cursos.join(', ')}</p>
      </div>
      <div className="user-card-footer">
        <button onClick={handleLike}>Like</button>
        <button onClick={handleDislike}>Dislike</button>
      </div>
    </div>
  );
}

export default UserCard;
