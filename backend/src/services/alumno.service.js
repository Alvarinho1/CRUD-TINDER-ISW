import Alumno from "../models/alumno.model.js";
import { handleError } from "../utils/errorHandler.js";

async function getAlumnos() {
  try {
    const alumnos = await Alumno.find().exec();
    if (!alumnos) return [null, "No hay alumnos"];
    return [alumnos, null];
  } catch (error) {
    handleError(error, "alumno.service -> getAlumnos");
    return [null, error.message];
  }
}

async function createAlumno(alumno) {
  try {
    const { nombre, apellidos, genero, rut, correo, carrera, cursos, areasDeInteres } = alumno;

    const alumnoFound = await Alumno.findOne({ rut: alumno.rut });
    if (alumnoFound) return [null, "El alumno ya existe"];

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

    return [newAlumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> createAlumno");
    return [null, error.message];
  }
}

async function getAlumnoByRut(rut) {
  try {
    const alumno = await Alumno.findOne({ rut }).exec();
    if (!alumno) return [null, "El alumno no existe"];
    return [alumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> getAlumnoByRut");
    return [null, error.message];
  }
}

async function updateAlumno(rut, alumno) {
  try {
    const alumnoFound = await Alumno.findOne({ rut });
    if (!alumnoFound) return [null, "El alumno no existe"];

    const { nombre, apellidos, genero, correo, carrera, cursos, areasDeInteres } = alumno;

    const alumnoUpdated = await Alumno.findOneAndUpdate(
      { rut },
      {
        nombre,
        apellidos,
        genero,
        correo,
        carrera,
        cursos,
        areasDeInteres,
      },
      { new: true },
    );

    return [alumnoUpdated, null];
  } catch (error) {
    handleError(error, "alumno.service -> updateAlumno");
    return [null, error.message];
  }
}

async function deleteAlumno(rut) {
  try {
    const alumnoDeleted = await Alumno.findOneAndDelete({ rut });
    if (!alumnoDeleted) return [null, "El alumno no existe"];
    return [alumnoDeleted, null];
  } catch (error) {
    handleError(error, "alumno.service -> deleteAlumno");
    return [null, error.message];
  }
}

async function likeAlumno(alumnoId, likedAlumnoId) {
  try {
    const likedAlumno = await Alumno.findById(likedAlumnoId);
    if (!likedAlumno) return [null, "El alumno que recibe el like no existe"];

    if (likedAlumno.likes.includes(alumnoId)) {
      return [null, "El alumno ya ha recibido like de esta persona"];
    }

    likedAlumno.likes.push(alumnoId);
    await likedAlumno.save();

    return [likedAlumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> likeAlumno");
    return [null, error.message];
  }
}

async function dislikeAlumno(alumnoId, dislikedAlumnoId) {
  try {
    const dislikedAlumno = await Alumno.findById(dislikedAlumnoId);
    if (!dislikedAlumno) return [null, "El alumno que recibe el dislike no existe"];

    if (dislikedAlumno.dislikes.includes(alumnoId)) {
      return [null, "El alumno ya ha recibido dislike de esta persona"];
    }

    dislikedAlumno.dislikes.push(alumnoId);
    await dislikedAlumno.save();

    return [dislikedAlumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> dislikeAlumno");
    return [null, error.message];
  }
}

async function removeLikeAlumno(alumnoId, likedAlumnoId) {
  try {
    const likedAlumno = await Alumno.findById(likedAlumnoId);
    if (!likedAlumno) return [null, "El alumno que recibe el like no existe"];

    const index = likedAlumno.likes.indexOf(alumnoId);
    if (index === -1) return [null, "El alumno no ha recibido like de esta persona"];

    likedAlumno.likes.splice(index, 1);
    await likedAlumno.save();

    return [likedAlumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> removeLikeAlumno");
    return [null, error.message];
  }
}

async function removeDislikeAlumno(alumnoId, dislikedAlumnoId) {
  try {
    const dislikedAlumno = await Alumno.findById(dislikedAlumnoId);
    if (!dislikedAlumno) return [null, "El alumno que recibe el dislike no existe"];

    const index = dislikedAlumno.dislikes.indexOf(alumnoId);
    if (index === -1) return [null, "El alumno no ha recibido dislike de esta persona"];

    dislikedAlumno.dislikes.splice(index, 1);
    await dislikedAlumno.save();

    return [dislikedAlumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> removeDislikeAlumno");
    return [null, error.message];
  }
}

export default {
  getAlumnos,
  createAlumno,
  getAlumnoByRut,
  updateAlumno,
  deleteAlumno,
  likeAlumno,
  dislikeAlumno,
  removeLikeAlumno,
  removeDislikeAlumno,
};
