"use strict";

import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de inicio de sesión.
 * @constant {Object}
 */
const authLoginBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "El email no puede estar vacío.",
    "any.required": "El email es obligatorio.",
    "string.base": "El email debe ser de tipo string.",
    "string.email": "El email debe tener un formato válido.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "any.required": "La contraseña es obligatoria.",
    "string.base": "La contraseña debe ser de tipo string.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

/**
 * Esquema de validación para el cuerpo de la solicitud de registro de alumnos.
 * @constant {Object}
 */
const authRegisterBodySchema = Joi.object({
  nombre: Joi.string().required().messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo string.",
  }),
  apellidos: Joi.string().required().messages({
    "string.empty": "Los apellidos no pueden estar vacíos.",
    "any.required": "Los apellidos son obligatorios.",
    "string.base": "Los apellidos deben ser de tipo string.",
  }),
  genero: Joi.string().valid("masculino", "femenino").required().messages({
    "any.only": "El género proporcionado no es válido.",
    "any.required": "El género es obligatorio.",
    "string.base": "El género debe ser de tipo string.",
  }),
  rut: Joi.string().required().min(9).max(10).pattern(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/).messages({
    "string.empty": "El rut no puede estar vacío.",
    "any.required": "El rut es obligatorio.",
    "string.base": "El rut debe ser de tipo string.",
    "string.min": "El rut debe tener al menos 9 caracteres.",
    "string.max": "El rut debe tener al menos 10 caracteres.",
    "string.pattern.base": "El rut tiene el formato XXXXXXXX-X, ejemplo: 12345678-9.",
  }),
  correo: Joi.string().email().required().pattern(/^[a-zA-Z0-9._%+-]+@alumnos\.ubiobio\.cl$/).messages({
    "string.empty": "El correo electrónico no puede estar vacío.",
    "any.required": "El correo electrónico es obligatorio.",
    "string.email": "El correo electrónico debe tener un formato válido.",
    "string.pattern.base": "El correo electrónico debe tener la extensión @alumnos.ubiobio.cl.",
  }),
  carrera: Joi.string().valid(
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
  ).required().messages({
    "any.only": "La carrera proporcionada no es válida.",
    "any.required": "La carrera es obligatoria.",
    "string.base": "La carrera debe ser de tipo string.",
  }),
  cursos: Joi.array().items(Joi.string()).messages({
    "array.base": "Los cursos deben ser de tipo array.",
    "any.required": "Los cursos son obligatorios.",
    "string.base": "Cada curso debe ser de tipo string.",
  }),
  areasDeInteres: Joi.array().items(Joi.string()).messages({
    "array.base": "Las áreas de interés deben ser de tipo array.",
    "any.required": "Las áreas de interés son obligatorias.",
    "string.base": "Cada área de interés debe ser de tipo string.",
  }),
  password: Joi.string().required().min(5).messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "any.required": "La contraseña es obligatoria.",
    "string.base": "La contraseña debe ser de tipo string.",
    "string.min": "La contraseña debe tener al menos 5 caracteres.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

export { authLoginBodySchema, authRegisterBodySchema };
