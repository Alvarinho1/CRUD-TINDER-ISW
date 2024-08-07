import axios from './root.service.js';

export async function getUsers() {
    try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No hay token disponible');
        }

        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        if (!usuario || !usuario._id) {
            throw new Error('No se encontró el ID del usuario');
        }

        const config = {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token.replace(/"/g, '')}` // Elimina las comillas adicionales si están presentes
            }
        };

        const { data } = await axios.get(`/users?exclude=${usuario._id}`, config);
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

export async function updateUserProfile(data) {
    try {
        const token = sessionStorage.getItem('accessToken');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        }
        const {data} = await axios.put('/users', data, config);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function updateUser(userData, email) {
    try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No hay token disponible');
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token.replace(/"/g, '')}`,
                'Cache-Control': 'no-cache'
            }
        };

        const response = await axios.put(`/users/${email}`, userData, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
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

// Función para agregar un like
export async function likeUser(likedUserId) {
    try {
        // Obtener el usuario actual desde sessionStorage
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        if (!usuario || !usuario._id) {
            return [null, 'Usuario no encontrado en sessionStorage'];
        }

        const userId = usuario._id;
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            return [null, 'No hay token disponible'];
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token.replace(/"/g, '')}`,
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json' // Asegúrate de que el tipo de contenido sea JSON
            }
        };

        // Envía userId y likedUserId en el cuerpo de la solicitud
        const response = await axios.post('/users/like', { userId, likedUserId }, config);

        return [response.data, null];
    } catch (error) {
        return [null, error.response?.data || error.message];
    }
}

// Función para agregar un dislike
export async function dislikeUser(dislikedUserId) {
    try {
        // Obtener el usuario actual desde sessionStorage
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        if (!usuario || !usuario._id) {
            return [null, 'Usuario no encontrado en sessionStorage'];
        }

        const userId = usuario._id;
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            return [null, 'No hay token disponible'];
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token.replace(/"/g, '')}`,
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json' // Asegúrate de que el tipo de contenido sea JSON
            }
        };

        // Envía userId y dislikedUserId en el cuerpo de la solicitud
        const response = await axios.post('/users/dislike', { userId, dislikedUserId }, config);

        return [response.data, null];
    } catch (error) {
        return [null, error.response?.data || error.message];
    }
}