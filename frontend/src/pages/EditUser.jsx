import React from "react";
import Form from "../components/Form";
import Navbar from "../components/Navbar";
import { updateUser } from "../services/user.service";
import { useLocation, useNavigate } from "react-router-dom";

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state;

  const modUser = (data) => {
    updateUser(data, user.email)  // Usar el correo electrónico en lugar del RUT
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
          <Form
            title="Editar usuario"
            fields={[
              {
                label: "Nombre de usuario",
                name: "nombre",
                placeholder: user.nombre || "Didudo",
                type: "text",
                value: user.nombre,
              },
              {
                label: "Correo electrónico",
                name: "email",
                placeholder: user.email || "example@gmail.com",
                type: "email",
                value: user.email,
              },
              {
                label: "Nombre de rol",
                name: "rol",
                placeholder: user.rol || "user",
                type: "text",
                value: user.rol,
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