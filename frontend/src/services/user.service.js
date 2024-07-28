import axios from './root.service.js';

export async function getUsers() {
    try {
        const config = {
            headers: {
                'Cache-Control': 'no-cache'
            }
        }
        const { data } = await axios.get('/users/', config);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}



export async function getUserByRut(rut) {
    try {
        const { data } = await axios.get(`/users/${rut}`);
        if (!data) return [null, "El usuario no existe"];
        return [data, null];
    } catch (error) {
        return [null, error.response?.data || error.message];
    }
}

export async function getUserById(id) {
    try {
        const { data } = await axios.get(`/users/${id}`);
        if (!data) return [null, "El usuario no existe"];
        return [data, null];
    } catch (error) {
        return [null, error.response?.data || error.message];
    }
}

export async function updateUser(rut, user) {
    try {
        // Buscar el usuario existente
        const userFound = await axios.get(`/users/?rut=${rut}`);
        if (!userFound.data) return [null, "El usuario no existe"];

        // Extraer campos del usuario, incluyendo roles
        const { nombre, apellidos, genero, email, carrera, cursos, areasDeInteres, fotoPerfil, roles } = user;

        // Si se proporcionan roles, validar su existencia
        let roleIds = userFound.data.roles; // Mantener roles existentes por defecto
        if (roles) {
            const rolesFound = await axios.get('/roles/', { params: { name: { $in: roles } } });
            if (rolesFound.data.length === 0) return [null, "El rol no existe"];
            roleIds = rolesFound.data.map((role) => role._id); // Obtener IDs de los roles
        }

        // Actualizar el usuario con los nuevos datos y roles
        const userUpdated = await axios.put(`/users/?rut=${rut}`, {
            nombre,
            apellidos,
            genero,
            email,
            carrera,
            cursos,
            areasDeInteres,
            fotoPerfil,
            roles: roleIds, // Asignar roles actualizados
        });

        return [userUpdated.data, null];
    } catch (error) {
        return [null, error.response?.data || error.message];
    }
}

export async function deleteUser(rut) {
    try {
        const user = await axios.delete(`/users/?rut=${rut}`);
        if (!user.data) return [null, "El usuario no existe"];
        return [user.data, null];
    } catch (error) {
        return [null, error.response?.data || error.message];
    }
}
