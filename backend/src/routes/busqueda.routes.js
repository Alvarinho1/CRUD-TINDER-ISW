"use strict";
// Importa el módulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de usuarios */
import BusquedaController from "../controllers/busqueda.controller.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Rutas de búsqueda
router.get("/buscarDisponibles", BusquedaController.BuscarDisponibles);
router.post("/buscarPorCategoria", BusquedaController.BuscarPorCategoria);

export default router;
