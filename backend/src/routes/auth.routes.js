"use strict";
import upload from '../config/multerConfig.js';
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";


/** Controlador de autenticación */
import authController from "../controllers/auth.controller.js";

/** Instancia del enrutador */
const router = Router();

// Define las rutas para la autenticación
router.post("/login", authController.login);
router.post('/register', upload.single('fotoPerfil'), authController.register);
router.post("/logout", authController.logout);
router.get("/refresh", authController.refresh);
router.get("/getProfile", authController.refresh);

// Exporta el enrutador
export default router;
