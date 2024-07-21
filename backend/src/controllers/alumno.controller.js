import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import AlumnoService from "../services/alumno.service.js";
import { alumnoBodySchema } from "../schema/alumno.schema.js";
import MatchService from "../services/match.service.js";

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
    const file = req.file;

    if (file) {
      body.fotoPerfil = file.path;
    }

    const [newAlumno, error] = await AlumnoService.createAlumno(body);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 201, newAlumno);
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
    const [alumnoLiked, error] = await AlumnoService.likeAlumno(alumnoId, likedAlumnoId);

    const [alumno, errorAlumno] = await AlumnoService.getAlumnoById(alumnoId);

    //si alumnoId tiene un like de likedAlumnoId es un match, y guardas en match
    console.log("Buscar match", likedAlumnoId, alumno.likes);
    if (alumno && alumno.likes.find(like => like.alumnoId === likedAlumnoId)) {
      console.log("Es un match", likedAlumnoId, alumno.likes);
      const [match, errorMatch] = await MatchService.createMatch(alumnoId, likedAlumnoId);
    }


    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, alumnoLiked);
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


async function destacarPerfilAlumno(req, res) {
  try {
    const { alumnoId, destacarAlumnoId } = req.body;
    const [alumno, message] = await AlumnoService.destacarPerfilAlumno(alumnoId, destacarAlumnoId);

    if (!alumno) {
      return respondError(req, res, 400, message);
    }

    respondSuccess(req, res, 200, { alumno, message });
  } catch (error) {
    console.error(error);
    respondError(req, res, 500, "Error interno del servidor");
  }
}


async function quitarDestacadoPerfilAlumno(req, res) {
  try {
    const { alumnoId, destacarAlumnoId } = req.body; // Cambiado a destacarAlumnoId
    const [alumno, message] = await AlumnoService.quitarDestacadoPerfilAlumno(alumnoId, destacarAlumnoId); // Cambiado a destacarAlumnoId

    if (!alumno) {
      return respondError(req, res, 400, message);
    }

    respondSuccess(req, res, 200, { alumno, message });
  } catch (error) {
    console.error(error);
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
  destacarPerfilAlumno,
  quitarDestacadoPerfilAlumno,
};
