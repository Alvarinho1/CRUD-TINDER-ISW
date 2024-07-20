import User from "../models/user.model.js";
import Alumno from "../models/alumno.model.js";
import jwt from "jsonwebtoken";
import config from "../config";
import Role from "../models/role.model.js"; // Importa el modelo de Role

// Login de Usuario
async function login(body) {
  const { correo, password } = body;

  let user = await User.findOne({ correo }).populate("roles");
  let alumno = await Alumno.findOne({ correo }).populate("roles");

  let userType = "user"; // Default user type
  if (alumno) {
    user = alumno;
    userType = "alumno";
  }

  if (!user) return [null, null, "Usuario no encontrado"];

  const matchPassword = await (userType === "alumno"
    ? Alumno.comparePassword(password, user.password)
    : User.comparePassword(password, user.password));

  if (!matchPassword) return [null, null, "Contraseña inválida"];

  const accessToken = jwt.sign({ id: user._id, type: userType }, config.SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: user._id, type: userType }, config.SECRET, {
    expiresIn: "7d",
  });

  return [accessToken, refreshToken, null];
}

// Registro de Alumno
async function registerAlumno(body) {
  const { nombre, apellidos, genero, rut, correo, carrera, cursos, areasDeInteres, password } = body;

  const alumnoFound = await Alumno.findOne({ rut });
  if (alumnoFound) return [null, null, null, "El alumno ya existe"];

  const encryptedPassword = await Alumno.encryptPassword(password);

  const role = await Role.findOne({ name: "alumno" });

  const newAlumno = new Alumno({
    nombre,
    apellidos,
    genero,
    rut,
    correo,
    carrera,
    cursos,
    areasDeInteres,
    password: encryptedPassword,
    roles: [role._id],
  });

  await newAlumno.save();

  const accessToken = jwt.sign({ id: newAlumno._id, type: "alumno" }, config.SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: newAlumno._id, type: "alumno" }, config.SECRET, {
    expiresIn: "7d",
  });

  return [newAlumno, accessToken, refreshToken, null];
}

async function refresh(cookies) {
  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(refreshToken, config.SECRET);
    const userType = decoded.type;

    const user = await (userType === "alumno" ? Alumno.findById(decoded.id) : User.findById(decoded.id));
    if (!user) return [null, "Usuario no encontrado"];

    const accessToken = jwt.sign({ id: user._id, type: userType }, config.SECRET, {
      expiresIn: "15m",
    });

    return [accessToken, null];
  } catch (error) {
    return [null, "Token inválido"];
  }
}

export default {
  login,
  registerAlumno,
  refresh,
};