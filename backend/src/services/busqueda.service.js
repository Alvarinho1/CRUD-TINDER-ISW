import Alumno from "../models/alumno.model.js";
import { handleError } from "../utils/errorHandler.js";

async function BuscarDisponibles() {
    try {
        // Obtener todos los alumnos
        const todosLosAlumnos = await Alumno.find().lean();

        // Ordenar todos los alumnos por puntos en orden descendente
        todosLosAlumnos.sort((a, b) => {
            const puntosA = calcularPuntos(a.likes);
            const puntosB = calcularPuntos(b.likes);
            return puntosB - puntosA;
        });

        // Función para calcular los puntos de un alumno
        function calcularPuntos(likes) {
            return (likes ? likes.length : 0) * 50;
        }

        // Agrupar alumnos por cantidad de puntos
        const alumnosPorPuntos = {};
        todosLosAlumnos.forEach(alumno => {
            const puntos = calcularPuntos(alumno.likes);
            if (!alumnosPorPuntos[puntos]) {
                alumnosPorPuntos[puntos] = [];
            }
            alumnosPorPuntos[puntos].push(alumno);
        });

        // Ordenar las listas de alumnos con la misma cantidad de puntos de forma aleatoria
        Object.keys(alumnosPorPuntos).forEach(puntos => {
            shuffleArray(alumnosPorPuntos[puntos]);
        });

        // Concatenar los alumnos ordenados por puntos de forma aleatoria
        let disponibles = [];
        Object.keys(alumnosPorPuntos).sort((a, b) => b - a).forEach(puntos => {
            disponibles = [...disponibles, ...alumnosPorPuntos[puntos]];
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

// Función auxiliar para mezclar un array de forma aleatoria
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

        // Usar populate para obtener los datos de los likes de cada alumno
        const populatedAlumnos = await Alumno.populate(alumnos, { path: "likes.alumnoId", select: "id nombre apellidos" });

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

        // Usar populate para obtener los datos de los dislikes de cada alumno
        const populatedAlumnos = await Alumno.populate(alumnos, { path: "dislikes.alumnoId", select: "id nombre apellidos" });

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

        // Usar populate para obtener los datos de los likes
        const populatedAlumno = await Alumno.populate(alumno, { path: "likes.alumnoId", select: "id nombre apellidos" });

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

        // Usar populate para obtener los datos de los dislikes
        const populatedAlumno = await Alumno.populate(alumno, { path: "dislikes.alumnoId", select: "id nombre apellidos" });

        // Procesar y devolver los datos como desees
        return [populatedAlumno, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDislikesAlumnorut");
        return [null, error.message];
    }
}


async function RankingAlumnos() {
    try {
        const rankingAlumnosLikes = await Alumno.aggregate([
            // Agregar campo likes y calcular su tamaño (cantidad de likes)
            { $addFields: { 
                likes: { $ifNull: ["$likes", []] }
            } },
            // Proyectar nombre, apellidos, rut, y calcular puntos basados en la cantidad de likes
            { 
                $project: { 
                    nombre: 1, 
                    apellidos: 1, 
                    rut: 1, 
                    likeCount: { $size: "$likes" }, // Cantidad de likes
                    points: { $multiply: [{ $size: "$likes" }, 50] } // Calcular puntos (50 puntos por like)
                } 
            },
            // Ordenar por puntos en orden descendente
            { $sort: { points: -1 } },
            // Limitar a los primeros 10 resultados
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



export default {
    BuscarDisponibles,
    BuscarPorCategoria,
    BuscarLikesAlumno,
    BuscarDislikesAlumno,
    BuscarLikesAlumnorut,
    BuscarDislikesAlumnorut,
    RankingAlumnos
};
