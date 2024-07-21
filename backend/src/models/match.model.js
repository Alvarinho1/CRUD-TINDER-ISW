import mongoose from "mongoose";

// Crea el esquema de la colección 'match'
const matchSchema = new mongoose.Schema(
  {
    userId: {  // Cambiado a minúsculas
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const Match = mongoose.model("Match", matchSchema);

export default Match;
