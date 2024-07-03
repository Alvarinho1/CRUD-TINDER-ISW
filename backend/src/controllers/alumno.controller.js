import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import AlumnoService from "../services/alumno.service.js";
import { alumnoBodySchema } from "../schema/alumno.schema.js";

async function getAlumnos(req, res) {
  try {
    const [alumnos, error] = await AlumnoService.getAlumnos();
    if (error) return respondError(req, res, 404, error);

    alumnos.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, alumnos);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function createAlumno(req, res) {
  try {
    const { error: validationError } = alumnoBodySchema.validate(req.body);
    if (validationError) return respondError(req, res, 400, validationError.details[0].message);

    const { body } = req;
    const [newAlumno, error] = await AlumnoService.createAlumno(body);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 201, newAlumno);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function getAlumnoByRut(req, res) {
  try {
    const { params } = req;
    const [alumno, error] = await AlumnoService.getAlumnoByRut(params.rut);

    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, alumno);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function updateAlumno(req, res) {
  try {
    const { error: validationError } = alumnoBodySchema.validate(req.body);
    if (validationError) return respondError(req, res, 400, validationError.details[0].message);

    const { params, body } = req;
    const [updatedAlumno, error] = await AlumnoService.updateAlumno(params.rut, body);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, updatedAlumno);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function deleteAlumno(req, res) {
  try {
    const { params } = req;
    const [deletedAlumno, error] = await AlumnoService.deleteAlumno(params.rut);

    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, deletedAlumno);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function likeAlumno(req, res) {
  try {
    const { alumnoId, likedAlumnoId } = req.body;
    const [alumno, error] = await AlumnoService.likeAlumno(alumnoId, likedAlumnoId);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, alumno);
  } catch (error) {
    handleError(error, "alumno.controller -> likeAlumno");
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function dislikeAlumno(req, res) {
  try {
    const { alumnoId, dislikedAlumnoId } = req.body;
    const [alumno, error] = await AlumnoService.dislikeAlumno(alumnoId, dislikedAlumnoId);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, alumno);
  } catch (error) {
    handleError(error, "alumno.controller -> dislikeAlumno");
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function removeLikeAlumno(req, res) {
  try {
    const { alumnoId, likedAlumnoId } = req.body;
    const [alumno, error] = await AlumnoService.removeLikeAlumno(alumnoId, likedAlumnoId);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, alumno);
  } catch (error) {
    handleError(error, "alumno.controller -> removeLikeAlumno");
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function removeDislikeAlumno(req, res) {
  try {
    const { alumnoId, dislikedAlumnoId } = req.body;
    const [alumno, error] = await AlumnoService.removeDislikeAlumno(alumnoId, dislikedAlumnoId);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, alumno);
  } catch (error) {
    handleError(error, "alumno.controller -> removeDislikeAlumno");
    respondError(req, res, 500, "Error interno del servidor");
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
