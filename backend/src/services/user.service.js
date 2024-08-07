import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { handleError } from "../utils/errorHandler.js";


async function getUsers(excludeUserId) {
  try {
    const users = await User.find({ _id: { $ne: excludeUserId } }).populate('roles').exec();
    if (!users) return [null, "No hay usuarios"];
    return [users, null];
  } catch (error) {
    handleError(error, "user.service -> getUsers");
    return [null, "Error al obtener los usuarios"];
  }
}
async function createUser(user) {
  try {
    const { nombre, apellidos, genero, rut, email, carrera, cursos, areasDeInteres, fotoPerfil, password, roles } = user;

    // Verificar si el usuario ya existe
    const userFound = await User.findOne({ rut });
    if (userFound) return [null, "El usuario ya existe"];

    // Verificar la existencia de los roles
    const rolesFound = await Role.find({ name: { $in: roles } });
    if (rolesFound.length === 0) return [null, "El rol no existe"];

    // Obtener los IDs de los roles
    const myRole = rolesFound.map((role) => role._id);

    // Encriptar la contraseña
    const encryptedPassword = await User.encryptPassword(password);

    // Crear el nuevo usuario
    const newUser = new User({
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
      roles: myRole, // Asignar IDs de roles al nuevo usuario
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    return [newUser, null];
  } catch (error) {
    handleError(error, "user.service -> createUser");
    return [null, "Error al crear el usuario"];
  }
}

async function getUserByRut(rut) {
  try {
    const user = await User.findOne({ rut }).populate('roles').exec();
    if (!user) return [null, "El usuario no existe"];
    return [user, null];
  } catch (error) {
    handleError(error, "user.service -> getUserByRut");
    return [null, "Error al obtener el usuario"];
  }
}

async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email }).populate('roles').exec();
    if (!user) return [null, "El usuario no existe"];
    return [user, null];
  } catch (error) {
    handleError(error, "user.service -> getUserByRut");
    return [null, "Error al obtener el usuario"];
  }
}

async function getUserById(id) {
  try {
    const user = await User.findById(id).populate('roles').exec();
    if (!user) return [null, "El usuario no existe"];
    return [user, null];
  } catch (error) {
    handleError(error, "user.service -> getUserById");
    return [null, "Error al obtener el usuario"];
  }
}

async function updateUser(rut, user) {
  try {
    // Buscar el usuario existente
    const userFound = await User.findOne({ rut });
    if (!userFound) return [null, "El usuario no existe"];

    // Extraer campos del usuario, incluyendo roles
    const { nombre, apellidos, genero, email, carrera, cursos, areasDeInteres, fotoPerfil, descripcion, roles } = user;

    // Si se proporcionan roles, validar su existencia
    let roleIds = userFound.roles; // Mantener roles existentes por defecto
    if (roles) {
      const rolesFound = await Role.find({ name: { $in: roles } });
      if (rolesFound.length === 0) return [null, "El rol no existe"];
      roleIds = rolesFound.map((role) => role._id); // Obtener IDs de los roles
    }

    // Actualizar el usuario con los nuevos datos y roles
    const userUpdated = await User.findOneAndUpdate(
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
        descripcion,
        roles: roleIds, // Asignar roles actualizados
      },
      { new: true },
    );

    return [userUpdated, null];
  } catch (error) {
    handleError(error, "user.service -> updateUser");
    return [null, "Error al actualizar el usuario"];
  }
}

async function deleteUser(rut) {
  try {
    const user = await User.findOneAndDelete({ rut });
    if (!user) return [null, "El usuario no existe"];
    return [user, null];
  } catch (error) {
    handleError(error, "user.service -> deleteUser");
    return [null, "Error al eliminar el usuario"];
  }
}

