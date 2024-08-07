import axios from './root.service.js';

export async function getMatchesByUserId(userId) {
    try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No hay token disponible');
        }

        const config = {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token.replace(/"/g, '')}`
            }
        };

        const { data } = await axios.get(`/match/alumno/${userId}`, config);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function createMatch(userId, matchUserId) {
    try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No hay token disponible');
        }

        const config = {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token.replace(/"/g, '')}`
            }
        };

        const { data } = await axios.post('/matches', { userId, matchUserId }, config);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}
