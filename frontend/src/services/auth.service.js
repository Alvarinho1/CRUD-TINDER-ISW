/* eslint-disable no-debugger */
import axios from './root.service.js';
import cookies from 'js-cookie';

export async function login(data) {
    try {
        const response = await axios.post('/auth/login', data);
        const { status } = response;
        if (status === 200) {
            sessionStorage.setItem('accessToken', response.data.data.accessToken); // Guarda el token de acceso
            sessionStorage.setItem('usuario', JSON.stringify(response.data.data.dataUser));
            sessionStorage.setItem('accessToken', JSON.stringify(response.data.data.accessToken));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function register(data) {
    try {
        const response = await axios.post('/auth/register', data);
        return response.data;
    } catch (error) {
        // Verifica si error.response existe y contiene datos
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            // Si no hay respuesta, lanza un error genérico
            throw { message: 'Error desconocido al registrar.' };
        }
    }
}

export async function profile() {
    try {
        const token = sessionStorage.getItem('accessToken');
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));

        if (!token || !usuario || !usuario.rut) {
            throw new Error('No hay token disponible o usuario no encontrado');
        }

        const config = {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token.replace(/"/g, '')}`
            }
        };

        const { data } = await axios.get(`/users/${usuario.rut}`, config);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}
export async function logout() {
    try {
        await axios.post('/auth/logout');
        sessionStorage.removeItem('usuario');
        cookies.remove('miCookie');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

export async function updateUserProfile(data) {
    try {
        const token = sessionStorage.getItem('accessToken');
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));

        if (!token || !usuario || !usuario.rut) {
            throw new Error('No hay token disponible o usuario no encontrado');
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        };

        const response = await axios.put(`/users/${usuario.rut}`, data, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}