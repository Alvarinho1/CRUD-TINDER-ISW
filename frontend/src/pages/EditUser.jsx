import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Form from '../components/Form';
import { profile, updateUserProfile } from '../services/auth.service';

const EditProfile = () => {
  const [userProfile, setUserProfile] = useState({
    email: '',
    nombre: '',
    apellidos: '',
    rut: '',
    genero: '',
    carrera: '',
    cursos: '',
    areasDeInteres: '',
    fotoPerfil: null,
    password: '', // Añadido
    descripcion: '', // Añadido
  });

  useEffect(() => {
    async function fetchDataProfile() {
      try {
        const response = await profile();
        console.log("Fetched profile: ", response); // Log para verificar los datos

        if (response.state === "Success") {
          setUserProfile({
            email: response.data.email || '',
            nombre: response.data.nombre || '',
            apellidos: response.data.apellidos || '',
            rut: response.data.rut || '',
            genero: response.data.genero || '',
            carrera: response.data.carrera || '',
            cursos: response.data.cursos || '',
            areasDeInteres: response.data.areasDeInteres || '',
            fotoPerfil: response.data.fotoPerfil || null,
            password: '', // Inicializar el campo de contraseña vacío
            descripcion: response.data.descripcion || '', // Añadido
          });
        } else {
          console.error("Error en la respuesta del perfil:", response.message);
        }
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

  const handleFileChange = (event) => {
    setUserProfile({ ...userProfile, fotoPerfil: event.target.files[0] });
  };

  const nonEditableFields = {
    nombre: true,
    apellidos: true,
    rut: true,
    genero: true,
    email: true,
    carrera: true,
  };

  return (
    <main className="edit-profile-page">
      <Navbar />
      <div className="sections">
        <img
          className="profile_image"
          src={userProfile.fotoPerfil ? URL.createObjectURL(userProfile.fotoPerfil) : "profile.png"}
          alt="Imagen de perfil"
        />
        <div className="form">
          <Form
            backgroundColor="#FFFFFF"
            title="Editar Perfil"
            fields={[
              {
                label: "Nombre",
                name: "nombre",
                placeholder: "Alvaro",
                type: "text",
                value: userProfile.nombre,
                required: true,
                disabled: nonEditableFields.nombre,
              },
              {
                label: "Apellidos",
                name: "apellidos",
                placeholder: "Jorquera Godoy",
                type: "text",
                value: userProfile.apellidos,
                required: true,
                disabled: nonEditableFields.apellidos,
              },
              {
                label: "RUT",
                name: "rut",
                placeholder: "12345678-9",
                type: "text",
                value: userProfile.rut,
                required: true,
                pattern: "^[0-9]{7,8}-[0-9kK]$",
                disabled: nonEditableFields.rut,
              },
              {
                label: "Género",
                name: "genero",
                type: "text",
                value: userProfile.genero,
                disabled: nonEditableFields.genero,
                placeholder: "Selecciona tu género",
              },
              {
                label: "Correo electrónico",
                name: "email",
                placeholder: "alvaro@alumnos.ubiobio.cl",
                type: "email",
                value: userProfile.email,
                required: true,
                disabled: nonEditableFields.email,
              },
              {
                label: "Carrera",
                name: "carrera",
                type: "text",
                value: userProfile.carrera,
                disabled: nonEditableFields.carrera,
              },
              {
                label: "Contraseña",
                name: "password",
                type: "password",
                value: userProfile.password,
                placeholder: "********",
                required: false,
              },
              {
                label: "Descripción",
                name: "descripcion",
                placeholder: "Tu descripción personal",
                type: "text",
                value: userProfile.descripcion,
                required: false,
              },
              {
                label: "Cursos",
                name: "cursos",
                placeholder: "Metodología de Desarrollo, Ing Software",
                type: "text",
                value: userProfile.cursos,
                required: false,
              },
              {
                label: "Áreas de Interés",
                name: "areasDeInteres",
                placeholder: "Basketball, Futbol",
                type: "text",
                value: userProfile.areasDeInteres,
                required: false,
              },
              {
                label: "Foto de perfil",
                name: "fotoPerfil",
                type: "file",
                onChange: handleFileChange,
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
