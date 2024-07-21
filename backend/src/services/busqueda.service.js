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

async function BuscarLikesUsuario() {
    try {
        const usuarios = await User.find(
            { "likes.usuarioId": { $exists: true, $ne: [] } },
            { nombre: 1, apellidos: 1, rut: 1, likes: 1 }
        );

        if (!usuarios || usuarios.length === 0) {
            return [null, "No hay ningún usuario con likes"];
        }

        const populatedUsuarios = await User.populate(usuarios, { path: "likes.usuarioId", select: "id nombre apellidos" });

        return [populatedUsuarios, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarLikesUsuario");
        return [null, error.message];
    }
}

async function BuscarDislikesUsuario() {
    try {
        const usuarios = await User.find(
            { dislikes: { $exists: true, $ne: [] } },
            { nombre: 1, apellidos: 1, rut: 1, dislikes: 1 }
        );

        if (!usuarios || usuarios.length === 0) {
            return [null, "No hay ningún usuario con dislikes"];
        }

        const populatedUsuarios = await User.populate(usuarios, { path: "dislikes.usuarioId", select: "id nombre apellidos" });

        return [populatedUsuarios, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDislikesUsuario");
        return [null, error.message];
    }
}

async function BuscarLikesUsuarioRut(rut) {
    try {
        const usuario = await User.findOne({ rut }, { nombre: 1, apellidos: 1, rut: 1, likes: 1 });
        if (!usuario) return [null, "El usuario no existe"];

        if (!usuario.likes || usuario.likes.length === 0) {
            return [null, "El usuario no tiene likes"];
        }

        const populatedUsuario = await User.populate(usuario, { path: "likes.usuarioId", select: "id nombre apellidos" });

        return [populatedUsuario, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarLikesUsuarioRut");
        return [null, error.message];
    }
}

async function BuscarDislikesUsuarioRut(rut) {
    try {
        const usuario = await User.findOne({ rut }, { nombre: 1, apellidos: 1, rut: 1, dislikes: 1 });
        if (!usuario) return [null, "El usuario no existe"];

        if (!usuario.dislikes || usuario.dislikes.length === 0) {
            return [null, "El usuario no tiene dislikes"];
        }

        const populatedUsuario = await User.populate(usuario, { path: "dislikes.usuarioId", select: "id nombre apellidos" });

        return [populatedUsuario, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDislikesUsuarioRut");
        return [null, error.message];
    }
}

async function RankingUsuarios() {
    try {
        const rankingUsuariosLikes = await User.aggregate([
            { $addFields: { likes: { $ifNull: ["$likes", []] } } },
            { $project: { nombre: 1, apellidos: 1, rut: 1, likeCount: { $size: "$likes" }, points: { $multiply: [{ $size: "$likes" }, 50] } } },
            { $sort: { points: -1 } },
            { $limit: 10 }
        ]);

        if (!rankingUsuariosLikes || rankingUsuariosLikes.length === 0) {
            return [null, "No se encontraron usuarios con likes"];
        }

        return [rankingUsuariosLikes, null];
    } catch (error) {
        handleError(error, "busqueda.service -> RankingUsuariosLikes");
        return [null, error.message];
    }
}

export default {
    BuscarDisponibles,
    BuscarPorCategoria,
    BuscarLikesUsuario,
    BuscarDislikesUsuario,
    BuscarLikesUsuarioRut,
    BuscarDislikesUsuarioRut,
    RankingUsuarios
};
