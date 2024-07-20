"use strict";

import { Router } from "express";
import alumnoController from "../controllers/alumno.controller.js";
import { isAdmin, isUser } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import upload from "../config/multerConfig.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, alumnoController.getAlumnos);
router.post("/", isAdmin, upload.single('fotoPerfil'), alumnoController.createAlumno);
router.get("/:rut", isUser, alumnoController.getAlumnoByRut);
router.put("/:rut", isUser, alumnoController.updateAlumno);
router.delete("/:rut", isAdmin, alumnoController.deleteAlumno);

router.post("/like", isUser, alumnoController.likeAlumno);
router.post("/dislike", isUser, alumnoController.dislikeAlumno);
router.delete("/alumno/like", isUser, alumnoController.removeLikeAlumno);
router.delete("/alumno/dislike", isUser, alumnoController.removeDislikeAlumno);

router.post("/alumno/destacarperfil", isUser, alumnoController.destacarPerfilAlumno);
router.delete("/alumno/quitardestacado", isUser, alumnoController.quitarDestacadoPerfilAlumno);

export default router;
