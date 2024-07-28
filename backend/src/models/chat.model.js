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
