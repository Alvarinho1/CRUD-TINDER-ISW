import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { ToastContainer, toast } from 'react-toastify'; // Importa ToastContainer y toast
import { register } from '../services/auth.service.js';
import Form from "../components/Form";
import ImgLogo from "../components/ImgLogo";
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de react-toastify

const Register = () => {
    const navigate = useNavigate();

    // Función para manejar el envío del formulario
    const registerSubmit = async (data) => {
        try {
            await register(data);
            Swal.fire({
                title: 'Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                navigate('/'); // Redirige al usuario a la página principal
            });
        } catch (error) {
            console.error('Error al registrarse:', error);
            let errorMessage = 'Ocurrió un error al registrarse.';

            // Verifica si hay una respuesta del backend
            if (error.response && error.response.data) {
                const { details } = error.response.data;

                // Si hay detalles del error, extrae y muestra el mensaje específico
                if (details) {
                    const rutError = details.rut; // Extrae el mensaje específico para 'rut'
                    if (rutError) {
                        errorMessage = rutError; // Usa el mensaje específico
                    }
                }
            }

            // Muestra la notificación de error
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <main className="container">
            <ImgLogo />
            <Form
                title="Crea tu cuenta"
                fields={[
                    {
                        label: "Nombre",
                        name: "nombre",
                        placeholder: "Alvaro",
                        type: "text",
                        required: true,
                    },
                    {
                        label: "Apellidos",
                        name: "apellidos",
                        placeholder: "Jorquera Godoy",
                        type: "text",
                        required: true,
                    },
                    {
                        label: "RUT",
                        name: "rut",
                        placeholder: "12345678-9",
                        type: "text",
                        required: true,
                        pattern: "^[0-9]{7,8}-[0-9kK]$",
                    },
                    {
                        label: "Género",
                        name: "genero",
                        type: "select",
                        required: true,
                        placeholder: "Selecciona tu género",
                        options: [
                            { label: "Selecciona tu género", value: "" },
                            { label: "Masculino", value: "masculino" },
                            { label: "Femenino", value: "femenino" },
                        ],
                    },
                    {
                        label: "Correo electrónico",
                        name: "email",
                        placeholder: "alvaro@alumnos.ubiobio.cl",
                        type: "email",
                        required: true,
                    },
                    {
                        label: "Contraseña",
                        name: "password",
                        placeholder: "*********",
                        type: "password",
                        required: true,
                    },
                    {
                        label: "Carrera",
                        name: "carrera",
                        type: "select",
                        required: true,
                        placeholder: "Selecciona tu carrera",
                        options: [
                            { label: "Selecciona tu carrera", value: "" },
                            { label: "Arquitectura", value: "Arquitectura" },
                            { label: "Diseño Gráfico", value: "Diseño Gráfico" },
                            { label: "Diseño Industrial", value: "Diseño Industrial" },
                            { label: "Ingeniería en Construcción", value: "Ingeniería en Construcción" },
                            { label: "Ingeniería Civil", value: "Ingeniería Civil" },
                            { label: "Ingeniería Civil Eléctrica", value: "Ingeniería Civil Eléctrica" },
                            { label: "Ingeniería Civil en Automatización", value: "Ingeniería Civil en Automatización" },
                            { label: "Ingeniería Civil Industrial", value: "Ingeniería Civil Industrial" },
                            { label: "Ingeniería Civil Mecánica", value: "Ingeniería Civil Mecánica" },
                            { label: "Ingeniería Civil Química", value: "Ingeniería Civil Química" },
                            { label: "Ingeniería de Ejecución en Electricidad", value: "Ingeniería de Ejecución en Electricidad" },
                            { label: "Ingeniería de Ejecución en Mecánica", value: "Ingeniería de Ejecución en Mecánica" },
                            { label: "Contador Público y Auditor (Chillán)", value: "Contador Público y Auditor (Chillán)" },
                            { label: "Contador Público y Auditor (Concepción)", value: "Contador Público y Auditor (Concepción)" },
                            { label: "Ingeniería Civil en Informática (Chillán)", value: "Ingeniería Civil en Informática (Chillán)" },
                            { label: "Ingeniería Civil en Informática (Concepción)", value: "Ingeniería Civil en Informática (Concepción)" },
                            { label: "Ingeniería Comercial (Chillán)", value: "Ingeniería Comercial (Chillán)" },
                            { label: "Ingeniería Comercial (Concepción)", value: "Ingeniería Comercial (Concepción)" },
                            { label: "Ingeniería de Ejecución en Computación e Informática", value: "Ingeniería de Ejecución en Computación e Informática" },
                            { label: "Pedagogía en Castellano y Comunicación", value: "Pedagogía en Castellano y Comunicación" },
                            { label: "Pedagogía en Ciencias Naturales mención Biología o Física o Química", value: "Pedagogía en Ciencias Naturales mención Biología o Física o Química" },
                            { label: "Pedagogía en Educación Especial con mención en Dificultades Específicas del Aprendizaje", value: "Pedagogía en Educación Especial con mención en Dificultades Específicas del Aprendizaje" },
                            { label: "Pedagogía en Educación Física", value: "Pedagogía en Educación Física" },
                            { label: "Pedagogía en Educación General Básica con mención en Lenguaje y Comunicación o Educación Matemática", value: "Pedagogía en Educación General Básica con mención en Lenguaje y Comunicación o Educación Matemática" },
                            { label: "Pedagogía en Educación Matemática", value: "Pedagogía en Educación Matemática" },
                            { label: "Pedagogía en Educación Parvularia Mención Didáctica en Primera Infancia", value: "Pedagogía en Educación Parvularia Mención Didáctica en Primera Infancia" },
                            { label: "Pedagogía en Historia y Geografía", value: "Pedagogía en Historia y Geografía" },
                            { label: "Pedagogía en Inglés", value: "Pedagogía en Inglés" },
                            { label: "Psicología", value: "Psicología" },
                            { label: "Trabajo Social (Chillán)", value: "Trabajo Social (Chillán)" },
                            { label: "Trabajo Social (Concepción)", value: "Trabajo Social (Concepción)" },
                            { label: "Enfermería", value: "Enfermería" },
                            { label: "Fonoaudiología", value: "Fonoaudiología" },
                            { label: "Ingeniería en Alimentos", value: "Ingeniería en Alimentos" },
                            { label: "Medicina", value: "Medicina" },
                            { label: "Nutrición y Dietética", value: "Nutrición y Dietética" },
                            { label: "Programa de Bachillerato en Ciencias (Chillán)", value: "Programa de Bachillerato en Ciencias (Chillán)" },
                            { label: "Programa de Bachillerato en Ciencias (Concepción)", value: "Programa de Bachillerato en Ciencias (Concepción)" },
                            { label: "Ingeniería en Recursos Naturales", value: "Ingeniería en Recursos Naturales" },
                            { label: "Ingeniería Estadística", value: "Ingeniería Estadística" },
                            { label: "Química y Farmacia", value: "Química y Farmacia" }
                        ],
                    },
                    {
                        label: "Cursos",
                        name: "cursos",
                        placeholder: "Metodología de Desarrollo, Ing Software",
                        type: "text",
                        required: false,
                    },
                    {
                        label: "Áreas de Interés",
                        name: "areasDeInteres",
                        placeholder: "Basketball, Futbol",
                        type: "text",
                        required: false,
                    },
                    {
                        label: "Foto de perfil", // Agrega el campo para la foto de perfil
                        name: "fotoPerfil",
                        type: "file",
                        required: false,
                    },
                    
                    
                ]}
                buttonText="Registrarse"
                onSubmit={registerSubmit}
                footerContent={
                    <p>
                        ¿Ya tienes cuenta?, <a href="/">Inicia sesión aquí!</a>
                    </p>
                }
                backgroundColor="#f0f0f0"
                textColor="#333"
            />
            <ToastContainer /> {/* Añade ToastContainer para mostrar las notificaciones */}
        </main>
    );
};

export default Register;