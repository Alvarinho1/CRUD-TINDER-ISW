//solo los servicios llaman a los modelos.
//los controladores llaman a los servicios.
//los servicios llaman a los modelos.
//los modelos son las estructuras de la base de datos.
//los controladores son las funciones que se ejecutan al recibir una peticion.
//los servicios son las funciones que se ejecutan en el backend.
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import Match from "../models/match.model.js";
import { isValidObjectId } from "mongoose";
import { responseError, respondSuccess } from "../utils/resHandler.js";


async function createChat(matchId, userId, matchUserId) {
  try {
    // Busca el match por su id
    const match = await Match.findById(matchId);
    // Si el match no existe, retorna un mensaje de error
    if (!match) {
      return responseError(404, "Match not found");
    }
    // Verifica si el usuario que envía el mensaje es parte del match
    if (!((match.userId.toString() === userId || match.matchUserId.toString() === userId) &&
        (match.userId.toString() === matchUserId || match.matchUserId.toString() === matchUserId))) {
      return responseError(403, "Forbidden");
    }
    // Busca el chat por el id de match
    const chat = await Chat.findOne({ matchId: matchId });
    // Si el chat no existe, crea un nuevo chat
    if (!chat) {
      const newChat = new Chat({
        matchId: matchId,
        messages: [],
      });
      await newChat.save();
    }
    // Retorna un mensaje de éxito
    return respondSuccess(200, "Chat created");
  } catch (error) {
    return responseError(500, error);
  }
}

async function getMessages (chatId) {
  try {
    // Verifica si el ID es válido
    if (!isValidObjectId(chatId)) {
      return responseError(400, "Invalid chat ID");
    }
    // Busca el chat por su id
    const chat = await Chat.findById(chatId);
    // Si el chat no existe, retorna un mensaje de error
    if (!chat) {
      return responseError(404, "Chat not found");
    }
    // Retorna los mensajes del chat
    return respondSuccess(200, "Messages retrieved", chat.messages);
  } catch (error) {
    return responseError(500, error);
  }
}

async function sendMessage (matchId, senderId, receiverId, content) {
  try {
    // Busca el match por su id
    const match = await Match.findById(matchId);
    // Si el match no existe, retorna un mensaje de error
    if (!match) {
      return responseError(404, "Match not found");
    }
    // Verifica si el usuario que envía el mensaje es parte del match
    if (!((match.userId.toString() === senderId || match.matchUserId.toString() === senderId) &&
        (match.userId.toString() === receiverId || match.matchUserId.toString() === receiverId))) {
      return responseError(403, "Forbidden");
    }
    // Busca el chat por el id de match
    const chat = await Chat.findOne({ matchId: matchId });
    // Si el chat no existe, crea un nuevo chat
    if (!chat) {
      await createChat(matchId, senderId, receiverId);
    }
    await Chat.updateOne(
      { matchId: matchId },
      { $push: { messages: { sender: senderId, receiver: receiverId, content: content, date: new Date() } } }
    );
  } catch (error) {
    return responseError(500, error);
  }
}


export { 
  createChat, 
  getMessages, 
  sendMessage 
};