"use strict";

import { Router } from "express";
import matchController from "../controllers/match.controller.js";
import { isAdmin, isAlumno } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, matchController.getMatches);
router.get("/:id", isAlumno, matchController.getMatch);
router.get("/alumno/:id", isAlumno, matchController.getMatchesByUser);

export default router;
