"use strict";

import { Router } from "express";
import AlumnoController from "../controllers/alumno.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
const router = Router();

router.use(authenticationMiddleware);

router.get("/alumnos", AlumnoController.getAlumnos);
router.post("/alumnos", AlumnoController.createAlumno);
router.get("/alumnos/:rut", AlumnoController.getAlumnoByRut);
router.put("/alumnos/:rut", AlumnoController.updateAlumno);
router.delete("/alumnos/:rut", AlumnoController.deleteAlumno);


router.post("/alumnos/like", AlumnoController.likeAlumno);
router.post("/alumnos/dislike", AlumnoController.dislikeAlumno);
router.delete("/alumno/like", AlumnoController.removeLikeAlumno);
router.delete("/alumno/dislike", AlumnoController.removeDislikeAlumno);

export default router;
