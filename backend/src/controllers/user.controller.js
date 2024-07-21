"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import UserService from "../services/user.service.js";
import { userSchema } from "../schema/user.schema.js"; // Asume que existe un esquema para usuarios
import MatchService from "../services/match.service.js";

// Obtener todos los usuarios
async function getUsers(req, res) {
  try {
    const [users, error] = await UserService.getUsers();
    if (error) return respondError(req, res, 404, error);

    users.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, users);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

// Crear un nuevo usuario
async function createUser(req, res) {
  try {
    const { error: validationError } = userSchema.validate(req.body);
    if (validationError) return respondError(req, res, 400, validationError.details[0].message);

    const { body } = req;
    const file = req.file;

    if (file) {
      body.fotoPerfil = file.path;
    }

    const [newUser, error] = await UserService.createUser(body);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 201, newUser);
  } catch (error) {
    // Manejo de errores específicos de multer
    if (error instanceof multer.MulterError) {
      return respondError(req, res, 400, error.message);
    } else if (error.message === 'Solo se permiten archivos .png y .jpg') {
      return respondError(req, res, 400, error.message);
    }

    respondError(req, res, 500, "Error interno del servidor");
  }
}

// Obtener un usuario por RUT
async function getUserByRut(req, res) {
  try {
    const { params } = req;
    const [user, error] = await UserService.getUserByRut(params.rut);

    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

// Actualizar un usuario por RUT
async function updateUser(req, res) {
  try {
    const { error: validationError } = userSchema.validate(req.body);
    if (validationError) return respondError(req, res, 400, validationError.details[0].message);

    const { params, body } = req;
    const [updatedUser, error] = await UserService.updateUser(params.rut, body);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, updatedUser);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

// Eliminar un usuario por RUT
async function deleteUser(req, res) {
  try {
    const { params } = req;
    const [deletedUser, error] = await UserService.deleteUser(params.rut);

    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, deletedUser);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function likeUser(req, res) {
  try {
    const { userId, likedUserId } = req.body;
    const [userLiked, error] = await UserService.likeUser(userId, likedUserId);

    const [user, errorUser] = await UserService.getUserById(userId);

    //si alumnoId tiene un like de likedAlumnoId es un match, y guardas en match
    console.log("Buscar match", likedUserId, user.likes);
    if (user && user.likes.find(like => like.userId === likedUserId)) {
      console.log("Es un match", likedUserId, user.likes);
      const [match, errorMatch] = await MatchService.createMatch(userId, likedUserId);
    }


    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, userLiked);
  } catch (error) {
    handleError(error, "user.controller -> likeUser");
    respondError(req, res, 500, "Error interno del servidor");
  }
}


async function dislikeUser(req, res) {
  try {
    const { userId, dislikedUserId } = req.body;
    const [user, error] = await UserService.dislikeUser(userId, dislikedUserId);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> dislikeUser");
    respondError(req, res, 500, "Error interno del servidor");
  }
}

// Eliminar un "like" de un usuario
async function removeLikeUser(req, res) {
  try {
    const { userId, likedUserId } = req.body;
    const [user, error] = await UserService.removeLikeUser(userId, likedUserId);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> removeLikeUser");
    respondError(req, res, 500, "Error interno del servidor");
  }
}

// Eliminar un "dislike" de un usuario
async function removeDislikeUser(req, res) {
  try {
    const { userId, dislikedUserId } = req.body;
    const [user, error] = await UserService.removeDislikeUser(userId, dislikedUserId);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> removeDislikeUser");
    respondError(req, res, 500, "Error interno del servidor");
  }
}

// Destacar perfil de un usuario
async function destacarPerfilUser(req, res) {
  try {
    const { userId, destacarUserId } = req.body;
    const [user, message] = await UserService.destacarPerfilUser(userId, destacarUserId);

    if (!user) {
      return respondError(req, res, 400, message);
    }

    respondSuccess(req, res, 200, { user, message });
  } catch (error) {
    console.error(error);
    respondError(req, res, 500, "Error interno del servidor");
  }
}

// Quitar destacado de perfil de un usuario
async function quitarDestacadoPerfilUser(req, res) {
  try {
    const { userId, destacarUserId } = req.body; // Cambiado a destacarUserId
    const [user, message] = await UserService.quitarDestacadoPerfilUser(userId, destacarUserId); // Cambiado a destacarUserId

    if (!user) {
      return respondError(req, res, 400, message);
    }

    respondSuccess(req, res, 200, { user, message });
  } catch (error) {
    console.error(error);
    respondError(req, res, 500, "Error interno del servidor");
  }
}

export default {
  getUsers,
  createUser,
  getUserByRut,
  updateUser,
  deleteUser,
  likeUser,
  dislikeUser,
  removeLikeUser,
  removeDislikeUser,
  destacarPerfilUser,
  quitarDestacadoPerfilUser,
};
