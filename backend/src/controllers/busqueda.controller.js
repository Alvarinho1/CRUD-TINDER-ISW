import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import BusquedaServicio from "../services/busqueda.service.js";

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
        const { username, rut } = req.body;

        let newResultado;
        let resultadoError;

        if (username || rut) {
            [newResultado, resultadoError] = await BusquedaServicio.BuscarPorUsernameOrRut(username, rut);
        } else {
            [newResultado, resultadoError] = await BusquedaServicio.BuscarDisponibles();
        }

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

export default { BuscarDisponibles, BuscarPorCategoria };
