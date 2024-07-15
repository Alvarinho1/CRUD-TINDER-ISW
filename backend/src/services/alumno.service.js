import Alumno from "../models/alumno.model.js";
import { handleError } from "../utils/errorHandler.js";

async function getAlumnos() {
  try {
    const alumnos = await Alumno.find().exec();
    if (!alumnos) return [null, "No hay alumnos"];
    return [alumnos, null];
  } catch (error) {
    handleError(error, "alumno.service -> getAlumnos");
    return [null, "Error al obtener los alumnos"];
  }
}

async function createAlumno(alumno) {
  try {
    const { nombre, apellidos, genero, rut, correo, carrera, cursos, areasDeInteres } = alumno;

    const alumnoFound = await Alumno.findOne({ rut });
    if (alumnoFound) return [null, "El alumno ya existe"];

    const newAlumno = new Alumno({
      nombre,
      apellidos,
      genero,
      rut,
      correo,
      carrera,
      cursos,
      areasDeInteres,
    });
    await newAlumno.save();

    return [newAlumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> createAlumno");
    return [null, "Error al crear el alumno"];
  }
}

async function getAlumnoByRut(rut) {
  try {
    const alumno = await Alumno.findOne({ rut }).exec();
    if (!alumno) return [null, "El alumno no existe"];
    return [alumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> getAlumnoByRut");
    return [null, "Error al obtener el alumno"];
  }
}

async function updateAlumno(rut, alumno) {
  try {
    const alumnoFound = await Alumno.findOne({ rut });
    if (!alumnoFound) return [null, "El alumno no existe"];

    const { nombre, apellidos, genero, correo, carrera, cursos, areasDeInteres } = alumno;

    const alumnoUpdated = await Alumno.findOneAndUpdate(
      { rut },
      {
        nombre,
        apellidos,
        genero,
        correo,
        carrera,
        cursos,
        areasDeInteres,
      },
      { new: true },
    );

    return [alumnoUpdated, null];
  } catch (error) {
    handleError(error, "alumno.service -> updateAlumno");
    return [null, "Error al actualizar el alumno"];
  }
}

async function deleteAlumno(rut) {
  try {
    const alumno = await Alumno.findOneAndDelete({ rut });
    if (!alumno) return [null, "El alumno no existe"];
    return [alumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> deleteAlumno");
    return [null, "Error al eliminar el alumno"];
  }
}

async function likeAlumno(alumnoId, likedAlumnoId) {
  try {
      if (alumnoId === likedAlumnoId) {
          return [null, "No puedes darte like a ti mismo"];
      }

      const alumno = await Alumno.findById(alumnoId);
      if (!alumno) {
          const errorMessage = "El alumno que da el like no existe";
          handleError(new Error(errorMessage), "likeAlumno - Alumno no encontrado");
          return [null, errorMessage];
      }

      const likedAlumno = await Alumno.findById(likedAlumnoId);
      if (!likedAlumno) {
          const errorMessage = "El alumno que recibe el like no existe";
          handleError(new Error(errorMessage), "likeAlumno - Liked alumno no encontrado");
          return [null, errorMessage];
      }

      // Verificar si likedAlumno.likes existe y es un array
      if (!likedAlumno.likes || !Array.isArray(likedAlumno.likes)) {
          likedAlumno.likes = [];
      }

      // Verificar si el likedAlumno ya ha recibido like del alumno
      const likesIds = likedAlumno.likes.map(like => like.alumnoId.toString());
      if (likesIds.includes(alumnoId)) {
          const errorMessage = "El alumno ya ha recibido like de esta persona";
          handleError(new Error(errorMessage), "likeAlumno - Like duplicado");
          return [null, errorMessage];
      }

      // Agregar el like al likedAlumno
      likedAlumno.likes.push({
          alumnoId: alumnoId,
          nombreCompleto: `${alumno.nombre} ${alumno.apellidos}`,
      });

      await likedAlumno.save();

      return [likedAlumno, null];
  } catch (error) {
      if (error.name === 'CastError') {
          handleError(error, 'likeAlumno - El ID no es válido, ingrese un ID válido');
          return [null, 'El ID no es válido, ingrese un ID válido'];
      }
      handleError(error, "likeAlumno - Error interno del servidor");
      return [null, "Error interno del servidor"];
  }
}

async function dislikeAlumno(alumnoId, dislikedAlumnoId) {
  try {
    if (alumnoId === dislikedAlumnoId) {
      return [null, "No puedes darte dislike a ti mismo"];
    }

    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      const errorMessage = "El alumno que da el dislike no existe";
      handleError(new Error(errorMessage), "dislikeAlumno - Alumno no encontrado");
      return [null, errorMessage];
    }

    const dislikedAlumno = await Alumno.findById(dislikedAlumnoId);
    if (!dislikedAlumno) {
      const errorMessage = "El alumno que recibe el dislike no existe";
      handleError(new Error(errorMessage), "dislikeAlumno - Disliked alumno no encontrado");
      return [null, errorMessage];
    }

    // Verificar si dislikedAlumno.dislikes existe y es un array
    if (!dislikedAlumno.dislikes || !Array.isArray(dislikedAlumno.dislikes)) {
      dislikedAlumno.dislikes = [];
    }

    // Verificar si el dislikedAlumno ya ha dado dislike al alumno
    const dislikedAlumnosIds = dislikedAlumno.dislikes.map(dislike => dislike.alumnoId.toString());
    if (dislikedAlumnosIds.includes(alumnoId)) {
      const errorMessage = "El alumno ya ha dado dislike a esta persona";
      handleError(new Error(errorMessage), "dislikeAlumno - Dislike duplicado");
      return [null, errorMessage];
    }

    // Agregar el dislike al dislikedAlumno
    dislikedAlumno.dislikes.push({
      alumnoId: alumnoId,
      nombreCompleto: `${alumno.nombre} ${alumno.apellidos}`,
    });

    await dislikedAlumno.save();

    return [dislikedAlumno, null];
  } catch (error) {
    if (error.name === 'CastError') {
      handleError(error, 'dislikeAlumno - El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    handleError(error, "dislikeAlumno - Error interno del servidor");
    return [null, "Error interno del servidor"];
  }
}

async function removeLikeAlumno(alumnoId, likedAlumnoId) {
  try {
    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      return [null, "El alumno que recibe el like no existe"];
    }

    const likedAlumno = await Alumno.findById(likedAlumnoId);
    if (!likedAlumno) {
      return [null, "El alumno que da el like no existe"];
    }

    // Verificar si likedAlumno.likes existe y es un array
    if (!likedAlumno.likes || !Array.isArray(likedAlumno.likes)) {
      return [null, "El alumno no ha dado like a nadie"];
    }

    // Buscar el índice del like del alumno en likedAlumno.likes
    const index = likedAlumno.likes.findIndex(like => like.alumnoId.toString() === alumnoId);
    if (index === -1) {
      return [null, "El alumno no ha dado like a este alumno"];
    }

    // Eliminar el like del array de likes
    likedAlumno.likes.splice(index, 1);
    await likedAlumno.save();

    return [likedAlumno, null];
  } catch (error) {
    if (error.name === 'CastError') {
      handleError(error, 'removeLikeAlumno - El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    handleError(error, "removeLikeAlumno - Error interno del servidor");
    return [null, "Error interno del servidor"];
  }
}

async function removeDislikeAlumno(alumnoId, dislikedAlumnoId) {
  try {
    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      return [null, "El alumno que recibe el dislike no existe"];
    }

    const dislikedAlumno = await Alumno.findById(dislikedAlumnoId);
    if (!dislikedAlumno) {
      return [null, "El alumno que quita el dislike no existe"];
    }

    // Verificar si dislikedAlumno.dislikes existe y es un array
    if (!dislikedAlumno.dislikes || !Array.isArray(dislikedAlumno.dislikes)) {
      return [null, "El alumno no ha dado dislike a nadie"];
    }

    // Buscar el índice del dislike del alumno en dislikedAlumno.dislikes
    const index = dislikedAlumno.dislikes.findIndex(dislike => dislike.alumnoId.toString() === alumnoId);
    if (index === -1) {
      return [null, "El alumno no ha dado dislike a este alumno"];
    }

    // Eliminar el dislike del array de dislikes
    dislikedAlumno.dislikes.splice(index, 1);
    await dislikedAlumno.save();

    return [dislikedAlumno, null];
  } catch (error) {
    if (error.name === 'CastError') {
      handleError(error, 'removeDislikeAlumno - El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    handleError(error, "removeDislikeAlumno - Error interno del servidor");
    return [null, "Error interno del servidor"];
  }
}

async function superLikeAlumno(alumnoId, superlikedAlumnoId) {
  try {
      if (alumnoId === superlikedAlumnoId) {
          return [null, "No puedes darte super like a ti mismo"];
      }

      console.log(`Intentando encontrar al alumno que da el super like con ID: ${alumnoId}`);
      const alumno = await Alumno.findById(alumnoId);
      if (!alumno) {
          const errorMessage = "El alumno que da el super like no existe";
          handleError(new Error(errorMessage), "superLikeAlumno - Alumno no encontrado");
          return [null, errorMessage];
      }

      console.log(`Intentando encontrar al alumno que recibe el super like con ID: ${superlikedAlumnoId}`);
      const superlikedAlumno = await Alumno.findById(superlikedAlumnoId);
      if (!superlikedAlumno) {
          const errorMessage = "El alumno que recibe el super like no existe";
          handleError(new Error(errorMessage), "superLikeAlumno - Superliked alumno no encontrado");
          return [null, errorMessage];
      }

      // Verificar si superlikedAlumno.superLikes existe y es un array
      if (!superlikedAlumno.superLikes || !Array.isArray(superlikedAlumno.superLikes)) {
          superlikedAlumno.superLikes = [];
      }

      // Verificar si el superlikedAlumno ya ha recibido super like del alumno
      if (superlikedAlumno.superLikes.some(like => like.alumnoId.toString() === alumnoId)) {
          const errorMessage = "Este alumno ya te ha dado super like";
          handleError(new Error(errorMessage), "superLikeAlumno - Superlike duplicado");
          return [null, errorMessage];
      }

      // Agregar el super like al superlikedAlumno
      superlikedAlumno.superLikes.push({
          alumnoId: alumnoId,
          nombreCompleto: `${alumno.nombre} ${alumno.apellidos}`,
      });

      await superlikedAlumno.save();

      return [superlikedAlumno, null];
  } catch (error) {
      if (error.name === 'CastError') {
          handleError(error, 'superLikeAlumno - El ID no es válido, ingrese un ID válido');
          return [null, 'El ID no es válido, ingrese un ID válido'];
      }
      handleError(error, "superLikeAlumno - Error interno del servidor");
      return [null, "Error interno del servidor"];
  }
}


async function quitarSuperLikeAlumno(alumnoId, superlikedAlumnoId) {
  try {
      const superlikedAlumno = await Alumno.findById(superlikedAlumnoId);
      if (!superlikedAlumno) {
          return [null, "El alumno que recibió el super like no existe"];
      }

      const alumno = await Alumno.findById(alumnoId);
      if (!alumno) {
          return [null, "El alumno que quita el super like no existe"];
      }

      // Verificar si superlikedAlumno.superLikes existe y es un array
      if (!superlikedAlumno.superLikes || !Array.isArray(superlikedAlumno.superLikes)) {
          return [null, "El alumno no ha recibido super like de nadie"];
      }

      // Buscar el índice del super like del alumno en superlikedAlumno.superLikes
      const index = superlikedAlumno.superLikes.findIndex(like => like.alumnoId.toString() === alumnoId);
      if (index === -1) {
          return [null, "El alumno no ha recibido super like de este alumno"];
      }

      // Eliminar el super like del array de superLikes
      const quitarAlumno = superlikedAlumno.superLikes[index];
      superlikedAlumno.superLikes.splice(index, 1);
      await superlikedAlumno.save();

      return [superlikedAlumno, `Se ha quitado el super like de ${quitarAlumno.nombreCompleto} correctamente`];
  } catch (error) {
      if (error.name === 'CastError') {
          handleError(error, 'quitarSuperLikeAlumno - El ID no es válido, ingrese un ID válido');
          return [null, 'El ID no es válido, ingrese un ID válido'];
      }
      handleError(error, "quitarSuperLikeAlumno - Error interno del servidor");
      return [null, "Error interno del servidor"];
  }
}

async function destacarPerfilAlumno(alumnoId, destacarAlumnoId) {
  try {
    console.log(`Intentando encontrar al alumno con ID: ${alumnoId}`);
    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      console.log(`El alumno que intenta destacar no existe: ${alumnoId}`);
      return [null, "El alumno que destaca no existe"];
    }

    if (alumnoId === destacarAlumnoId) {
      console.log(`Un alumno no puede destacarse a sí mismo: ${alumnoId}`);
      return [null, "Un alumno no puede destacarse a sí mismo"];
    }

    console.log(`Intentando encontrar al alumno a destacar con ID: ${destacarAlumnoId}`);
    const destacarAlumno = await Alumno.findById(destacarAlumnoId);
    if (!destacarAlumno) {
      console.log(`El alumno a destacar no existe: ${destacarAlumnoId}`);
      return [null, "El alumno a destacar no existe"];
    }

    if (alumno.destacado === `${destacarAlumno.nombre} ${destacarAlumno.apellidos}`) {
      console.log(`El alumno ya está destacado: ${destacarAlumnoId}`);
      return [null, "El alumno ya está destacado"];
    }

    alumno.destacado = `${destacarAlumno.nombre} ${destacarAlumno.apellidos}`;
    await alumno.save();

    console.log(`Se ha destacado correctamente: ${destacarAlumno.nombre} ${destacarAlumno.apellidos}`);
    return [alumno, `Se ha destacado a ${destacarAlumno.nombre} ${destacarAlumno.apellidos} correctamente`];
  } catch (error) {
    if (error.name === 'CastError') {
      console.error('El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    console.error(error);
    return [null, "Error al destacar el perfil del alumno"];
  }
}


async function quitarDestacadoPerfilAlumno(alumnoId, destacarAlumnoId) {
  try {
    console.log(`Intentando encontrar al alumno con ID: ${alumnoId}`);
    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      console.log(`El alumno que intenta quitar el destacado no existe: ${alumnoId}`);
      return [null, "El alumno que quita el destacado no existe"];
    }

    console.log(`Intentando encontrar al alumno a quitar destacado con ID: ${destacarAlumnoId}`);
    const destacarAlumno = await Alumno.findById(destacarAlumnoId);
    if (!destacarAlumno) {
      console.log(`El alumno a quitar destacado no existe: ${destacarAlumnoId}`);
      return [null, "El alumno a quitar destacado no existe"];
    }

    if (alumno.destacado !== `${destacarAlumno.nombre} ${destacarAlumno.apellidos}`) {
      console.log(`El alumno no está destacado: ${destacarAlumnoId}`);
      return [null, "El alumno no está destacado"];
    }

    alumno.destacado = [];
    await alumno.save();

    console.log(`Se ha quitado el destacado correctamente: ${destacarAlumno.nombre} ${destacarAlumno.apellidos}`);
    return [alumno, `Se ha quitado el destacado a ${destacarAlumno.nombre} ${destacarAlumno.apellidos} correctamente`];
  } catch (error) {
    if (error.name === 'CastError') {
      console.error('El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    console.error(error);
    return [null, "Error al quitar el destacado del perfil del alumno"];
  }
}



export default {
  getAlumnos,
  createAlumno,
  getAlumnoByRut,
  updateAlumno,
  deleteAlumno,
  likeAlumno,
  dislikeAlumno,
  removeLikeAlumno,
  removeDislikeAlumno,
  superLikeAlumno,
  quitarSuperLikeAlumno,
  destacarPerfilAlumno,
  quitarDestacadoPerfilAlumno,
};
