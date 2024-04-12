"use strict";

import { Router } from "express";
import alumnoController from "../controllers/alumno.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, alumnoController.getAlumnos);
router.post("/", isAdmin, alumnoController.createAlumno);
router.get("/:rut", alumnoController.getAlumnoByRut);
router.put("/:rut", isAdmin, alumnoController.updateAlumno);
router.delete("/:rut", isAdmin, alumnoController.deleteAlumno);

export default router;