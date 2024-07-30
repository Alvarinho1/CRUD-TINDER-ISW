import Match from "../models/match.model.js";
import UserService from "../services/user.service.js";
import { handleError } from "../utils/errorHandler.js";

async function getMatches() {
  try {
    // Buscar todos los matches en la base de datos.
    const matches = await Match.find().exec();

    // Verificar si el array de matches está vacío.
    if (matches.length === 0) {
      return [null, "No hay matches disponibles"];
    }

    // Devolver los matches encontrados.
    return [matches, null];
  } catch (error) {
    // Manejar errores y devolver mensaje de error.
    handleError(error, "match.service -> getMatches");
    return [null, "Error al obtener los matches"];
  }
}

async function getMatchById(id) {
  try {
    // Buscar el match por ID en la base de datos, asegurándose de que el campo 'disabled' sea true.
    const match = await Match.findOne({ _id: id, disabled: true }).exec();
  
    // Verificar si se encontró el match.
    if (!match) {
      return [null, "El match no existe o no está deshabilitado"];
    }

    // Devolver el match encontrado.
    return [match, null];
  } catch (error) {
    // Manejar errores y devolver mensaje de error.
    handleError(error, "match.service -> getMatchById");
    return [null, "Error al obtener el match"];
  }
}

async function getMatchesByMail(email) {
  try {
    // Buscar todos los matches donde el ID sea igual a userId o matchUserId.
    var listOfUsers = []
    const [user] = await UserService.getUserByEmail(email);
    const userId = user._id;
    const matches = await Match.find({ $or: [{ userId }, { matchUserId: userId }] }).exec();
    
    // Verificar si se encontraron matches.
    if (matches.length === 0) {
      return [null, "No hay matches para este alumno"];
    }

    for(let item of matches) {
      const userInfo = await UserService.getUserById(item.userId)
      if(userInfo) listOfUsers.push(userInfo)
    }
      console.log(" DATA RECEIVED" + JSON.stringify(listOfUsers))

    // Devolver los matches encontrados.
    return [listOfUsers, null];
  } catch (error) {
    // Manejar errores y devolver mensaje de error.
    handleError(error, "match.service -> getMatchesByMail");
    return [null, "Error al obtener los matches"];
  }
}
async function getMatchesByEmail(email) {
  try {
    // Buscar todos los matches donde el ID sea igual a userId o matchUserId.
    const matches = await Match.find({ $or: [{ userId: id }, { matchUserId: id }] }).exec();

    // Verificar si se encontraron matches.
    if (matches.length === 0) {
      return [null, "No hay matches para este alumno"];
    }

    // Devolver los matches encontrados.
    return [matches, null];
  } catch (error) {
    // Manejar errores y devolver mensaje de error.
    handleError(error, "match.service -> getMatchesByUserId");
    return [null, "Error al obtener los matches"];
  }
}


async function createMatch(userId, matchUserId) {
  try {

    //buscar si ya existe un match entre los dos alumnos
    const matchFound = await Match.findOne({ $or: [{ userId, matchUserId }, { userId: matchUserId, matchUserId: userId }] });
    if (matchFound) return [null, "El match ya existe"];

    const newMatch = new Match({
      userId,
      matchUserId,
      disabled : false,
    });
    await newMatch.save();

    return [newMatch, null];
  } catch (error) {
    handleError(error, "match.service -> createMatch");
    return [null, "Error al crear el match"];
  }
}

async function deleteMatchById(id) {
  try {
    const result = await Match.findByIdAndDelete(id).exec();
    if (!result) return [null, "El match no existe"];
    return [result, null];
  } catch (error) {
    handleError(error, "match.service -> deleteMatchById");
    return [null, "Error al eliminar el match"];
  }
}


async function disableMatchesByUserId(userId) {
  try {
    const result = await Match.updateMany(
      { userId },
      {
        disabled: true,
      },

    );
    return [result, null];
  } catch (error) {
    handleError(error, "match.service -> deleteMatchesByUserId");
    return [null, "Error al eliminar los matches"];
  }
}

async function enableMatchesByUserId(userId) {
  try {
    const result = await Match.updateMany(
      { userId },
      {
        disabled: false,
      },

    );
    return [result, null];
  } catch (error) {
    handleError(error, "match.service -> deleteMatchesByUserId");
    return [null, "Error al eliminar los matches"];
  }
}



export default {
  getMatches,
  getMatchById,
  createMatch,
  deleteMatchById,
  disableMatchesByUserId,
  enableMatchesByUserId,
  getMatchesByMail
};
