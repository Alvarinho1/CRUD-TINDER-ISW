
import chatController from "../controllers/chat.controller.js";
import { Router } from "express";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isUser } from "../middlewares/authorization.middleware.js";

const chatRouter = Router();    

chatRouter.use(authenticationMiddleware);
router.use("/chat", chatRouter);

chatRouter.post("/create", isUser, chatController.createChat);
chatRouter.get("/messages/:id", isUser, chatController.getMessages);
chatRouter.post("/send", isUser, chatController.sendMessage);
 
export default chatRouter;
