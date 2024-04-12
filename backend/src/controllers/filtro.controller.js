import { respondSuccess, respondError } from "../utils/resHandler.js";
import AlumnoService from "../services/alumno.service.js";

async function getFiltros(req, res) {
    try {
      const [filtros, error] = await FiltroService.getFiltros();
      if (error) return respondError(req, res, 404, error);
  
      filtros.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, filtros);
    } catch (error) {
      respondError(req, res, 500, "Error interno del servidor");
    }
  }

async function createFiltro(req, res) {
  try {
    const { body } = req;
    const [filtro, error] = await AlumnoService.createFiltro(body);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 201, filtro);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function updateFiltro(req, res) {
  try {
    const { params, body } = req;
    const [updatedFiltro, error] = await AlumnoService.updateFiltro(params.id, body);

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 200, updatedFiltro);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

async function deleteFiltro(req, res) {
  try {
    const { params } = req;
    const [deletedFiltro, error] = await AlumnoService.deleteFiltro(params.id);

    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, deletedFiltro);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}
async function getFiltroById(req, res) {
    try {
      const { params } = req;
      const [filtro, error] = await FiltroService.getFiltroById(params.id);
  
      if (error) {
        return respondError(req, res, 404, error);
      }
  
      respondSuccess(req, res, 200, filtro);
    } catch (error) {
      respondError(req, res, 500, "Error interno del servidor");
    }
  }
  

export default {
  searchAndFilterAlumnos,
  createFiltro,
  updateFiltro,
  deleteFiltro,
  getFiltros,
  getFiltroById
};