import Match from "../models/match.model.js";
import { handleError } from "../utils/errorHandler.js";

async function getMatches() {
  try {
    const matches = await Match.find().exec();
    if (!matches) return [null, "No hay matches"];
    return [matches, null];
  } catch (error) {
    handleError(error, "matches.service -> getMatches");
    return [null, "Error al obtener los matches"];
  }
}

async function getMatchById(id) {
  try {
    const match = await Match.findById(id).exec();
    if (!match) return [null, "El match no existe"];
    return [match, null];
  } catch (error) {
    handleError(error, "matches.service -> getMatchById");
    return [null, "Error al obtener el match"];
  }
}

async function getMatchesByUserId(id) {
  try {
    // Buscar todos los Matches donde el id sea igual a userId o matchUserId
    const matches = await Match.find({ $or: [{ userId: id }, { matchUserId: id }] }).exec();
    if (!matches) return [null, "No hay matches para este usuario"];
    return [matches, null];
  } catch (error) {
    handleError(error, "matches.service -> getMatchesByUserId");
    return [null, "Error al obtener matches para este usuario"];
  }
}

async function createMatch(userId, matchUserId) {
  try {
    // Buscar si ya existe un match entre los dos usuarios
    const matchFound = await Match.findOne({ $or: [{ userId, matchUserId }, { userId: matchUserId, matchUserId: userId }] });
    if (matchFound) return [null, "El match ya existe"];

    const newMatch = new Match({
      userId,
      matchUserId,
    });
    await newMatch.save();

    return [newMatch, null];
  } catch (error) {
    handleError(error, "matches.service -> createMatch");
    return [null, "Error al crear el match"];
  }
}

export default {
  getMatches,
  getMatchById,
  getMatchesByUserId,
  createMatch,
};
