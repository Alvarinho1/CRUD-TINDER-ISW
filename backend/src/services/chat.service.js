import Chat from "../models/chat.model.js";
import { handleError } from "../utils/errorHandler.js";

// Obtener todos los chats
export const getAllChats = async () => {
  try {
    const chats = await Chat.find().populate('matchId').exec();
    return [chats, null];
  } catch (error) {
    handleError(error, "getAllChats - Error al obtener los chats");
    return [null, "Error interno del servidor"];
  }
};

// Obtener un chat por ID
export const getChatById = async (id) => {
  try {
    const chat = await Chat.findById(id).populate('matchId').exec();
    if (!chat) {
      return [null, "Chat no encontrado"];
    }
    return [chat, null];
  } catch (error) {
    handleError(error, "getChatById - Error al obtener el chat");
    return [null, "Error interno del servidor"];
  }
};

// Actualizar un chat por matchId y userId
export const updateChat = async (matchId, userId, content) => {
  try {
    const chat = await Chat.findOne({ matchId }).populate('matchId').exec();
    if (!chat) {
      return [null, "Chat no encontrado"];
    }

    const match = chat.matchId;
    if (!match || !match.userId || !match.matchUserId) {
      return [null, "Match no encontrado o incompleto"];
    }

    // Determinar el receptor del mensaje
    const receiverId = match.userId.toString() === userId ? match.matchUserId : match.userId;

    // Añadir nuevo mensaje
    const newMessage = {
      sender: userId,
      receiver: receiverId,
      content: content,
      date: new Date()
    };

    chat.messages.push(newMessage);
    const updatedChat = await chat.save();

    return [updatedChat, null];
  } catch (error) {
    handleError(error, "updateChat - Error al actualizar el chat");
    return [null, "Error interno del servidor"];
  }
};
