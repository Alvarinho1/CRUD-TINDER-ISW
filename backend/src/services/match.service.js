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
    handleError(error, "match.service -> getMatchById");
    return [null, "Error al obtener el match"];
  }
}

async function getMatchesByAlumnoId(id) {
  try {
    //buscar todos los Matches donde el id sea igual a alumnoId o matchAlumnoId
    const matches = await Match.find({ $or: [{ alumnoId: id }, { matchAlumnoId: id }] }).exec();
    if (!matches) return [null, "No hay matches para este alumno"];
    return [matches, null];
  } catch (error) {
    handleError(error, "match.service -> getMatchesByAlumnoId");
    return [null, "Error al obtener matches para este alumno"];
  }
}

async function createMatch(alumnoId, matchAlumnoId) {
  try {

    //buscar si ya existe un match entre los dos alumnos
    const matchFound = await Match.findOne({ $or: [{ alumnoId, matchAlumnoId }, { alumnoId: matchAlumnoId, matchAlumnoId: alumnoId }] });
    if (matchFound) return [null, "El match ya existe"];

    const newMatch = new Match({
      alumnoId,
      matchAlumnoId,
    });
    await newMatch.save();

    return [newMatch, null];
  } catch (error) {
    handleError(error, "match.service -> createMatch");
    return [null, "Error al crear el match"];
  }
}

export default {
  getMatches,
  getMatchById,
  getMatchesByAlumnoId,
  createMatch,
};
