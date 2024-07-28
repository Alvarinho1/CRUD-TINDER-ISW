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

async function register(user) {
  try {
    const { nombre, apellidos, genero, rut, email, carrera, cursos, areasDeInteres, fotoPerfil, password, roles } = user;

    // Verifica que los campos obligatorios no estén vacíos
    if (!email || !password || !rut) {
      return { error: "email, RUT y contraseña son campos obligatorios" };
    }

    // Verifica si el email ya está en uso
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) return { error: "El email ya está en uso" };

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
      nombre,
      apellidos,
      genero,
      rut,
      email,
      carrera,
      cursos,
      areasDeInteres,
      fotoPerfil,
      password: await User.encryptPassword(password),
      roles: roleIds
    });

    // Guarda el usuario en la base de datos
    const savedUser = await newUser.save();

    // Genera el token de acceso
    const accessToken = jwt.sign(
      { email: savedUser.email, roles: savedUser.roles },
      ACCESS_JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { error: null, accessToken };

  } catch (error) {
    // Maneja los errores y devuelve un mensaje apropiado
    if (error.code === 11000) {
      return { error: "El email electrónico o RUT ya están en uso." };
    }
    handleError(error, "auth.service -> register");
    return { error: error.message };
  }
}

async function profile(userId) {
  try {
    const user = await User.findById(userId).populate("roles").exec();
    if (!user) {
      return [null, "El usuario no existe"];
    }
    return [user, null];
  } catch (error) {
    handleError(error, "auth.service -> profile");
    return [null, "Error al obtener el perfil del usuario"];
  }
}




export default { login, refresh, register, profile };
