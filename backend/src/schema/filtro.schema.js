import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud del filtro.
 * @constant {Object}
 */
const filtroBodySchema = Joi.object({
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
  curso: Joi.string().allow("", null).optional().messages({
    "any.allowOnly": "El curso proporcionado no es válido.",
    "string.base": "El curso debe ser de tipo string.",
  }),
  intereses: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Los intereses deben ser de tipo array.",
    "string.base": "Cada interés debe ser de tipo string.",
  }),
  genero: Joi.string().valid("masculino", "femenino").optional().messages({
    "any.only": "El género proporcionado no es válido.",
    "string.base": "El género debe ser de tipo string.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

export { filtroBodySchema };