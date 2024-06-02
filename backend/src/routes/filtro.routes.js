import { Router } from "express";
import filtroController from "../controllers/filtro.controller.js";

const router = Router();

router.post("/crearfiltro", filtroController.createFiltro);
router.put("/actualizarfiltro/:id", filtroController.updateFiltro);
router.delete("/eliminarfiltro/:id", filtroController.deleteFiltro);
router.get("/obtenerfiltros", filtroController.getFiltros);
router.get("/obtenerfiltros/:id", filtroController.getFiltroById);


export default router;