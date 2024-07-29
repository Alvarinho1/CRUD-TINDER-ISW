import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import Navbar from "../components/Navbar";
import { profile } from "../services/auth.service";
import { updateUserProfile } from "../services/user.service";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    descripcion: '',
    areasDeInteres: [], // Inicializar como array
    cursos: [], // Inicializar como array
    carrera: ''
  });

  useEffect(() => {
    async function fetchDataProfile() {
      try {
        const { data } = await profile();
        setUserProfile({
          ...data,
          areasDeInteres: Array.isArray(data.areasDeInteres) ? data.areasDeInteres : [], // Verificar si es un array
          cursos: Array.isArray(data.cursos) ? data.cursos : [] // Verificar si es un array
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchDataProfile();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await updateUserProfile(formData);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <main className="profile_page">
      <Navbar />
      <div className="sections">
        <img className="profile_image" src="profile.png" alt="Imagen de perfil" />
        <div className="form">
          <Form
            onSubmit={handleSubmit}
            backgroundColor="#FFFFFF"
            title="Perfil"
            fields={[
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
                label: "Correo electrónico",
                name: "email",
                type: "email",
                value: userProfile.email,
                disabled: true,
              },
              {
                label: "Descripción",
                name: "descripcion",
                type: "text",
                value: userProfile.descripcion,
                disabled: false,
              },
              {
                label: "Áreas de Interés",
                name: "areasDeInteres",
                type: "text",
                value: Array.isArray(userProfile.areasDeInteres) ? userProfile.areasDeInteres.join(', ') : '', // Verificar si es un array
                disabled: false,
              },
              {
                label: "Cursos",
                name: "cursos",
                type: "text",
                value: Array.isArray(userProfile.cursos) ? userProfile.cursos.join(', ') : '', // Verificar si es un array
                disabled: false,
              },
              {
                label: "Carrera",
                name: "carrera",
                type: "text",
                value: userProfile.carrera,
                disabled: false,
              },
            ]}
            buttonText="Guardar Cambios"
          />
        </div>
      </div>
    </main>
  );
};

export default Profile;