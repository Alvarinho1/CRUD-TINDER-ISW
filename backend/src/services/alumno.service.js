"use strict";

import Alumno from "../models/alumno.model.js";
import { handleError } from "../utils/errorHandler.js";

async function getAlumnos() {
  try {
    const alumnos = await Alumno.find().exec();
    if (!alumnos) return [null, "No hay alumnos"];

    return [alumnos, null];
  } catch (error) {
    handleError(error, "alumno.service -> getAlumnos");
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
  }
}

async function getAlumnoByRut(rut) {
  try {
    const alumno = await Alumno.findOne({ rut }).exec();
    if (!alumno) return [null, "El alumno no existe"];

    return [alumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> getAlumnoByRut");
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
  }
}

async function deleteAlumno(rut) {
  try {
    return await Alumno.findOneAndDelete({ rut });
  } catch (error) {
    handleError(error, "alumno.service -> deleteAlumno");
  }
}

export default {
  getAlumnos,
  createAlumno,
  getAlumnoByRut,
  updateAlumno,
  deleteAlumno,
};