// Propósito: Contiene los servicios para manejar los chats de la aplicación.
// Notas: Se importan los modelos 'Chat', 'User' y 'Match' desde sus respectivos archivos.
// Se importan las funciones 'isValidObjectId', 'responseError' y 'respondSuccess' desde el archivo 'resHandler.js'.
// Se exportan las funciones 'getMessages' y 'sendMessage'.
// Se define la función 'getMessages' que recibe el id de un chat y retorna los mensajes del chat.
// Se define la función 'sendMessage' que recibe el id de un match, el id del emisor, el id del receptor y el contenido del mensaje, y envía un mensaje al chat.

import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import Match from "../models/match.model.js";
import { isValidObjectId } from "mongoose";
import { responseError, respondSuccess } from "../utils/resHandler.js";


//crea createchat el chat con el id del match y los usuarios que participan en el chat
export const createChat = async (matchId, userId, matchUserId) => {
  try {
    // Busca el match por su id
    const match = await Match.findById(matchId);
    // Si el match no existe, retorna un mensaje de error
    if (!match) {
      return responseError(404, "Match not found");
    }
    // Verifica si el usuario que envía el mensaje es parte del match
    if ((match.userId.toString() === userId || match.matchUserId.toString() === userId) &&
        (match.userId.toString() === matchUserId || match.matchUserId.toString() === matchUserId)) {
      return responseError(403, "Forbidden");
    }
    // Busca el chat por el id de match
    const chat = await Chat.findOne({ matchUserId: matchId });
    // Si el chat no existe, crea un nuevo chat
    if (!chat) {
      const newChat = new Chat({
        matchUserId: matchId,
        userId: [userId, matchUserId],
        messages: [],
      });
      await newChat.save();
    }
    // Retorna un mensaje de éxito
    return respondSuccess(200, "Chat created");
  } catch (error) {
    return responseError(500, error);
  }
};


// enviar mensaje a un chat mediante el id de match
export const sendMessage = async (matchId, senderId, receiverId, content) => {
  try {
    // Busca el match por su id
    const match = await Match.findById(matchId);
    // Si el match no existe, retorna un mensaje de error
    if (!match) {
      return responseError(404, "Match not found");
    }
    // Verifica si el usuario que envía el mensaje es parte del match
    if ((match.userId.toString() === senderId || match.matchUserId.toString() === senderId) &&
        (match.userId.toString() === receiverId || match.matchUserId.toString() === receiverId)) {
      return responseError(403, "Forbidden");
    }
    // Busca el chat por el id de match
    const chat = await Chat.findOne({ matchUserId: matchId });

    // Si el chat no existe, crea un nuevo chat.||||
    if (!chat) {
      //llama funcion createChat
      await createChat(matchId, senderId, receiverId);
    }
    // Agrega el mensaje al chat
    await Chat.updateOne(
      { matchUserId: matchId },
      {
        $push: {
          messages: {
            sender: senderId,
            receiver: receiverId,
            content,
            date: new Date(),
            enabled: true,
          },
        },
      }
    );
    // Retorna un mensaje de éxito
    return respondSuccess(200, "Message sent");
  } catch (error) {
    return responseError(500, error);
  }
};

////////// Obtener todos los mensajes de un chat mediante el id de chat
export const getMessages = async (chatId) => {
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
