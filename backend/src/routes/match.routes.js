"use strict";

import { Router } from "express";
import matchController from "../controllers/match.controller.js";
import { isAdmin, isAlumno } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, matchController.getMatches);
router.get("/:id",  matchController.getMatch);
router.get("/alumno/:id", matchController.getMatchesByUserId);
router.delete("/alumnodelete/:id", matchController.deleteMatchById);
router.put("/alumnodesabilitar/:id", matchController.disableMatchesByUserId);
router.put("/alumnohabilitado/:id", matchController.enableMatchesByUserId);


export default router;
