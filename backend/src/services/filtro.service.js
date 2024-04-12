"use strict";

import Filtro from "../models/filtro.model.js";
import { handleError } from "../utils/errorHandler.js";

async function getFiltros() {
  try {
    const filtros = await Filtro.find().exec();
    if (!filtros) return [null, "No hay filtros"];

    return [filtros, null];
  } catch (error) {
    handleError(error, "filtro.service -> getFiltros");
  }
}

async function createFiltro(filtro) {
  try {
    const { carrera, curso, intereses, genero } = filtro;

    const filtroFound = await Filtro.findOne({ carrera, curso, intereses, genero });
    if (filtroFound) return [null, "El filtro ya existe"];

    const newFiltro = new Filtro({
      carrera,
      curso,
      intereses,
      genero,
    });
    await newFiltro.save();

    return [newFiltro, null];
  } catch (error) {
    handleError(error, "filtro.service -> createFiltro");
  }
}

async function getFiltroById(id) {
  try {
    const filtro = await Filtro.findById(id).exec();
    if (!filtro) return [null, "El filtro no existe"];

    return [filtro, null];
  } catch (error) {
    handleError(error, "filtro.service -> getFiltroById");
  }
}

async function updateFiltro(id, filtro) {
  try {
    const filtroFound = await Filtro.findById(id);
    if (!filtroFound) return [null, "El filtro no existe"];

    const { carrera, curso, intereses, genero } = filtro;

    const filtroUpdated = await Filtro.findByIdAndUpdate(
      id,
      {
        carrera,
        curso,
        intereses,
        genero,
      },
      { new: true },
    );

    return [filtroUpdated, null];
  } catch (error) {
    handleError(error, "filtro.service -> updateFiltro");
  }
}

async function deleteFiltro(id) {
  try {
    return await Filtro.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "filtro.service -> deleteFiltro");
  }
}

export default {
  getFiltros,
  createFiltro,
  getFiltroById,
  updateFiltro,
  deleteFiltro,
};