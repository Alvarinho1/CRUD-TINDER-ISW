import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getUsers } from '../services/user.service';
import UserCard from '../pages/UserCard.jsx';
import '../styles/styles.css';

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const {data} = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div className='main-container'>
        <h1>Usuarios Disponibles</h1>
        <div className="user-cards-container">
          {users.map((user) => (
            <UserCard key={user.rut} user={user} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;