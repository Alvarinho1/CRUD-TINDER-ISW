"use strict";

import { Router } from "express";
import alumnoController from "../controllers/alumno.controller.js";
import { isAdmin, isAlumnoOrAdmin } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import upload from "../config/multerConfig.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, alumnoController.getAlumnos);
router.post("/", isAdmin, upload.single('fotoPerfil'), alumnoController.createAlumno);
router.get("/:rut", isAlumnoOrAdmin, alumnoController.getAlumnoByRut);
router.put("/:rut", isAlumnoOrAdmin, alumnoController.updateAlumno);
router.delete("/:rut", isAdmin, alumnoController.deleteAlumno);

router.post("/like", isAlumnoOrAdmin, alumnoController.likeAlumno);
router.post("/dislike", isAlumnoOrAdmin, alumnoController.dislikeAlumno);
router.delete("/alumno/like", isAlumnoOrAdmin, alumnoController.removeLikeAlumno);
router.delete("/alumno/dislike", isAlumnoOrAdmin, alumnoController.removeDislikeAlumno);
router.post("/alumno/superlike", isAlumnoOrAdmin, alumnoController.superLikeAlumno);
router.delete("/alumno/quitarsuperlike", isAlumnoOrAdmin, alumnoController.quitarSuperLikeAlumno);

router.post("/alumno/destacarperfil", isAlumnoOrAdmin, alumnoController.destacarPerfilAlumno);
router.delete("/alumno/quitardestacado", isAlumnoOrAdmin, alumnoController.quitarDestacadoPerfilAlumno);

export default router;
