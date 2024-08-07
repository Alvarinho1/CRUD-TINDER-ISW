import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Form from '../components/Form';

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    rut: '',
    rolName: '',
    descripcion: '',
    areasDeInteres: [],
    cursos: [],
  });

  useEffect(() => {
    async function fetchDataProfile() {
      try {
        const response = await getProfile();
        console.log("Fetched profile: ", response); // Log para verificar los datos
        setUserProfile(response);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchDataProfile();
  }, []);

  return (
    <main className="profile_page">
      <Navbar />
      <div className="sections">
        <img className="profile_image" src="profile.png" alt="Imagen de perfil" />
        <div className="form">
          <Form
            backgroundColor="#FFFFFF"
            title="Perfil"
            fields={[
              {
                label: "Nombre de usuario",
                name: "username",
                type: "text",
                value: userProfile.username,
                disabled: true,
              },
              {
                label: "Correo electrónico",
                name: "email",
                type: "email",
                value: userProfile.email,
                disabled: true,
              },
              {
                label: "RUT",
                name: "rut",
                type: "text",
                value: userProfile.rut,
                disabled: true,
              },
              {
                label: "Descripción",
                name: "descripcion",
                type: "text",
                value: userProfile.descripcion,
                disabled: true,
              },
              {
                label: "Áreas de Interés",
                name: "areasDeInteres",
                type: "text",
                value: userProfile.areasDeInteres.join(', '),
                disabled: true,
              },
              {
                label: "Cursos",
                name: "cursos",
                type: "text",
                value: userProfile.cursos.join(', '),
                disabled: true,
              },
            ]}
          />
        </div>
      </div>
    </main>
  );
};

export default Profile;