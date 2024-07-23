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

    disabled: {
      type: mongoose.Schema.Types.Boolean,
      required: false,
    },

  },
  
  {
    versionKey: false,
  },
);

const Match = mongoose.model("Match", matchSchema);

export default Match;
