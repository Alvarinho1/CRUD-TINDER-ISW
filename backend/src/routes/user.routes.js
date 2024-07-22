"use strict";

import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { isAdmin, isAlumno } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import upload from "../config/multerConfig.js"; // Si necesitas este middleware para subir fotos de perfil

const router = Router();

router.use(authenticationMiddleware);

// Rutas básicas de usuario
router.get("/", isAdmin, isAlumno, userController.getUsers);
router.post("/", isAdmin, upload.single('fotoPerfil'), userController.createUser);
router.get("/:rut", isAdmin, userController.getUserByRut);
router.put("/:rut", isAdmin, isAlumno, userController.updateUser);
router.delete("/:rut", isAdmin, userController.deleteUser);

// Funciones adicionales
router.post("/like", isAlumno, userController.likeUser);
router.post("/dislike", isAlumno, userController.dislikeUser);
router.delete("/alumno/removelike", isAlumno, userController.removeLikeUser);
router.delete("/alumno/removedislike", isAlumno, userController.removeDislikeUser);

router.post("/alumno/destacarperfil", isAlumno, userController.destacarPerfilUser);
router.delete("/alumno/quitardestacado", isAlumno, userController.quitarDestacadoPerfilUser);

export default router;
