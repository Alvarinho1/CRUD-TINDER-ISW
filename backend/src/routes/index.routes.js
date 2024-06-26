"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";

//Importa el modelo alumno
import alumnoRoutes from "./alumno.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import rutaBusqueda from "./busqueda.routes.js";


/** Instancia del enrutador */
const router = Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
router.use("/alumnos", authenticationMiddleware, alumnoRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);

router.use("/busqueda", authenticationMiddleware, rutaBusqueda);

// Exporta el enrutador
export default router;
