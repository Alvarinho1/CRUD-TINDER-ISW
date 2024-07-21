"use strict";
import { Router } from "express";
import BusquedaController from "../controllers/busqueda.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isAdmin, isAlumno } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/buscarDisponibles", isAdmin, BusquedaController.BuscarDisponibles);
router.post("/buscarPorCategoria", isAdmin, isAlumno, BusquedaController.BuscarPorCategoria);

router.get("/likes", isAdmin, isAlumno, BusquedaController.BuscarLikesUser);
router.get("/dislikes", isAdmin, isAlumno, BusquedaController.BuscarDislikesUser);
router.get("/alumno/likes/:rut", isAdmin, BusquedaController.BuscarLikesUserByRut);
router.get("/alumno/dislikes/:rut", isAdmin, BusquedaController.BuscarDislikesUserByRut);
router.get("/alumno/ranking", isAdmin, isAlumno, BusquedaController.RankingUsers);

export default router;
