"use strict";
// Autorización - Comprobar el rol del usuario
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Comprueba si el usuario es administrador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isAdmin(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email }).populate("roles");
    if (!user) return respondError(req, res, 404, "Usuario no encontrado");

    const isAdmin = user.roles.some(role => role.name === "admin");
    if (isAdmin) {
      next();
    } else {
      respondError(req, res, 401, "Se requiere un rol de administrador para realizar esta acción");
    }
  } catch (error) {
    handleError(error, "authorization.middleware -> isAdmin");
  }
}

/**
 * Comprueba si el usuario es usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isUser(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email }).populate("roles");
    if (!user) return respondError(req, res, 404, "Usuario no encontrado");

    const isUser = user.roles.some(role => role.name === "user"); // Asegúrate de que "user" es el nombre correcto del rol
    if (isUser) {
      next();
    } else {
      respondError(req, res, 401, "Se requiere un rol de usuario para realizar esta acción");
    }
  } catch (error) {
    handleError(error, "authorization.middleware -> isUser");
  }
}

export { isAdmin, isUser };
