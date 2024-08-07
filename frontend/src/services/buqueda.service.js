import axios from './root.service.js';

export async function RankingUsers() {
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

        const { data } = await axios.get('/busqueda/alumno/ranking', config);

        // Asume que `data` es el objeto de respuesta del servidor
        // y que dentro de `data` hay una propiedad `data` que contiene el array de usuarios
        return [data.data || [], null];
    } catch (error) {
        return [null, error.response?.data || error.message];
    }
}

export async function BuscarLikesUser() {
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

        const { data } = await axios.get('/busqueda/likes', config);

        // Asume que `data` es el objeto de respuesta del servidor
        // y que dentro de `data` hay una propiedad `data` que contiene el array de usuarios
        return [data.data || [], null];
    } catch (error) {
        return [null, error.response?.data || error.message];
    }
}

export async function BuscarLikesUserByRut() {
    try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No hay token disponible');
        }

        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        if (!usuario || !usuario.rut) {
            throw new Error('No se encontró el RUT del usuario');
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token.replace(/"/g, '')}`,
                'Cache-Control': 'no-cache'
            }
        };

        // Usa el RUT del usuario recuperado del sessionStorage
        const { data } = await axios.get(`/busqueda/alumno/likes/${usuario.rut}`, config);

        console.log('Datos de Likes por RUT:', data);

        return [data.data || {}, null];
    } catch (error) {
        console.error('Error en BuscarLikesUserByRut:', error.response?.data || error.message);

        return [null, error.response?.data || error.message];
    }
}




export async function BuscarLikesDados() {
    try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No hay token disponible');
        }

        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        if (!usuario || !usuario.rut) {
            throw new Error('No se encontró el RUT del usuario');
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token.replace(/"/g, '')}`,
                'Cache-Control': 'no-cache'
            }
        };

        const { data } = await axios.get(`/busqueda/alumno/likesdados/${usuario.rut}`, config);

        console.log('Datos de Likes por RUT:', data);

        if (data && data.data) {
            return [data.data, null];
        } else {
            return [[], null];
        }
    } catch (error) {
        console.error('Error en BuscarLikesDados:', error.response?.data || error.message);
        return [null, error.response?.data || error.message];
    }
}

