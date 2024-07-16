"use strict";

import { Router } from "express";
import matchController from "../controllers/match.controller.js";
import { isAdmin, isAlumnoOrAdmin } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, matchController.getMatches);
router.get("/:id", isAlumnoOrAdmin, matchController.getMatch);
router.get("/alumno/:id", isAlumnoOrAdmin, matchController.getMatchesByAlumno);

export default router;
