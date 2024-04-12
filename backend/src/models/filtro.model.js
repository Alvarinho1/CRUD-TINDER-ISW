import mongoose from "mongoose";

// Define el esquema de la colección 'filtros'
const filtroSchema = new mongoose.Schema({
  carrera: {
    type: String,
    enum: [
      "Arquitectura",
      "Diseño Gráfico",
      "Diseño Industrial",
      "Ingeniería en Construcción",
      "Ingeniería Civil",
      "Ingeniería Civil Eléctrica",
      "Ingeniería Civil en Automatización",
      "Ingeniería Civil Industrial",
      "Ingeniería Civil Mecánica",
      "Ingeniería Civil Química",
      "Ingeniería de Ejecución en Electricidad",
      "Ingeniería de Ejecución en Mecánica",
      "Contador Público y Auditor (Chillán)",
      "Contador Público y Auditor (Concepción)",
      "Ingeniería Civil en Informática (Chillán)",
      "Ingeniería Civil en Informática (Concepción)",
      "Ingeniería Comercial (Chillán)",
      "Ingeniería Comercial (Concepción)",
      "Ingeniería de Ejecución en Computación e Informática",
      "Pedagogía en Castellano y Comunicación",
      "Pedagogía en Ciencias Naturales mención Biología o Física o Química",
      "Pedagogía en Educación Especial con mención en Dificultades Específicas del Aprendizaje",
      "Pedagogía en Educación Física",
      "Pedagogía en Educación General Básica con mención en Lenguaje y Comunicación o Educación Matemática",
      "Pedagogía en Educación Matemática",
      "Pedagogía en Educación Parvularia Mención Didáctica en Primera Infancia",
      "Pedagogía en Historia y Geografía",
      "Pedagogía en Inglés",
      "Psicología",
      "Trabajo Social (Chillán)",
      "Trabajo Social (Concepción)",
      "Enfermería",
      "Fonoaudiología",
      "Ingeniería en Alimentos",
      "Medicina",
      "Nutrición y Dietética",
      "Programa de Bachillerato en Ciencias (Chillán)",
      "Programa de Bachillerato en Ciencias (Concepción)",
      "Ingeniería en Recursos Naturales",
      "Ingeniería Estadística",
      "Química y Farmacia"
    ],
    required: true,
  },
  curso: {
    type: String,
    // Puedes definir los cursos como desees
  },
  intereses: {
    type: [String],
    // Puedes definir los intereses como desees
  },
  genero: {
    type: String,
    enum: ['masculino', 'femenino'],
  },
  // Puedes agregar más campos según tus necesidades
});

// 'Filtro' data model
const Filtro = mongoose.model("Filtro", filtroSchema);

// Exporta el modelo 'Filtro'
export default Filtro;