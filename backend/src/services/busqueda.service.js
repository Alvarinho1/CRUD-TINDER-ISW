import Alumno from "../models/alumno.model.js";
import { handleError } from "../utils/errorHandler.js";

async function BuscarDisponibles() {
    try {
        const disponibles = await Alumno.find();
        if (!disponibles || disponibles.length === 0) return [null, "No hay resultados"];
        return [disponibles, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDisponibles");
        return [null, "No hay resultados"];
    }
}

async function BuscarPorCategoria(carrera, genero, cursos, areasDeInteres) {
    try {
        const query = {};
        if (carrera) query.carrera = carrera;
        if (genero) query.genero = genero;
        if (cursos) query.cursos = { $all: cursos };
        if (areasDeInteres) query.areasDeInteres = { $all: areasDeInteres };

        const resultados = await Alumno.find(query);
        if (!resultados || resultados.length === 0) return [null, "No se encontraron resultados"];
        return [resultados, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarPorCategoria");
        return [null, error.message];
    }
}

async function BuscarLikesAlumno() {
    try {
        const alumnos = await Alumno.find(
            { likes: { $exists: true, $ne: [] } },
            { nombre: 1, apellidos: 1, rut: 1, likes: 1 }
        ).populate('likes', 'nombre apellidos rut');

        if (!alumnos || alumnos.length === 0) {
            return [null, "No hay ningún alumno con likes"];
        }

        return [alumnos, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarLikesAlumno");
        return [null, error.message];
    }
}

async function BuscarDislikesAlumno() {
    try {
        const alumnos = await Alumno.find(
            { dislikes: { $exists: true, $ne: [] } },
            { nombre: 1, apellidos: 1, rut: 1, dislikes: 1 }
        ).populate('dislikes', 'nombre apellidos rut');

        if (!alumnos || alumnos.length === 0) {
            return [null, "No hay ningún alumno con dislikes"];
        }

        return [alumnos, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDislikesAlumno");
        return [null, error.message];
    }
}

async function BuscarLikesAlumnorut(rut) {
    try {
        const alumno = await Alumno.findOne({ rut }, { nombre: 1, apellidos: 1, rut: 1, likes: 1 }).populate('likes', 'nombre apellidos rut').exec();
        if (!alumno) return [null, "El alumno no existe"];

        if (!alumno.likes || alumno.likes.length === 0) {
            return [null, "El alumno no tiene likes"];
        }

        return [alumno, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarLikesAlumnorut");
        return [null, error.message];
    }
}

async function BuscarDislikesAlumnorut(rut) {
    try {
        const alumno = await Alumno.findOne({ rut }, { nombre: 1, apellidos: 1, rut: 1, dislikes: 1 }).populate('dislikes', 'nombre apellidos rut').exec();
        if (!alumno) return [null, "El alumno no existe"];

        if (!alumno.dislikes || alumno.dislikes.length === 0) {
            return [null, "El alumno no tiene dislikes"];
        }

        return [alumno, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDislikesAlumnorut");
        return [null, error.message];
    }
}

async function BuscarAlumnoConMasLikes() {
    try {
        const maxLikes = await Alumno.aggregate([
            { $addFields: { likes: { $ifNull: ["$likes", []] } } },
            { $project: { likeCount: { $size: "$likes" } } },
            { $sort: { likeCount: -1 } },
            { $limit: 1 }
        ]);

        if (!maxLikes || maxLikes.length === 0 || maxLikes[0].likeCount === 0) {
            return [null, "No se encontró ningún alumno con likes"];
        }

        const maxLikeCount = maxLikes[0].likeCount;

        const alumnosConMasLikes = await Alumno.aggregate([
            { $addFields: { likes: { $ifNull: ["$likes", []] } } },
            { $project: { nombre: 1, apellidos: 1, rut: 1, likeCount: { $size: "$likes" } } },
            { $match: { likeCount: maxLikeCount } }
        ]);

        return [alumnosConMasLikes, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarAlumnoConMasLikes");
        return [null, error.message];
    }
}

async function BuscarAlumnoConMasDislikes() {
    try {
        const maxDislikes = await Alumno.aggregate([
            { $addFields: { dislikes: { $ifNull: ["$dislikes", []] } } },
            { $project: { dislikeCount: { $size: "$dislikes" } } },
            { $sort: { dislikeCount: -1 } },
            { $limit: 1 }
        ]);

        if (!maxDislikes || maxDislikes.length === 0 || maxDislikes[0].dislikeCount === 0) {
            return [null, "No se encontró ningún alumno con dislikes"];
        }

        const maxDislikeCount = maxDislikes[0].dislikeCount;

        const alumnosConMasDislikes = await Alumno.aggregate([
            { $addFields: { dislikes: { $ifNull: ["$dislikes", []] } } },
            { $project: { nombre: 1, apellidos: 1, rut: 1, dislikeCount: { $size: "$dislikes" } } },
            { $match: { dislikeCount: maxDislikeCount } }
        ]);

        return [alumnosConMasDislikes, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarAlumnoConMasDislikes");
        return [null, error.message];
    }
}

export default {
    BuscarDisponibles,
    BuscarPorCategoria,
    BuscarLikesAlumno,
    BuscarDislikesAlumno,
    BuscarLikesAlumnorut,
    BuscarDislikesAlumnorut,
    BuscarAlumnoConMasLikes,
    BuscarAlumnoConMasDislikes,
};
