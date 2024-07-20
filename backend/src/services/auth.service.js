"use strict";

/** Modelo de datos 'User' */
import User from "../models/user.model.js";
/** Modulo 'jsonwebtoken' para crear tokens */

import jwt from "jsonwebtoken";

import Role from "../models/role.model.js";

import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } from "../config/configEnv.js";

import { handleError } from "../utils/errorHandler.js";

/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} user - Objeto de usuario
 */
async function login(user) {
  try {
    const { email, password } = user;

    const userFound = await User.findOne({ email: email })
      .populate("roles")
      .exec();
    if (!userFound) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    const matchPassword = await User.comparePassword(
      password,
      userFound.password,
    );

    if (!matchPassword) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    const accessToken = jwt.sign(
      { email: userFound.email, roles: userFound.roles },
      ACCESS_JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    const refreshToken = jwt.sign(
      { email: userFound.email },
      REFRESH_JWT_SECRET,
      {
        expiresIn: "7d", // 7 días
      },
    );

    return [accessToken, refreshToken, null];
  } catch (error) {
    handleError(error, "auth.service -> signIn");
  }
}

/**
 * Refresca el token de acceso
 * @async
 * @function refresh
 * @param {Object} cookies - Objeto de cookies
 */
async function refresh(cookies) {
  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(refreshToken, config.SECRET);
    const userType = decoded.type;

    const accessToken = await jwt.verify(
      refreshToken,
      REFRESH_JWT_SECRET,
      async (err, user) => {
        if (err) return [null, "La sesion a caducado, vuelva a iniciar sesion"];

        const userFound = await User.findOne({
          email: user.email,
        })
          .populate("roles")
          .exec();

        if (!userFound) return [null, "No usuario no autorizado"];

        const accessToken = jwt.sign(
          { email: userFound.email, roles: userFound.roles },
          ACCESS_JWT_SECRET,
          {
            expiresIn: "1d",
          },
        );

        return [accessToken, null];
      },
    );

    return accessToken;
  } catch (error) {
    handleError(error, "auth.service -> refresh");
  }
}

/**
 * Registra un nuevo usuario.
 * @async
 * @function register
 * @param {Object} user - Objeto de usuario
 * @returns {Object} Resultado del registro
 */
async function register(user) {
  try {
    const { username, email, password, rut, roles } = user;

    // Verifica si el email ya está en uso
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) return { error: "El email ya está en uso" };

    // Verifica si el nombre de usuario ya está en uso
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) return { error: "El nombre de usuario ya está en uso" };

    // Verifica si el RUT ya está en uso
    const existingUserByRUT = await User.findOne({ rut });
    if (existingUserByRUT) return { error: "El RUT ya está en uso" };

    let roleIds = [];

    if (!roles || roles.length === 0) {
      // Si no se proporcionan roles, asigna el rol por defecto "user"
      const role = await Role.findOne({ name: "user" });
      if (role) {
        roleIds = [role._id]; // Asigna el ID del rol "user"
      } else {
        return { error: "El rol 'user' no existe en la base de datos" };
      }
    } else {
      // Verifica si los roles proporcionados existen en la base de datos
      const foundRoles = await Role.find({ name: { $in: roles } });
      if (foundRoles.length !== roles.length) {
        return { error: "Uno o más roles no existen en la base de datos" };
      }
      roleIds = foundRoles.map(role => role._id); // Extrae los IDs de los roles encontrados
    }

    // Crea un nuevo usuario con los IDs de roles
    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
      rut,
      roles: roleIds
    });
    const savedUser = await newUser.save(); // Guarda el usuario en la base de datos

    console.log("Usuario guardado:", savedUser); // Muestra el usuario guardado en la consola

    // Genera el token de acceso
    const accessToken = jwt.sign(
      { email: savedUser.email, roles: savedUser.roles },
      ACCESS_JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { error: null, accessToken };

  } catch (error) {
    handleError(error, "auth.service -> register");
    return { error: error.message };
  }
}
/**
 * Obtiene el perfil del usuario.
 * @async
 * @function getProfile
 * @param {String} userId - ID del usuario
 */
async function getProfile(userId) {
  try {
    const user = await User.findById(userId).populate("roles").exec();
    if (!user) return null;

    return {
      username: user.username,
      email: user.email,
      roles: user.roles,
      rut: user.rut,
    };
  } catch (error) {
    handleError(error, "auth.service -> getProfile");
    return null;
  }
}


export default { login, refresh, register, getProfile };
