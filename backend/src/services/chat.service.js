
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import Match from "../models/match.model.js";
import { isValidObjectId } from "mongoose";
import { responseError, respondSuccess } from "../utils/resHandler.js";


// Crea un chat con el id del match y los usuarios que participan en el chat
export const createChat = async (matchId, userId, matchUserId) => {
  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return responseError(404, "Match not found");
    }
    const existingChat = await Chat.findOne({ matchId: matchId });
    if (!existingChat) {
      const newChat = new Chat({
        matchId: matchId,
        messages: [],
      });
      await newChat.save();
      return respondSuccess(200, "Chat created");
    } else {
      return respondSuccess(200, "Chat already exists");
    }
  } catch (error) {
    return responseError(500, error);
  }
};

// Enviar mensaje a un chat mediante el id de match
export const sendMessage = async (matchId, senderId, receiverId, content) => {
  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return responseError(404, "Match not found");
    }

    // Verifica si los usuarios son parte del match
    if (!((match.userId.toString() === senderId || match.matchUserId.toString() === senderId) &&
        (match.userId.toString() === receiverId || match.matchUserId.toString() === receiverId))) {
      return responseError(403, "Forbidden");
    }

    let chat = await Chat.findOne({ matchId: matchId });
    if (!chat) {
      await createChat(matchId, senderId, receiverId);

      // Busca el chat de nuevo después de crearlo
      chat = await Chat.findOne({ matchId: matchId }); 
    }
    // Agrega el mensaje al chat
    chat.messages.push({
      sender: senderId,
      receiver: receiverId,
      content,
      date: new Date(),
      enabled: true,
    });
    await chat.save();

    return respondSuccess(200, "Message sent");
  } catch (error) {
    return responseError(500, error);
  }
};

// Obtener todos los mensajes de un chat mediante el id de chat
export const getMessages = async (chatId) => {
  try {
    if (!isValidObjectId(chatId)) {
      return responseError(400, "Invalid chat ID");
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return responseError(404, "Chat not found");
    }

    return respondSuccess(200, "Messages retrieved", chat.messages);
  } catch (error) {
    return responseError(500, error);
  }
};



//||||||||||||PARA MAS TARDE||||||||||||\\
//||||||||||||PARA MAS TARDE||||||||||||\\
//||||||||||||PARA MAS TARDE||||||||||||\\
//||||||||||||PARA MAS TARDE||||||||||||\\
//||||||||||||PARA MAS TARDE||||||||||||\\
//||||||||||||PARA MAS TARDE||||||||||||\\
//elimina Message
export const deleteMessage = async (chatId, messageId) => {
  try {
    // Verifica si el ID es válido
    if (!isValidObjectId(chatId) || !isValidObjectId(messageId)) {
      return responseError(400, "Invalid chat or message ID");
    }

    // Busca el chat por su id
    const chat = await Chat.findById(chatId);
    // Si el chat no existe, retorna un mensaje de error
    if (!chat) {
      return responseError(404, "Chat not found");
    }

    // Elimina el mensaje del chat
    await Chat.updateOne(
      { _id: chatId },
      { $pull: { messages: { _id: messageId } } }
    );

    // Retorna un mensaje de éxito
    return respondSuccess(200, "Message deleted");
  } catch (error) {
    return responseError(500, error);
  }
};


//update enable to false

//update enable to true


//-----------------------------------------------------


//modifica message.enable a false
export const disableMessage = async (chatId, messageId) => {
  try {
    // Verifica si el ID es válido
    if (!isValidObjectId(chatId) || !isValidObjectId(messageId)) {
      return responseError(400, "Invalid chat or message ID");
    }

    // Busca el chat por su id
    const chat = await Chat.findById(chatId);
    // Si el chat no existe, retorna un mensaje de error
    if (!chat) {
      return responseError(404, "Chat not found");
    }

    // Modifica el mensaje del chat
    await Chat.updateOne(
      { _id: chatId, "messages._id": messageId },
      { $set: { "messages.$.enabled": false } }
    );

    // Retorna un mensaje de éxito
    return respondSuccess(200, "Message disabled");
  } catch (error) {
    return responseError(500, error);
  }

  // debo borrar el mensaje o debo deshabilitarlo????????
};


export default { 
  createChat, 
  sendMessage,
  getMessages,
  //||||||||||||PARA MAS TARDE||||||||||||\\
  //||||||||||||PARA MAS TARDE||||||||||||\\
  //||||||||||||PARA MAS TARDE||||||||||||\\
  // deleteMessage,
  // enableMessage,
  // disableMessage,
  //enablechat,
  //disablechat,
};
