"use strict";
import { Router } from "express";
import BusquedaController from "../controllers/busqueda.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isAdmin, isUser } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/buscarDisponibles",  BusquedaController.BuscarDisponibles);
router.post("/buscarPorCategoria", BusquedaController.BuscarPorCategoria);

router.get("/likes", isAdmin, BusquedaController.BuscarLikesUser);
router.get("/dislikes", isAdmin, BusquedaController.BuscarDislikesUser);
router.get("/alumno/likes/:rut", isUser, BusquedaController.BuscarLikesUserByRut);
router.get("/alumno/dislikes/:rut", isUser, BusquedaController.BuscarDislikesUserByRut);
router.get("/alumno/ranking", isAdmin, BusquedaController.RankingUsers);
router.get("/alumno/likesdados/:rut", isUser, BusquedaController.BuscarLikesDados);

export default router;
