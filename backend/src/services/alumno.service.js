import Alumno from "../models/alumno.model.js";
import Role from "../models/role.model.js";
import { handleError } from "../utils/errorHandler.js";

async function getAlumnos() {
  try {
    const alumnos = await Alumno.find().populate("roles").exec(); // Incluye roles en la consulta
    if (!alumnos) return [null, "No hay alumnos"];
    return [alumnos, null];
  } catch (error) {
    handleError(error, "alumno.service -> getAlumnos");
    return [null, "Error al obtener los alumnos"];
  }
}

async function createAlumno(alumno) {
  try {
    const { nombre, apellidos, genero, rut, email, carrera, cursos, areasDeInteres, fotoPerfil, password, roles } = alumno;

    const alumnoFound = await Alumno.findOne({ rut });
    if (alumnoFound) return [null, "El alumno ya existe"];

    const encryptedPassword = await Alumno.encryptPassword(password);

    let roleIds = [];
    if (roles && roles.length > 0) {
      // Verifica si los roles proporcionados existen en la base de datos
      const foundRoles = await Role.find({ name: { $in: roles } });
      if (foundRoles.length !== roles.length) {
        return [null, "Uno o más roles no existen en la base de datos"];
      }
      roleIds = foundRoles.map(role => role._id); // Extrae los IDs de los roles encontrados
    } else {
      // Asigna el rol por defecto "alumno" si no se proporcionan roles
      const defaultRole = await Role.findOne({ name: "alumno" });
      if (defaultRole) {
        roleIds = [defaultRole._id];
      } else {
        return [null, "El rol 'alumno' no existe en la base de datos"];
      }
    }

    const newAlumno = new Alumno({
      nombre,
      apellidos,
      genero,
      rut,
      email,
      carrera,
      cursos,
      areasDeInteres,
      fotoPerfil,
      password: encryptedPassword,
      roles: roleIds // Asigna los roles
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
    const alumno = await Alumno.findOne({ rut }).populate("roles").exec();
    if (!alumno) return [null, "El alumno no existe"];
    return [alumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> getAlumnoByRut");
    return [null, "Error al obtener el alumno"];
  }
}

async function getAlumnoById(id) {
  try {
    const alumno = await Alumno.findById(id).populate("roles").exec();
    if (!alumno) return [null, "El alumno no existe"];
    return [alumno, null];
  } catch (error) {
    handleError(error, "alumno.service -> getAlumnoById");
    return [null, "Error al obtener el alumno"];
  }
}

async function updateAlumno(rut, alumno) {
  try {
    const alumnoFound = await Alumno.findOne({ rut });
    if (!alumnoFound) return [null, "El alumno no existe"];

    const { nombre, apellidos, genero, email, carrera, cursos, areasDeInteres, fotoPerfil, roles } = alumno;

    let roleIds = alumnoFound.roles; // Mantén los roles existentes
    if (roles) {
      // Verifica si los roles proporcionados existen en la base de datos
      const foundRoles = await Role.find({ name: { $in: roles } });
      if (foundRoles.length !== roles.length) {
        return [null, "Uno o más roles no existen en la base de datos"];
      }
      roleIds = foundRoles.map(role => role._id); // Actualiza con los IDs de los roles encontrados
    }

    const alumnoUpdated = await Alumno.findOneAndUpdate(
      { rut },
      {
        nombre,
        apellidos,
        genero,
        email,
        carrera,
        cursos,
        areasDeInteres,
        fotoPerfil,
        roles: roleIds // Actualiza los roles
      },
      { new: true },
    ).populate("roles");

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

    const alumno = await Alumno.findById(alumnoId).exec();
    if (!alumno) {
      const errorMessage = "El alumno que da el like no existe";
      handleError(new Error(errorMessage), "likeAlumno - Alumno no encontrado");
      return [null, errorMessage];
    }

    const likedAlumno = await Alumno.findById(likedAlumnoId).exec();
    if (!likedAlumno) {
      const errorMessage = "El alumno que recibe el like no existe";
      handleError(new Error(errorMessage), "likeAlumno - Liked alumno no encontrado");
      return [null, errorMessage];
    }

    if (!likedAlumno.likes || !Array.isArray(likedAlumno.likes)) {
      likedAlumno.likes = [];
    }

    const likesIds = likedAlumno.likes.map(like => like.alumnoId?.toString());
    if (likesIds.includes(alumnoId)) {
      const errorMessage = "El alumno ya ha recibido like de esta persona";
      handleError(new Error(errorMessage), "likeAlumno - Like duplicado");
      return [null, errorMessage];
    }

    likedAlumno.likes.push({
      alumnoId: alumnoId,
      nombreCompleto: `${alumno.nombre} ${alumno.apellidos}`,
      role: alumno.role  // Agregar role
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

    const alumno = await Alumno.findById(alumnoId).exec();
    if (!alumno) {
      const errorMessage = "El alumno que da el dislike no existe";
      handleError(new Error(errorMessage), "dislikeAlumno - Alumno no encontrado");
      return [null, errorMessage];
    }

    const dislikedAlumno = await Alumno.findById(dislikedAlumnoId).exec();
    if (!dislikedAlumno) {
      const errorMessage = "El alumno que recibe el dislike no existe";
      handleError(new Error(errorMessage), "dislikeAlumno - Disliked alumno no encontrado");
      return [null, errorMessage];
    }

    if (!dislikedAlumno.dislikes || !Array.isArray(dislikedAlumno.dislikes)) {
      dislikedAlumno.dislikes = [];
    }

    const dislikedAlumnosIds = dislikedAlumno.dislikes.map(dislike => dislike.alumnoId.toString());
    if (dislikedAlumnosIds.includes(alumnoId)) {
      const errorMessage = "El alumno ya ha dado dislike a esta persona";
      handleError(new Error(errorMessage), "dislikeAlumno - Dislike duplicado");
      return [null, errorMessage];
    }

    dislikedAlumno.dislikes.push({
      alumnoId: alumnoId,
      nombreCompleto: `${alumno.nombre} ${alumno.apellidos}`,
      role: alumno.role  // Agregar role
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
    const alumno = await Alumno.findById(alumnoId).exec();
    if (!alumno) {
      return [null, "El alumno que recibe el like no existe"];
    }

    const likedAlumno = await Alumno.findById(likedAlumnoId).exec();
    if (!likedAlumno) {
      return [null, "El alumno que da el like no existe"];
    }

    if (!likedAlumno.likes || !Array.isArray(likedAlumno.likes)) {
      return [null, "El alumno no ha dado like a nadie"];
    }

    const index = likedAlumno.likes.findIndex(like => like.alumnoId.toString() === alumnoId);
    if (index === -1) {
      return [null, "El alumno no ha dado like a este alumno"];
    }

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
    const alumno = await Alumno.findById(alumnoId).exec();
    if (!alumno) {
      return [null, "El alumno que recibe el dislike no existe"];
    }

    const dislikedAlumno = await Alumno.findById(dislikedAlumnoId).exec();
    if (!dislikedAlumno) {
      return [null, "El alumno que quita el dislike no existe"];
    }

    if (!dislikedAlumno.dislikes || !Array.isArray(dislikedAlumno.dislikes)) {
      return [null, "El alumno no ha dado dislike a nadie"];
    }

    const index = dislikedAlumno.dislikes.findIndex(dislike => dislike.alumnoId.toString() === alumnoId);
    if (index === -1) {
      return [null, "El alumno no ha dado dislike a este alumno"];
    }

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

async function destacarPerfilAlumno(alumnoId, destacarAlumnoId) {
  try {
    console.log(`Intentando encontrar al alumno con ID: ${alumnoId}`);
    const alumno = await Alumno.findById(alumnoId).exec();
    if (!alumno) {
      console.log(`El alumno que intenta destacar no existe: ${alumnoId}`);
      return [null, "El alumno que destaca no existe"];
    }

    if (alumnoId === destacarAlumnoId) {
      console.log(`Un alumno no puede destacarse a sí mismo: ${alumnoId}`);
      return [null, "Un alumno no puede destacarse a sí mismo"];
    }

    console.log(`Intentando encontrar al alumno a destacar con ID: ${destacarAlumnoId}`);
    const destacarAlumno = await Alumno.findById(destacarAlumnoId).exec();
    if (!destacarAlumno) {
      console.log(`El alumno a destacar no existe: ${destacarAlumnoId}`);
      return [null, "El alumno a destacar no existe"];
    }

    if (alumno.destacado === `${destacarAlumno.nombre} ${destacarAlumno.apellidos}`) {
      console.log(`El alumno ya está destacado: ${destacarAlumnoId}`);
      return [null, "El alumno ya está destacado"];
    }

    alumno.destacado = `${destacarAlumno.nombre} ${destacarAlumno.apellidos}`;
    alumno.destacadoRole = destacarAlumno.role;  // Agregar role destacado
    await alumno.save();

    console.log(`Se ha destacado correctamente: ${destacarAlumno.nombre} ${destacarAlumno.apellidos}`);
    return [alumno, `Se ha destacado a ${destacarAlumno.nombre} ${destacarAlumno.apellidos} correctamente`];
  } catch (error) {
    if (error.name === 'CastError') {
      console.error('El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    console.error(error);
    return [null, "Error al destacar el perfil"];
  }
}

async function quitarDestacadoPerfilAlumno(alumnoId, destacarAlumnoId) {
  try {
    console.log(`Intentando encontrar al alumno con ID: ${alumnoId}`);
    const alumno = await Alumno.findById(alumnoId).exec();
    if (!alumno) {
      console.log(`El alumno que intenta quitar el destacado no existe: ${alumnoId}`);
      return [null, "El alumno que quita el destacado no existe"];
    }

    if (alumno.destacado !== `${destacarAlumno.nombre} ${destacarAlumno.apellidos}`) {
      console.log(`El alumno no está destacado: ${destacarAlumnoId}`);
      return [null, "El alumno no está destacado"];
    }

    alumno.destacado = null;
    alumno.destacadoRole = null;  // Quitar role destacado
    await alumno.save();

    console.log(`Se ha quitado el destacado correctamente: ${destacarAlumnoId}`);
    return [alumno, "Se ha quitado el destacado correctamente"];
  } catch (error) {
    if (error.name === 'CastError') {
      console.error('El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    console.error(error);
    return [null, "Error al quitar el destacado"];
  }
}



export default {
  getAlumnos,
  createAlumno,
  getAlumnoByRut,
  getAlumnoById,
  updateAlumno,
  deleteAlumno,
  likeAlumno,
  dislikeAlumno,
  removeLikeAlumno,
  removeDislikeAlumno,
  destacarPerfilAlumno,
  quitarDestacadoPerfilAlumno,
};
