"use strict";
import { Router } from "express";
import BusquedaController from "../controllers/busqueda.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isAdmin, isAlumnoOrAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/buscarDisponibles", isAdmin, isAlumnoOrAdmin, BusquedaController.BuscarDisponibles);
router.post("/buscarPorCategoria", isAdmin, isAlumnoOrAdmin, BusquedaController.BuscarPorCategoria);
router.get("/buscarSuperlikes", isAdmin, isAlumnoOrAdmin, BusquedaController.BuscarSuperLikes);

router.get("/likes", isAdmin, isAlumnoOrAdmin, BusquedaController.BuscarLikesAlumno);
router.get("/dislikes", isAdmin, isAlumnoOrAdmin, BusquedaController.BuscarDislikesAlumno);
router.get("/alumnos/likes/:rut", isAdmin, BusquedaController.BuscarLikesAlumnorut);
router.get("/alumnos/dislikes/:rut", isAdmin, BusquedaController.BuscarDislikesAlumnorut);
router.get("/alumnos/rankingLikes", isAdmin, BusquedaController.RankingAlumnosLikes);
router.get("/alumnos/rankingDislikes", isAdmin, BusquedaController.RankingAlumnosDislikes)


export default router;
