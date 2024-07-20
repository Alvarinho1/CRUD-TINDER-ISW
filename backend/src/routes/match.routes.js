"use strict";

import { Router } from "express";
import matchController from "../controllers/match.controller.js";
import { isAdmin, isUser } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, matchController.getMatches);
router.get("/:id", isUser, matchController.getMatch);
router.get("/alumno/:id", isUser, matchController.getMatchesByAlumno);

export default router;
