"use strict";
import { Router } from "express";
import BusquedaController from "../controllers/busqueda.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isAdmin, isAlumno } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/buscarDisponibles", isAdmin, isAlumno, BusquedaController.BuscarDisponibles);
router.post("/buscarPorCategoria",isAdmin, isAlumno, BusquedaController.BuscarPorCategoria);

router.get("/likes", isAdmin, BusquedaController.BuscarLikesUser);
router.get("/dislikes", isAdmin, BusquedaController.BuscarDislikesUser);
router.get("/alumno/likes/:rut", isAdmin, BusquedaController.BuscarLikesUserByRut);
router.get("/alumno/dislikes/:rut", isAdmin, BusquedaController.BuscarDislikesUserByRut);
router.get("/alumno/ranking", isAdmin, BusquedaController.RankingUsers);

export default router;
