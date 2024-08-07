"use strict";


import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/** Servicios de autenticación */
import AuthService from "../services/auth.service.js";
import { authLoginBodySchema} from "../schema/auth.schema.js";
import { userSchema } from "../schema/user.schema.js";
import UserController from "./user.controller.js";

/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function login(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = authLoginBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [accessToken, refreshToken, errorToken] = await AuthService.login(body);
  
    if (errorToken) return respondError(req, res, 400, errorToken);
  
    // * Existen más opciones de seguridad para las cookies *//
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });
  
    const dataUser = await UserController.getUserByEmail(body.email);
    console.log(dataUser);
    respondSuccess(req, res, 200, { accessToken, dataUser});
  } catch (error) {
    handleError(error, "auth.controller -> login");
    respondError(req, res, 400, error.message);
  }
}

/**
 * @name logout
 * @description Cierra la sesión del usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns
 */
async function logout(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return respondError(req, res, 400, "No hay token");
    res.clearCookie("jwt", { httpOnly: true });
    respondSuccess(req, res, 200, { message: "Sesión cerrada correctamente" });
  } catch (error) {
    handleError(error, "auth.controller -> logout");
    respondError(req, res, 400, error.message);
  }
}

/**
 * @name refresh
 * @description Refresca el token de acceso
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function refresh(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return respondError(req, res, 400, "No hay token");

    const [accessToken, errorToken] = await AuthService.refresh(cookies);

    if (errorToken) return respondError(req, res, 400, errorToken);

    respondSuccess(req, res, 200, { accessToken });
  } catch (error) {
    handleError(error, "auth.controller -> refresh");
    respondError(req, res, 400, error.message);
  }
}

async function register(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = userSchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const result = await AuthService.register(body);
    if (result.error) return respondError(req, res, 400, result.error);

    respondSuccess(req, res, 201, {
      message: "Usuario registrado exitosamente",
      accessToken: result.accessToken,
    });

  } catch (error) {
    handleError(error, "auth.controller -> register");
    respondError(req, res, 400, error.message);
  }
}

async function getProfile(req, res) {
  try {
    const { userId } = req.params;

    const userProfile = await AuthService.getProfile(userId);
    if (!userProfile) return respondError(req, res, 404, "Perfil no encontrado");

    respondSuccess(req, res, 200, { profile: userProfile });
  } catch (error) {
    handleError(error, "auth.controller -> getProfile");
    respondError(req, res, 400, error.message);
  }
}



export default {
  login,
  logout,
  refresh,
  register,
  getProfile
};
