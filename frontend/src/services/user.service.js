import axios from './root.service.js';

export async function getUsers() {
    try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No hay token disponible');
        }

        const config = {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token.replace(/"/g, '')}` // Elimina las comillas adicionales si están presentes
            }
        };

        const { data } = await axios.get('/users/', config);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}
export async function getUsersAndMessages() {
    try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No hay token disponible');
        }

        const config = {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token.replace(/"/g, '')}` // Elimina las comillas adicionales si están presentes
            }
        };

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

export async function updateUser(data, email) {
    try {
        const token = sessionStorage.getItem('accessToken');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        }
        const {data} = await axios.put(`/users/${email}`, data, config);
        return data;
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
