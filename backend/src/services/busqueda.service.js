import Alumno from "../models/alumno.model.js";
import { handleError } from "../utils/errorHandler.js";

async function BuscarDisponibles() {
    try {
        // Utilizar la función de agregación para obtener resultados aleatorios
        const disponibles = await Alumno.aggregate([{ $sample: { size: 100 } }]);

        if (!disponibles || disponibles.length === 0) {
            return [null, "No hay resultados"];
        }
        
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
            { "likes.alumnoId": { $exists: true, $ne: [] } },
            { nombre: 1, apellidos: 1, rut: 1, likes: 1 }
        );

        if (!alumnos || alumnos.length === 0) {
            return [null, "No hay ningún alumno con likes"];
        }

        // Ejemplo de cómo manejar los datos de 'likes' manualmente
        const populatedAlumnos = await Alumno.populate(alumnos, { path: "likes.alumnoId" });

        // Procesar y devolver los datos como desees
        return [populatedAlumnos, null];
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
        );

        if (!alumnos || alumnos.length === 0) {
            return [null, "No hay ningún alumno con dislikes"];
        }

        // Ejemplo de cómo manejar los datos de 'dislikes' manualmente
        const populatedAlumnos = await Alumno.populate(alumnos, { path: "dislikes.alumnoId" });

        // Procesar y devolver los datos como desees
        return [populatedAlumnos, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDislikesAlumno");
        return [null, error.message];
    }
}

async function BuscarLikesAlumnorut(rut) {
    try {
        const alumno = await Alumno.findOne({ rut }, { nombre: 1, apellidos: 1, rut: 1, likes: 1 });
        if (!alumno) return [null, "El alumno no existe"];

        if (!alumno.likes || alumno.likes.length === 0) {
            return [null, "El alumno no tiene likes"];
        }

        // Ejemplo de cómo manejar los datos de 'likes' manualmente
        const populatedAlumno = await Alumno.populate(alumno, { path: "likes.alumnoId" });

        // Procesar y devolver los datos como desees
        return [populatedAlumno, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarLikesAlumnorut");
        return [null, error.message];
    }
}

async function BuscarDislikesAlumnorut(rut) {
    try {
        const alumno = await Alumno.findOne({ rut }, { nombre: 1, apellidos: 1, rut: 1, dislikes: 1 });
        if (!alumno) return [null, "El alumno no existe"];

        if (!alumno.dislikes || alumno.dislikes.length === 0) {
            return [null, "El alumno no tiene dislikes"];
        }

        // Ejemplo de cómo manejar los datos de 'dislikes' manualmente
        const populatedAlumno = await Alumno.populate(alumno, { path: "dislikes.alumnoId" });

        // Procesar y devolver los datos como desees
        return [populatedAlumno, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDislikesAlumnorut");
        return [null, error.message];
    }
}

async function RankingAlumnosLikes() {
    try {
        const rankingAlumnosLikes = await Alumno.aggregate([
            { $addFields: { likes: { $ifNull: ["$likes", []] } } },
            { $match: { likes: { $not: { $size: 0 } } } }, // Filtrar solo los alumnos con likes
            { $project: { nombre: 1, apellidos: 1, rut: 1, likeCount: { $size: "$likes" } } },
            { $sort: { likeCount: -1 } },
            { $limit: 10 }
        ]);

        if (!rankingAlumnosLikes || rankingAlumnosLikes.length === 0) {
            return [null, "No se encontraron alumnos con likes"];
        }

        return [rankingAlumnosLikes, null];
    } catch (error) {
        handleError(error, "busqueda.service -> RankingAlumnosLikes");
        return [null, error.message];
    }
}

async function RankingAlumnosDislikes() {
    try {
        const rankingAlumnosDislikes = await Alumno.aggregate([
            { $addFields: { dislikes: { $ifNull: ["$dislikes", []] } } },
            { $match: { dislikes: { $not: { $size: 0 } } } }, // Filtrar solo los alumnos con dislikes
            { $project: { nombre: 1, apellidos: 1, rut: 1, dislikeCount: { $size: "$dislikes" } } },
            { $sort: { dislikeCount: -1 } },
            { $limit: 10 }
        ]);

        if (!rankingAlumnosDislikes || rankingAlumnosDislikes.length === 0) {
            return [null, "No se encontraron alumnos con dislikes"];
        }

        return [rankingAlumnosDislikes, null];
    } catch (error) {
        handleError(error, "busqueda.service -> RankingAlumnosDislikes");
        return [null, error.message];
    }
}

async function BuscarSuperLikes() {
    try {
        const alumnos = await Alumno.find(
            { superLikes: { $exists: true, $ne: [] } },
            { nombre: 1, apellidos: 1, rut: 1, superLikes: 1 }
        );

        if (!alumnos || alumnos.length === 0) {
            return [null, "No hay ningún alumno con superlikes"];
        }

        // Ejemplo de cómo manejar los datos de 'superLikes' manualmente
        const populatedAlumnos = await Alumno.populate(alumnos, { path: "superLikes.alumnoId" });

        // Procesar y devolver los datos como desees
        return [populatedAlumnos, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarSuperLikes");
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
    RankingAlumnosLikes,
    RankingAlumnosDislikes,
    BuscarSuperLikes
};
