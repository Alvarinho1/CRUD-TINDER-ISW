import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Form from '../components/Form';
import { profile, updateUserProfile } from '../services/auth.service';

const EditProfile = () => {
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    nombre: '',
    apellidos: '',
    descripcion: '',
    areasDeInteres: '',
    cursos: '',
  });

  useEffect(() => {
    async function fetchDataProfile() {
      try {
        const response = await profile();
        console.log("Fetched profile: ", response); // Log para verificar los datos
        setUserProfile(response);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchDataProfile();
  }, []);

  const handleFormSubmit = async (updatedData) => {
    try {
      await updateUserProfile(updatedData);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Error actualizando el perfil');
    }
  };

  return (
    <main className="edit-profile-page">
      <Navbar />
      <div className="sections">
        <img className="profile_image" src="profile.png" alt="Imagen de perfil" />
        <div className="form">
          <Form
            backgroundColor="#FFFFFF"
            title="Editar Perfil"
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
                label: "Nombre",
                name: "nombre",
                type: "text",
                value: userProfile.nombre,
                disabled: true,
              },
              {
                label: "Apellidos",
                name: "apellidos",
                type: "text",
                value: userProfile.apellidos,
                disabled: true,
              },
              {
                label: "Descripción",
                name: "descripcion",
                type: "text",
                value: userProfile.descripcion,
                required: true,
              },
              {
                label: "Áreas de Interés",
                name: "areasDeInteres",
                type: "text",
                value: userProfile.areasDeInteres,
                required: true,
              },
              {
                label: "Cursos",
                name: "cursos",
                type: "text",
                value: userProfile.cursos,
                required: true,
              },
            ]}
            buttonText="Guardar Cambios"
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </main>
  );
};

export default EditProfile;