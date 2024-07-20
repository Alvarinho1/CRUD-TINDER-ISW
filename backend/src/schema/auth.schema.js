import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de inicio de sesión.
 * @constant {Object}
 */
const authLoginBodySchema = Joi.object({
  email: Joi.string().email().pattern(/@alumnos.ubiobio\.cl$/).required().messages({
    "string.empty": "El email no puede estar vacío.",
    "any.required": "El email es obligatorio.",
    "string.base": "El email debe ser de tipo string.",
    "string.email": "El email debe tener un formato válido.",
    "string.pattern.base": "El email debe terminar con '@alumnos.ubiobio.cl'.",
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
 * Esquema de validación para el cuerpo de la solicitud de registro.
 * @constant {Object}
 */
const authRegisterBodySchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "El nombre de usuario no puede estar vacío.",
    "any.required": "El nombre de usuario es obligatorio.",
    "string.base": "El nombre de usuario debe ser de tipo string.",
    "string.min": "El nombre de usuario debe tener al menos 3 caracteres.",
    "string.max": "El nombre de usuario debe tener menos de 30 caracteres.",
  }),
  email: Joi.string().email().pattern(/@alumnos\.ubiobio\.cl$/).required().messages({
    "string.empty": "El email no puede estar vacío.",
    "any.required": "El email es obligatorio.",
    "string.base": "El email debe ser de tipo string.",
    "string.email": "El email debe tener un formato válido.",
    "string.pattern.base": "El email debe terminar con '@alumnos.ubiobio.cl'.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "any.required": "La contraseña es obligatoria.",
    "string.base": "La contraseña debe ser de tipo string.",
    "string.min": "La contraseña debe tener al menos 6 caracteres.",
  }),
  rut: Joi.string().regex(/^\d{8}-[\dKk]$/).required().messages({
    "string.empty": "El RUT no puede estar vacío.",
    "any.required": "El RUT es obligatorio.",
    "string.base": "El RUT debe ser de tipo string.",
    "string.pattern.base": "El RUT debe tener un formato válido (XXXXXXXX-X).",
  }),
  roles: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Roles debe ser un array de strings.",
    "string.base": "Cada rol debe ser una cadena de texto.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

export { authLoginBodySchema, authRegisterBodySchema };
