"use strict";

import { Router } from "express";
import alumnoController from "../controllers/alumno.controller.js";
import { isAdmin, isAlumno } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import upload from "../config/multerConfig.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, alumnoController.getAlumnos);
router.post("/", isAdmin, upload.single('fotoPerfil'), alumnoController.createAlumno);
router.get("/:rut", isAlumno, alumnoController.getAlumnoByRut);
router.put("/:rut", isAlumno, alumnoController.updateAlumno);
router.delete("/:rut", isAdmin, alumnoController.deleteAlumno);

router.post("/like", isAlumno, alumnoController.likeAlumno);
router.post("/dislike", isAlumno, alumnoController.dislikeAlumno);
router.delete("/alumno/like", isAlumno, alumnoController.removeLikeAlumno);
router.delete("/alumno/dislike", isAlumno, alumnoController.removeDislikeAlumno);

router.post("/alumno/destacarperfil", isAlumno, alumnoController.destacarPerfilAlumno);
router.delete("/alumno/quitardestacado", isAlumno, alumnoController.quitarDestacadoPerfilAlumno);

export default router;
