import * as ChatService from "../services/chat.service.js";

// Obtener todos los chats
const getAllChats = async (req, res) => {
  const [chats, error] = await ChatService.getAllChats();
  if (error) {
    return res.status(500).json({ message: error });
  }
  res.status(200).json(chats);
};

// Obtener un chat por ID
const getChatById = async (req, res) => {
  const { id } = req.params;
  const [chat, error] = await ChatService.getChatById(id);
  if (error) {
    const statusCode = error === "Chat no encontrado" ? 404 : 500;
    return res.status(statusCode).json({ message: error });
  }
  res.status(200).json(chat);
};

const updateChat = async (req, res) => {
  const { id } = req.params;
  const { userId, content } = req.body;
  const [updatedChat, error] = await ChatService.updateChat(id, userId, content);
  if (error) {
    const statusCode = error === "Chat no encontrado" ? 404 : 500;
    return res.status(statusCode).json({ message: error });
  }
  res.status(200).json(updatedChat);
};

export default {
  getAllChats,
  getChatById,
  updateChat
};
