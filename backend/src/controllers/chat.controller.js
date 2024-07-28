import { responseError, respondSuccess } from "../utils/resHandler.js";
import { createChat, getMessages, sendMessage } from "../services/chatService.js";

// Controlador para crear un chat
export const createChat = async (req, res) => {
  const { matchId, userId, matchUserId } = req.body;
  try {
    const response = await createChat(matchId, userId, matchUserId);
    if (response.status === 200) {
      return respondSuccess(res, response.status, response.message);
    } else {
      return responseError(res, response.status, response.message);
    }
  } catch (error) {
    return responseError(res, 500, "Internal server error", error);
  }
};

// Controlador para enviar un mensaje
export const sendMessage = async (req, res) => {
  const { matchId, senderId, receiverId, content } = req.body;
  try {
    const response = await sendMessage(matchId, senderId, receiverId, content);
    if (response.status === 200) {
      return respondSuccess(res, response.status, response.message);
    } else {
      return responseError(res, response.status, response.message);
    }
  } catch (error) {
    return responseError(res, 500, "Internal server error", error);
  }
};

// Controlador para obtener mensajes
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const response = await getMessages(chatId);
    if (response.status === 200) {
      return respondSuccess(res, response.status, response.message, response.data);
    } else {
      return responseError(res, response.status, response.message);
    }
  } catch (error) {
    return responseError(res, 500, "Internal server error", error);
  }
};

export default { 

  createChat, 
  sendMessage, 
  getMessages 
  
};