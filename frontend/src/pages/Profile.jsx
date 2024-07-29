import React from "react";
import FormEdit from "../components/Form";
import Navbar from "../components/Navbar";
import { updateUser } from "../services/user.service";
import { useLocation, useNavigate } from "react-router-dom";

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = location.state; // Asumiendo que los datos del usuario vienen de location.state como userProfile

  const modUser = (data) => {
    updateUser(data, userProfile.email)
      .then(response => {
        console.log("User updated successfully:", response);
        navigate('/users');
      })
      .catch(error => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="form-container">
        <div className="form-wrapper">
          <FormEdit
            title="Editar usuario"
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
            buttonText="Guardar cambios"
            onSubmit={modUser}
          />
        </div>
      </div>
    </>
  );
};

export default EditUser;
