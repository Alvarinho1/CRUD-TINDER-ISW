import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import BusquedaServicio from "../services/busqueda.service.js";
import { busquedaSchema } from "../schema/busqueda.schema.js";

async function BuscarDisponibles(req, res) {
    try {
        const [newResultado, resultadoError] = await BusquedaServicio.BuscarDisponibles();
        if (resultadoError) return respondError(req, res, 500, resultadoError);
        if (!newResultado) {
            return respondError(req, res, 400, "No se encontraron resultados");
        }
        respondSuccess(req, res, 201, newResultado);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarDisponibles");
        respondError(req, res, 500, "No se creó resultado de búsqueda");
    }
}

async function BuscarPorCategoria(req, res) {
    try {
        const { error: validationError } = busquedaSchema.validate(req.body);
        if (validationError) return respondError(req, res, 400, validationError.details[0].message);

        const { carrera, genero, cursos, areasDeInteres } = req.body;
        const [newResultado, resultadoError] = await BusquedaServicio.BuscarPorCategoria(carrera, genero, cursos, areasDeInteres);
        if (resultadoError) return respondError(req, res, 500, resultadoError);
        if (!newResultado) {
            return respondError(req, res, 400, "No se encontraron resultados");
        }
        respondSuccess(req, res, 201, newResultado);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarPorCategoria");
        respondError(req, res, 500, "No se creó resultado de búsqueda");
    }
}

async function BuscarLikesAlumno(req, res) {
    try {
        const [alumnos, error] = await BusquedaServicio.BuscarLikesAlumno();
        if (error) return respondError(req, res, 400, error);
        if (!alumnos || alumnos.length === 0) return respondError(req, res, 400, "No se encontraron alumnos con likes");
        respondSuccess(req, res, 200, alumnos);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarLikesAlumno");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function BuscarDislikesAlumno(req, res) {
    try {
        const [alumnos, error] = await BusquedaServicio.BuscarDislikesAlumno();
        if (error) return respondError(req, res, 400, error);
        if (!alumnos || alumnos.length === 0) return respondError(req, res, 400, "No se encontraron alumnos con dislikes");
        respondSuccess(req, res, 200, alumnos);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarDislikesAlumno");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function BuscarLikesAlumnorut(req, res) {
    try {
        const { rut } = req.params;
        const [alumnos, error] = await BusquedaServicio.BuscarLikesAlumnorut(rut);
        if (error) return respondError(req, res, 400, error);
        if (!alumnos || alumnos.length === 0) return respondError(req, res, 400, "Este alumno no tiene likes");
        respondSuccess(req, res, 200, alumnos);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarLikesAlumnorut");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function BuscarDislikesAlumnorut(req, res) {
    try {
        const { rut } = req.params;
        const [alumnos, error] = await BusquedaServicio.BuscarDislikesAlumnorut(rut);
        if (error) return respondError(req, res, 400, error);
        if (!alumnos || alumnos.length === 0) return respondError(req, res, 400, "Este alumno no tiene dislikes");
        respondSuccess(req, res, 200, alumnos);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarDislikesAlumnorut");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function RankingAlumnosLikes(req, res) {
    try {
        const [alumno, error] = await BusquedaServicio.RankingAlumnosLikes();
        if (error) return respondError(req, res, 400, error);
        if (!alumno) return respondError(req, res, 400, "No se encontró ningún alumno con likes");
        respondSuccess(req, res, 200, alumno);
    } catch (error) {
        handleError(error, "busqueda.controller -> RankingAlumnosLikes");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function RankingAlumnosDislikes(req, res) {
    try {
        const [alumno, error] = await BusquedaServicio.RankingAlumnosDislikes();
        if (error) return respondError(req, res, 400, error);
        if (!alumno) return respondError(req, res, 400, "No se encontró ningún alumno con dislikes");
        respondSuccess(req, res, 200, alumno);
    } catch (error) {
        handleError(error, "busqueda.controller -> RankingAlumnosDislikes");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function BuscarSuperLikes(req, res) {
    try {
        const [alumnos, error] = await BusquedaServicio.BuscarSuperLikes();
        if (error) {
            return respondError(req, res, 400, error);
        }
        if (!alumnos || alumnos.length === 0) {
            return respondError(req, res, 400, "No se encontraron alumnos con superlikes");
        }
        respondSuccess(req, res, 200, alumnos);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarSuperLikes");
        respondError(req, res, 500, "Error interno del servidor");
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
