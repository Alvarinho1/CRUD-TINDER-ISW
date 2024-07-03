"use strict";

import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Alumno from "../models/alumno.model.js";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } from "../config/configEnv.js";
import { handleError } from "../utils/errorHandler.js";

async function login(user) {
  try {
    const { email, password } = user;
    const userFound = await User.findOne({ email }).populate("roles").exec();
    if (!userFound) return [null, null, "El usuario y/o contraseña son incorrectos"];

    const matchPassword = await User.comparePassword(password, userFound.password);
    if (!matchPassword) return [null, null, "El usuario y/o contraseña son incorrectos"];

    const accessToken = jwt.sign(
      { email: userFound.email, roles: userFound.roles },
      ACCESS_JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { email: userFound.email },
      REFRESH_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return [accessToken, refreshToken, null];
  } catch (error) {
    handleError(error, "auth.service -> login");
    return [null, null, "Error al iniciar sesión"];
  }
}

async function registerAlumno(alumno) {
  try {
    const { nombre, apellidos, genero, rut, correo, carrera, cursos, areasDeInteres, password } = alumno;

    const alumnoFound = await Alumno.findOne({ rut });
    if (alumnoFound) return [null, null, null, "El alumno ya existe"];

    const newAlumno = new Alumno({
      nombre,
      apellidos,
      genero,
      rut,
      correo,
      carrera,
      cursos,
      areasDeInteres,
    });
    await newAlumno.save();

    const userRole = await Role.findOne({ name: "alumno" });
    const newUser = new User({
      username: nombre,
      rut,
      email: correo,
      password: await User.encryptPassword(password),
      roles: [userRole._id],
    });
    await newUser.save();

    const accessToken = jwt.sign(
      { email: newUser.email, roles: newUser.roles },
      ACCESS_JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { email: newUser.email },
      REFRESH_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return [newAlumno, accessToken, refreshToken, null];
  } catch (error) {
    handleError(error, "auth.service -> registerAlumno");
    return [null, null, null, error.message];
  }
}

async function refresh(cookies) {
  try {
    if (!cookies.jwt) return [null, "No hay autorización"];
    const refreshToken = cookies.jwt;

    const accessToken = await jwt.verify(
      refreshToken,
      REFRESH_JWT_SECRET,
      async (err, user) => {
        if (err) return [null, "La sesión ha caducado, vuelva a iniciar sesión"];

        const userFound = await User.findOne({ email: user.email }).populate("roles").exec();
        if (!userFound) return [null, "Usuario no autorizado"];

        const accessToken = jwt.sign(
          { email: userFound.email, roles: userFound.roles },
          ACCESS_JWT_SECRET,
          { expiresIn: "1d" }
        );

        return [accessToken, null];
      }
    );

    return accessToken;
  } catch (error) {
    handleError(error, "auth.service -> refresh");
    return [null, "Error al refrescar el token"];
  }
}

export default { login, registerAlumno, refresh };