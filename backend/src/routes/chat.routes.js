"use strict";
import { Router } from "express";
import ChatController from "../controllers/chat.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isAdmin, isUser } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, ChatController.getAllChats); // Obtener todos los chats
router.get("/:id", isUser, ChatController.getChatById); // Obtener un chat por ID
router.put("/:id", isUser, ChatController.updateChat); // Actualizar un chat

export default router;
