import React from 'react';
import '../styles/UserCard.css'

const UserCard = ({ user }) => {
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
    </div>
  );
}

export default UserCard;