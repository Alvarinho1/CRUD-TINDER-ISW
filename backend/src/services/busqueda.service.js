"use strict";

import User from "../models/user.model.js";
import { handleError } from "../utils/errorHandler.js";

async function BuscarDisponibles() {
    try {
        const todosLosUsuarios = await User.find().lean();

        todosLosUsuarios.sort((a, b) => {
            const puntosA = calcularPuntos(a.likes);
            const puntosB = calcularPuntos(b.likes);
            return puntosB - puntosA;
        });

        function calcularPuntos(likes) {
            return (likes ? likes.length : 0) * 50;
        }

        const usuariosPorPuntos = {};
        todosLosUsuarios.forEach(user => {
            const puntos = calcularPuntos(user.likes);
            if (!usuariosPorPuntos[puntos]) {
                usuariosPorPuntos[puntos] = [];
            }
            usuariosPorPuntos[puntos].push(user);
        });

        Object.keys(usuariosPorPuntos).forEach(puntos => {
            shuffleArray(usuariosPorPuntos[puntos]);
        });

        let disponibles = [];
        Object.keys(usuariosPorPuntos).sort((a, b) => b - a).forEach(puntos => {
            disponibles = [...disponibles, ...usuariosPorPuntos[puntos]];
        });

        if (!disponibles || disponibles.length === 0) {
            return [null, "No hay resultados"];
        }

        return [disponibles, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDisponibles");
        return [null, "No hay resultados"];
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function BuscarPorCategoria(carrera, genero, cursos, areasDeInteres) {
    try {
        const query = {};
        if (carrera) query.carrera = carrera;
        if (genero) query.genero = genero;
        if (cursos) query.cursos = { $all: cursos };
        if (areasDeInteres) query.areasDeInteres = { $all: areasDeInteres };

        const resultados = await User.find(query);
        if (!resultados || resultados.length === 0) return [null, "No se encontraron resultados"];
        return [resultados, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarPorCategoria");
        return [null, error.message];
    }
}
async function BuscarLikesUser() {
    try {
        const user = await User.find(
            { "likes.userId": { $exists: true, $ne: [] } },
            { nombre: 1, apellidos: 1, rut: 1, likes: 1 }
        );

        if (!user || user.length === 0) {
            return [null, "No hay ningún alumno con likes"];
        }

        // Ejemplo de cómo manejar los datos de 'likes' manualmente
        const populatedUsers = await User.populate(user, { path: "likes.userId" });

        // Procesar y devolver los datos como desees
        return [populatedUsers, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarLikesUser");
        return [null, error.message];
    }
}


async function BuscarDislikesUser() {
    try {
        const user = await User.find(
            { dislikes: { $exists: true, $ne: [] } },
            { nombre: 1, apellidos: 1, rut: 1, dislikes: 1 }
        );

        if (!user || user.length === 0) {
            return [null, "No hay ningún usuario con dislikes"];
        }

        const populatedUsers = await User.populate(user, { path: "dislikes.userId", select: "id nombre apellidos" });

        return [populatedUsers, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDislikesUser");
        return [null, error.message];
    }
}

async function BuscarLikesUserByRut(rut) {
    try {
        const user = await User.findOne({ rut }, { nombre: 1, apellidos: 1, rut: 1, likes: 1 });
        if (!user) return [null, "El usuario no existe"];

        if (!user.likes || user.likes.length === 0) {
            return [null, "El usuario no tiene likes"];
        }

        const populatedUsers = await User.populate(user, { path: "likes.userId", select: "id nombre apellidos" });

        return [populatedUsers, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarLikesUserByRut");
        return [null, error.message];
    }
}

async function BuscarDislikesUserByRut(rut) {
    try {
        const user = await User.findOne({ rut }, { nombre: 1, apellidos: 1, rut: 1, dislikes: 1 });
        if (!user) return [null, "El usuario no existe"];

        if (!user.dislikes || user.dislikes.length === 0) {
            return [null, "El usuario no tiene dislikes"];
        }

        const populatedUsers = await User.populate(user, { path: "dislikes.userId", select: "id nombre apellidos" });

        return [populatedUsers, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDislikesUserByRut");
        return [null, error.message];
    }
}

async function RankingUsers() {
    try {
        const rankingUsersLikes = await User.aggregate([
            { $addFields: { likes: { $ifNull: ["$likes", []] } } },
            { $project: { nombre: 1, apellidos: 1, rut: 1, likeCount: { $size: "$likes" }, points: { $multiply: [{ $size: "$likes" }, 50] } } },
            { $sort: { points: -1 } },
            { $limit: 10 }
        ]);

        if (!rankingUsersLikes || rankingUsersLikes.length === 0) {
            return [null, "No se encontraron usuarios con likes"];
        }

        return [rankingUsersLikes, null];
    } catch (error) {
        handleError(error, "busqueda.service -> RankingUsersLikes");
        return [null, error.message];
    }
}

async function BuscarLikesDados(rut) {
    try {
        // Buscar al usuario por su rut
        const user = await User.findOne({ rut });

        if (!user) {
            return [null, "El usuario no existe"];
        }

        // Verificar si el usuario tiene likes dados
        if (!user.likes || user.likes.length === 0) {
            return [null, "El usuario no ha dado likes a ningún otro usuario"];
        }

        // Obtener los IDs de los usuarios a los cuales se les ha dado like
        const userIds = user.likes.map(like => like.userId);

        // Buscar los usuarios correspondientes a los IDs obtenidos
        const likedUsers = await User.find({ _id: { $in: userIds } }, { nombre: 1, apellidos: 1, rut: 1 });

        if (!likedUsers || likedUsers.length === 0) {
            return [null, "No se encontraron usuarios a los cuales se les ha dado like"];
        }

        return [likedUsers, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarLikesDados");
        return [null, error.message];
    }
}

export default {
    BuscarDisponibles,
    BuscarPorCategoria,
    BuscarLikesUser,
    BuscarDislikesUser,
    BuscarLikesUserByRut,
    BuscarDislikesUserByRut,
    RankingUsers,
    BuscarLikesDados
};
