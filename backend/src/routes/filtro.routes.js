import { Router } from "express";
import filtroController from "../controllers/filtro.controller.js";

const router = Router();

router.post("/filtro", filtroController.createFiltro);
router.put("/filtro/:id", filtroController.updateFiltro);
router.delete("/filtro/:id", filtroController.deleteFiltro);
router.get("/", filtroController.getFiltros);
router.get("/:id", filtroController.getFiltroById);


export default router;