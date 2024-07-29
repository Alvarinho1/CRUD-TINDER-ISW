import mongoose from "mongoose";
import Chat from "./chat.model.js"; // Asegúrate de importar el modelo Chat

// Crea el esquema de la colección 'match'
const matchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    }
  },
  {
    versionKey: false,
  }
);

matchSchema.post('save', async function (doc, next) {
  try {
    const chat = new Chat({
      matchId: doc._id,
      messages: []
    });
    const savedChat = await chat.save();

    await doc.updateOne({ chatId: savedChat._id });

    next();
  } catch (error) {
    next(error);
  }
});

const Match = mongoose.model("Match", matchSchema);

export default Match;
