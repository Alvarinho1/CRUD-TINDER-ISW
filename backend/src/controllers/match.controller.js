import { respondSuccess, respondError } from "../utils/resHandler.js";
import MatchService from "../services/match.service.js";

async function getMatches(req, res) {
    try {
        const [matches, error] = await MatchService.getMatches();
        if (error) return respondError(req, res, 404, error);

        matches.length === 0
            ? respondSuccess(req, res, 204, "No hay matches disponibles")
            : respondSuccess(req, res, 200, matches);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function getMatch(req, res) {
    try {
        const { params } = req;
        const [match, error] = await MatchService.getMatchById(params.id);

        if (error) return respondError(req, res, 404, error);

        respondSuccess(req, res, 200, match);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function getMatchesByMail(req, res) {
    try {
      const { email } = req.params;
      const [matches, error] = await MatchService.getMatchesByMail(email);
  
      if (error) return respondError(req, res, 404, error);
  
      matches.length === 0
        ? respondSuccess(req, res, 204, "No hay matches para este usuario")
        : respondSuccess(req, res, 200, matches);
    } catch (error) {
      respondError(req, res, 500, "Error interno del servidor");
    }
  }
  async function getMatchesByEmail(req, res) {
    try {
      const { id } = req.params;
      const [matches, error] = await MatchService.getMatchesByEmail(id);
  
      if (error) return respondError(req, res, 404, error);
  
      matches.length === 0
        ? respondSuccess(req, res, 204, "No hay matches para este usuario")
        : respondSuccess(req, res, 200, matches);
    } catch (error) {
      respondError(req, res, 500, "Error interno del servidor");
    }
  }
  

  
  async function deleteMatchById(req, res) {
    try {
      const { id } = req.params;
      const [result, error] = await MatchService.deleteMatchById(id);
  
      if (error) return respondError(req, res, 404, error);
  
      respondSuccess(req, res, 200, result);
    } catch (error) {
      respondError(req, res, 500, "Error interno del servidor");
    }
  }


  async function disableMatchesByUserId(req, res) {
    try {
      const { params } = req;
      const [result, error] = await MatchService.disableMatchesByUserId(params.id);
  
      if (error) {
        return respondError(req, res, 500, error); // Error interno del servidor
      }
  
      if (result.modifiedCount === 0) {
        return respondError(req, res, 404, "No se encontraron matches para deshabilitar"); // No se encontraron matches
      }
  
      respondSuccess(req, res, 200, `Matches deshabilitados exitosamente. Documentos modificados: ${result.modifiedCount}`);
    } catch (error) {
      respondError(req, res, 500, "Error interno del servidor");
    }
  }

  async function enableMatchesByUserId(req, res) {
    try {
      const { params } = req;
      const [result, error] = await MatchService.enableMatchesByUserId(params.id);
  
      if (error) {
        return respondError(req, res, 500, error); // Error interno del servidor
      }
  
      if (result.modifiedCount === 0) {
        return respondError(req, res, 404, "No se encontraron matches para habilitar"); // No se encontraron matches
      }
  
      respondSuccess(req, res, 200, `Matches habilitados exitosamente. Documentos modificados: ${result.modifiedCount}`);
    } catch (error) {
      respondError(req, res, 500, "Error interno del servidor");
    }
  }

  

export default {
    getMatches,
    getMatch,
    getMatchesByMail,
    deleteMatchById,
    disableMatchesByUserId,
    enableMatchesByUserId
};
