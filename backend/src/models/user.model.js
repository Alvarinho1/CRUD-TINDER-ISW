"use strict";
// Importa el módulo 'mongoose' para crear la conexión a la base de datos
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Crea el esquema de la colección 'users' con las nuevas propiedades
const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    apellidos: {
      type: String,
      required: true
    },
    genero: {
      type: String,
      enum: ['masculino', 'femenino'],
      required: true
    },
    rut: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
      required: true,
      unique: true,
    },
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
      required: true
    },
    cursos: [String],
    areasDeInteres: [String],
    descripcion: [String],
    
    likes: [{
      type: mongoose.Schema.Types.Mixed,
      ref: "User"
    }],
    dislikes: [{
      type: mongoose.Schema.Types.Mixed,
      ref: "User"
    }],
    destacado: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User"
    },

    fotoPerfil: {
      type: String // Campo para almacenar la ruta de la foto de perfil
    },
    password: {
      type: String,
      required: true
    },

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],

  },
  {
    versionKey: false
  }
);

/** Encripta la contraseña del usuario */
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/** Compara la contraseña del usuario */
userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

/** Modelo de datos 'User' */
const User = mongoose.model("User", userSchema);

// Exporta el modelo de datos 'User'
export default User;
