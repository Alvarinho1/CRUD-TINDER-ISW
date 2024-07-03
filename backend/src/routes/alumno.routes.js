"use strict";

import { Router } from "express";
import alumnoController from "../controllers/alumno.controller.js";
import { isAdmin, isAlumnoOrAdmin } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, alumnoController.getAlumnos);
router.post("/", isAdmin, alumnoController.createAlumno);
router.get("/:rut", isAlumnoOrAdmin, alumnoController.getAlumnoByRut);
router.put("/:rut", isAlumnoOrAdmin, alumnoController.updateAlumno);
router.delete("/:rut", isAdmin, alumnoController.deleteAlumno);

router.post("/like", alumnoController.likeAlumno);
router.post("/dislike", alumnoController.dislikeAlumno);
router.delete("/alumno/like", alumnoController.removeLikeAlumno);
router.delete("/alumno/dislike", alumnoController.removeDislikeAlumno);

export default router;
