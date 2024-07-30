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

async function BuscarLikesUser(req, res) {
    try {
        const [user, error] = await BusquedaServicio.BuscarLikesUser();
        if (error) return respondError(req, res, 400, error);
        if (!user || user.length === 0) return respondError(req, res, 400, "No se encontraron alumnos con likes");
        respondSuccess(req, res, 200, user);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarLikesUser");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function BuscarDislikesUser(req, res) {
    try {
        const [user, error] = await BusquedaServicio.BuscarDislikesUser();
        if (error) return respondError(req, res, 400, error);
        if (!user || user.length === 0) return respondError(req, res, 400, "No se encontraron usuarios con dislikes");
        respondSuccess(req, res, 200, user);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarDislikesUser");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function BuscarLikesUserByRut(req, res) {
    try {
        const { rut } = req.params;
        const [user, error] = await BusquedaServicio.BuscarLikesUserByRut(rut);
        if (error) return respondError(req, res, 400, error);
        if (!user || user.length === 0) return respondError(req, res, 400, "Este usuario no tiene likes");
        respondSuccess(req, res, 200, user);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarLikesUserByRut");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function BuscarDislikesUserByRut(req, res) {
    try {
        const { rut } = req.params;
        const [user, error] = await BusquedaServicio.BuscarDislikesUserByRut(rut);
        if (error) return respondError(req, res, 400, error);
        if (!user || user.length === 0) return respondError(req, res, 400, "Este usuario no tiene dislikes");
        respondSuccess(req, res, 200, user);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarDislikesUserByRut");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function RankingUsers(req, res) {
    try {
        const [user, error] = await BusquedaServicio.RankingUsers();
        if (error) return respondError(req, res, 400, error);
        if (!user) return respondError(req, res, 400, "No se encontró ningún usuario con likes");
        respondSuccess(req, res, 200, user);
    } catch (error) {
        handleError(error, "busqueda.controller -> RankingUsersLikes");
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function BuscarLikesDados(req, res) {
    try {
        const { rut } = req.params;
        const [likedUsers, error] = await BusquedaServicio.BuscarLikesDados(rut);

        if (error) {
            return respondError(req, res, 400, error);
        }

        if (!likedUsers || likedUsers.length === 0) {
            return respondError(req, res, 400, "No se encontraron usuarios a los cuales se les ha dado like");
        }

        respondSuccess(req, res, 200, likedUsers);
    } catch (error) {
        handleError(error, "busqueda.controller -> BuscarLikesDados");
        respondError(req, res, 500, "Error interno del servidor");
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
