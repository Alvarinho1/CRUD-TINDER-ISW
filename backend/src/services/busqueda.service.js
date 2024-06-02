import User from "../models/user.model.js";
import { handleError } from "../utils/errorHandler.js";

async function BuscarDisponibles() { 
    try {
        const disponibles = await User.find(); 
        if (!disponibles || disponibles.length === 0) return [null, "No hay resultados"];
        return [disponibles, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarDisponibles");
        return [null, "No hay resultados"];
    }
}

async function BuscarPorUsernameOrRut(username, rut) {
    try {
        const query = {};
        if (username) {
            query.username = username;
        }
        if (rut) {
            query.rut = rut;
        }

        const usuarios = await User.find(query);
        if (!usuarios || usuarios.length === 0) return [null, "No se encontraron resultados"];
        return [usuarios, null];
    } catch (error) {
        handleError(error, "busqueda.service -> BuscarPorUsernameOrRut");
        return [null, error.message];
    }
}

export default { BuscarDisponibles, BuscarPorUsernameOrRut };
