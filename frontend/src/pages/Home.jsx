import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getUsers, likeUser, dislikeUser } from '../services/user.service';
import UserCard from './UserCard.jsx'; 
import Swal from 'sweetalert2';
import '../styles/styles.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [lastDirection, setLastDirection] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        console.log("Fetched users: ", response.data); // Log para verificar los datos
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const swiped = (direction, rut) => {
    console.log(`removing: ${rut} with direction ${direction}`);
    setLastDirection(direction);
    setUsers(prevUsers => prevUsers.filter(user => user.rut !== rut)); // Elimina la tarjeta deslizada
  };

  const outOfFrame = (rut) => {
    console.log(rut + ' left the screen!');
    setUsers(prevUsers => prevUsers.filter(user => user.rut !== rut));
  };

  const handleLike = async (rut) => {
    try {
      const [response, error] = await likeUser(rut); // Verifica que likeUser devuelva un array
      if (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error Like',
        });
      } else {
        console.log("User liked successfully", response);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Like Enviado',
        });
        setUsers(prevUsers => prevUsers.filter(user => user.rut !== rut)); // Elimina la tarjeta deslizada
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

  const handleDislike = async (rut) => {
    try {
      const [response, error] = await dislikeUser(rut); // Verifica que dislikeUser devuelva un array
      if (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error Dislike',
        });
      } else {
        console.log("User disliked successfully", response);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Dislike Enviado',
        });
        setUsers(prevUsers => prevUsers.filter(user => user.rut !== rut)); // Elimina la tarjeta deslizada
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
    <>
      <Navbar />
      <div className='main-container'>
        <h1 className="title">Usuarios Disponibles</h1>
        <div className="tinder-cards-container">
          {users.length > 0 ? (
            users.map((user) => (
              <UserCard
                key={user.rut}
                user={user}
                swiped={swiped}
                outOfFrame={outOfFrame}
                handleLike={handleLike}
                handleDislike={handleDislike}
              />
            ))
          ) : (
            <p>No users available</p> // Mensaje por si no hay usuarios
          )}
        </div>
      </div>
    </>
  );
}

export default Home;