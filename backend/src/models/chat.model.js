//genra un modelo para almacenar los chats. los chats se relacionan a un match y los mensajes se almacenan en el modelo chat indicando quien envia y quien recibe el mensaje
// los mensajes del chat deben indicar el emisor y receptor del mensaje, el contenido del mensaje y la fecha de envio.
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
import mongoose from "mongoose";

// Crea el esquema de la colección 'chat'
const chatSchema = new mongoose.Schema({
        matchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match",
            required: true,
        },
        
        messages: [{
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            receiver: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            content: {
                type: String,
                required: true,
                maxlength: 200,
                
            },
            date: {
                type: Date,
                required: true,
            },
            enabled: {
                type: Boolean,
                default: true,
            }
            
        }],
    } 
);

// Crea el modelo de datos 'Chat' a partir del esquema 'chatSchema'
const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
