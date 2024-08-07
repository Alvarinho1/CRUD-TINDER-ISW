import React from 'react';
import Swal from 'sweetalert2';
import { MdThumbUp, MdThumbDown } from 'react-icons/md';
import TinderCard from 'react-tinder-card';
import { likeUser, dislikeUser } from '../services/user.service';
import '../styles/UserCard.css';

const UserCard = ({ user, swiped, outOfFrame }) => {

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
        swiped('right', user.rut); // Simula el swipe a la derecha
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
        swiped('left', user.rut); // Simula el swipe a la izquierda
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
    <TinderCard
      className="swipe"
      onSwipe={(dir) => swiped(dir, user.rut)}
      onCardLeftScreen={() => outOfFrame(user.rut)}
      preventSwipe={['up', 'down']}
    >
      <div className="user-card">
        <div className="user-card-header">
          <h2>{user.nombre}</h2>
          <p>{user.apellidos}</p>
        </div>
        <div className="user-card-body">
          <p><strong>Genero:</strong> {user.genero}</p>
          <p><strong>Carrera:</strong> {user.carrera}</p>
          <p><strong>Descripción:</strong> {user.descripcion || 'N/A'}</p>
          <p><strong>Áreas de Interés:</strong> {Array.isArray(user.areasDeInteres) ? user.areasDeInteres.join(', ') : user.areasDeInteres}</p>
          <p><strong>Cursos:</strong> {Array.isArray(user.cursos) ? user.cursos.join(', ') : user.cursos}</p>
        </div>
        <div className="user-card-footer">
          <button className="dislike-button" onClick={handleDislike}>
            <MdThumbDown style={{ marginRight: '10px' }} /> Dislike
          </button>
          <button className="like-button" onClick={handleLike}>
            <MdThumbUp style={{ marginRight: '10px' }} /> Like
          </button>
        </div>
      </div>
    </TinderCard>
  );
};

export default UserCard;