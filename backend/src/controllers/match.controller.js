import { respondSuccess, respondError } from "../utils/resHandler.js";
import MatchService from "../services/match.service.js";

async function getMatches(req, res) {
  try {
    const [matches, error] = await MatchService.getMatches();
    if (error) return respondError(req, res, 404, error);

    matches.length === 0
      ? respondSuccess(req, res, 204)
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

async function getMatchesByUser(req, res) {
  try {
    const { params } = req;
    const [matches, error] = await MatchService.getMatchesByUserId(params.id);
    if (error) return respondError(req, res, 404, error);

    matches.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, matches);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor");
  }
}

export default {
  getMatches,
  getMatch,
  getMatchesByUser,
};
