"use strict";
import { Router } from "express";
import BusquedaController from "../controllers/busqueda.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/buscarDisponibles", BusquedaController.BuscarDisponibles);
router.post("/buscarPorCategoria", BusquedaController.BuscarPorCategoria);

router.get("/likes", BusquedaController.BuscarLikesAlumno);
router.get("/dislikes", BusquedaController.BuscarDislikesAlumno);
router.get("/alumnos/likes/:rut", BusquedaController.BuscarLikesAlumnorut);
router.get("/alumnos/dislikes/:rut", BusquedaController.BuscarDislikesAlumnorut);
router.get("/alumnos/contadorLikes", BusquedaController.BuscarAlumnoConMasLikes);
router.get("/alumnos/contadorDislikes", BusquedaController.BuscarAlumnoConMasDislikes)

export default router;
