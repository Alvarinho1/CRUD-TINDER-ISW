"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import AuthService from "../services/auth.service.js";
import { authLoginBodySchema, authRegisterBodySchema } from "../schema/auth.schema.js";

async function login(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = authLoginBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [accessToken, refreshToken, errorToken] =
      await AuthService.login(body);

    if (errorToken) return respondError(req, res, 400, errorToken);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    respondSuccess(req, res, 200, { accessToken });
  } catch (error) {
    handleError(error, "auth.controller -> login");
    respondError(req, res, 400, error.message);
  }
}

async function registerAlumno(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = authRegisterBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [newAlumno, accessToken, refreshToken, error] = await AuthService.registerAlumno(body);

    if (error) return respondError(req, res, 400, error);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    respondSuccess(req, res, 201, { newAlumno, accessToken });
  } catch (error) {
    handleError(error, "auth.controller -> registerAlumno");
    respondError(req, res, 500, "Error interno del servidor");
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

export default {
  login,
  logout,
  refresh,
  registerAlumno,
};
