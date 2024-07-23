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

async function getMatchesByUserId(req, res) {
    try {
      const { id } = req.params;
      const [matches, error] = await MatchService.getMatchesByUserId(id);
  
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

export default {
    getMatches,
    getMatch,
    getMatchesByUserId,
    deleteMatchById
};
