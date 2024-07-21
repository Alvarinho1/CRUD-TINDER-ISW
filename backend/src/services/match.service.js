import Match from "../models/match.model.js";
import { handleError } from "../utils/errorHandler.js";

async function getMatches() {
  try {
    const matches = await Match.find().exec();
    if (!matches || matches.length === 0) return [null, "No hay matches"];
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
    // Validar que el id sea válido
    if (!id) {
      const errorMessage = "El ID del usuario es requerido";
      handleError(new Error(errorMessage), "matches.service -> getMatchesByUserId - Falta ID");
      return [null, errorMessage];
    }

    const matches = await Match.find({ $or: [{ userId: id }, { matchUserId: id }] }).exec();
    if (!matches || matches.length === 0) return [null, "No hay matches para este usuario"];
    return [matches, null];
  } catch (error) {
    handleError(error, "matches.service -> getMatchesByUserId");
    return [null, "Error al obtener matches para este usuario"];
  }
}

async function createMatch(userId, matchUserId) {
  try {
    if (!userId || !matchUserId) {
      const errorMessage = "userId y matchUserId son requeridos";
      handleError(new Error(errorMessage), "matches.service -> createMatch - Falta información");
      return [null, errorMessage];
    }

    // Buscar si ya existe un match entre los dos usuarios
    const matchFound = await Match.findOne({
      $or: [
        { userId, matchUserId },
        { userId: matchUserId, matchUserId: userId }
      ]
    }).exec();

    if (matchFound) {
      const errorMessage = "El match ya existe";
      handleError(new Error(errorMessage), "matches.service -> createMatch - Match ya existe");
      return [null, errorMessage];
    }

    const newMatch = new Match({
      userId,
      matchUserId
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
