import mongoose from "mongoose";

// Crea el esquema de la colección 'match'
const matchSchema = new mongoose.Schema(
  {
    alumnoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumno",
      required: true,
    },
    matchAlumnoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumno",
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const Match = mongoose.model("Match", matchSchema);

export default Match;
