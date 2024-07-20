"use strict";
import { Router } from "express";
import BusquedaController from "../controllers/busqueda.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isAdmin, isUser } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/buscarDisponibles", isAdmin, BusquedaController.BuscarDisponibles);
router.post("/buscarPorCategoria", isAdmin, isUser, BusquedaController.BuscarPorCategoria);

router.get("/likes", isAdmin, isUser, BusquedaController.BuscarLikesAlumno);
router.get("/dislikes", isAdmin, isUser, BusquedaController.BuscarDislikesAlumno);
router.get("/alumnos/likes/:rut", isAdmin, BusquedaController.BuscarLikesAlumnorut);
router.get("/alumnos/dislikes/:rut", isAdmin, BusquedaController.BuscarDislikesAlumnorut);
router.get("/alumnos/ranking", isAdmin,isUser, BusquedaController.RankingAlumnos);


export default router;