async function likeUser(userId, likedUserId) {
  try {
    if (userId === likedUserId) {
      return [null, "No puedes darte like a ti mismo"];
    }

    const user = await User.findById(userId).exec();
    if (!user) {
      const errorMessage = "El alumno que da el like no existe";
      handleError(new Error(errorMessage), "likeUser - Alumno no encontrado");
      return [null, errorMessage];
    }

    const likedUser = await User.findById(likedUserId).exec();
    if (!likedUser) {
      const errorMessage = "El alumno que recibe el like no existe";
      handleError(new Error(errorMessage), "likeUser - Liked alumno no encontrado");
      return [null, errorMessage];
    }

    if (!likedUser.likes || !Array.isArray(likedUser.likes)) {
      likedUser.likes = [];
    }

    const likesIds = likedUser.likes.map(like => like.userId?.toString());
    if (likesIds.includes(userId)) {
      const errorMessage = "El alumno ya ha recibido like de esta persona";
      handleError(new Error(errorMessage), "likeuser - Like duplicado");
      return [null, errorMessage];
    }

    likedUser.likes.push({
      userId: userId,
      nombreCompleto: `${user.nombre} ${user.apellidos}`,
    });

    await likedUser.save();

    return [likedUser, null];
  } catch (error) {
    if (error.name === 'CastError') {
      handleError(error, 'likeUser - El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    handleError(error, "likeUser - Error interno del servidor");
    return [null, "Error interno del servidor"];
  }
}

async function dislikeUser(userId, dislikedUserId) {
  try {
    // Verifica que el usuario no se esté dando dislike a sí mismo
    if (userId === dislikedUserId) {
      return [null, "No puedes darte dislike a ti mismo"];
    }

    // Busca el usuario que da el dislike
    const user = await User.findById(userId).exec();
    if (!user) {
      const errorMessage = "alumno que da el dislike no existe";
      handleError(new Error(errorMessage), "dislikeUser - Usuario no encontrado");
      return [null, errorMessage];
    }

    // Busca el usuario que recibe el dislike
    const dislikedUser = await User.findById(dislikedUserId).exec();
    if (!dislikedUser) {
      const errorMessage = "El alumno que recibe el dislike no existe";
      handleError(new Error(errorMessage), "dislikeUser - Usuario recibido no encontrado");
      return [null, errorMessage];
    }

    // Inicializa el arreglo de dislikes si no existe
    if (!dislikedUser.dislikes || !Array.isArray(dislikedUser.dislikes)) {
      dislikedUser.dislikes = [];
    }

    // Verifica si el usuario ya ha dado dislike a esta persona
    const dislikedUserIds = dislikedUser.dislikes.map(dislike => dislike.userId.toString());
    if (dislikedUserIds.includes(userId.toString())) {
      const errorMessage = "El alumno ya ha dado dislike a esta persona";
      handleError(new Error(errorMessage), "dislikeUser - Dislike duplicado");
      return [null, errorMessage];
    }

    // Agrega el dislike al usuario
    dislikedUser.dislikes.push({
      userId: userId,
      nombreCompleto: `${user.nombre} ${user.apellidos}`,
    });

    // Guarda los cambios
    await dislikedUser.save();

    return [dislikedUser, null];
  } catch (error) {
    if (error.name === 'CastError') {
      handleError(error, 'dislikeUser - El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    handleError(error, "dislikeUser - Error interno del servidor");
    return [null, "Error interno del servidor"];
  }
}

async function removeLikeUser(userId, likedUserId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return [null, "El usuario que recibe el like no existe"];
    }

    const likedUser = await User.findById(likedUserId);
    if (!likedUser) {
      return [null, "El usuario que da el like no existe"];
    }

    if (!likedUser.likes || !Array.isArray(likedUser.likes)) {
      return [null, "El usuario no ha dado like a nadie"];
    }

    const index = likedUser.likes.findIndex(like => like.userId.toString() === userId);
    if (index === -1) {
      return [null, "El usuario no ha dado like a este usuario"];
    }

    likedUser.likes.splice(index, 1);
    await likedUser.save();

    return [likedUser, null];
  } catch (error) {
    if (error.name === 'CastError') {
      handleError(error, 'removeLikeUser - El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    handleError(error, "removeLikeUser - Error interno del servidor");
    return [null, "Error interno del servidor"];
  }
}

async function removeDislikeUser(userId, dislikedUserId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return [null, "El usuario que recibe el dislike no existe"];
    }

    const dislikedUser = await User.findById(dislikedUserId);
    if (!dislikedUser) {
      return [null, "El usuario que quita el dislike no existe"];
    }

    if (!dislikedUser.dislikes || !Array.isArray(dislikedUser.dislikes)) {
      return [null, "El usuario no ha dado dislike a nadie"];
    }

    const index = dislikedUser.dislikes.findIndex(dislike => dislike.userId.toString() === userId);
    if (index === -1) {
      return [null, "El usuario no ha dado dislike a este usuario"];
    }

    dislikedUser.dislikes.splice(index, 1);
    await dislikedUser.save();

    return [dislikedUser, null];
  } catch (error) {
    if (error.name === 'CastError') {
      handleError(error, 'removeDislikeUser - El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    handleError(error, "removeDislikeUser - Error interno del servidor");
    return [null, "Error interno del servidor"];
  }
}

async function destacarPerfilUser(userId, destacarUserId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return [null, "El usuario que intenta destacar no existe"];
    }

    if (userId === destacarUserId) {
      return [null, "Un usuario no puede destacarse a sí mismo"];
    }

    const destacarUser = await User.findById(destacarUserId);
    if (!destacarUser) {
      return [null, "El usuario a destacar no existe"];
    }

    if (user.destacado === `${destacarUser.nombre} ${destacarUser.apellidos}`) {
      return [null, "El usuario ya está destacado"];
    }

    user.destacado = `${destacarUser.nombre} ${destacarUser.apellidos}`;
    await user.save();

    return [user, `Se ha destacado a ${destacarUser.nombre} ${destacarUser.apellidos} correctamente`];
  } catch (error) {
    if (error.name === 'CastError') {
      handleError(error, 'destacarPerfilUser - El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    handleError(error, "destacarPerfilUser - Error interno del servidor");
    return [null, "Error al destacar el perfil del usuario"];
  }
}

async function quitarDestacadoPerfilUser(userId, destacarUserId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return [null, "El usuario que intenta quitar el destacado no existe"];
    }

    const destacarUser = await User.findById(destacarUserId);
    if (!destacarUser) {
      return [null, "El usuario a quitar el destacado no existe"];
    }

    if (user.destacado !== `${destacarUser.nombre} ${destacarUser.apellidos}`) {
      return [null, "El usuario no está destacado"];
    }

    user.destacado = "";
    await user.save();

    return [user, `Se ha quitado el destacado a ${destacarUser.nombre} ${destacarUser.apellidos} correctamente`];
  } catch (error) {
    if (error.name === 'CastError') {
      handleError(error, 'quitarDestacadoPerfilUser - El ID no es válido, ingrese un ID válido');
      return [null, 'El ID no es válido, ingrese un ID válido'];
    }
    handleError(error, "quitarDestacadoPerfilUser - Error interno del servidor");
    return [null, "Error al quitar el destacado del perfil del usuario"];
  }
}

export default {

  getUsers,
  createUser,
  getUserByRut,
  getUserById,
  updateUser,
  deleteUser,
  likeUser,
  dislikeUser,
  removeLikeUser,
  removeDislikeUser,
  destacarPerfilUser,
  quitarDestacadoPerfilUser,
  getUserByEmail
};
