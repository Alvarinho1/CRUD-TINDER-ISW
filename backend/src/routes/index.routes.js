"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";

import filtroRoutes from "./filtro.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
//Define rutas para filtros
router.use("/filtros", authenticationMiddleware, filtroRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);

// Exporta el enrutador
export default router;
