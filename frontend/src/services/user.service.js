import axios from './root.service.js';

export async function getUsers() {
    try {
        const token = sessionStorage.getItem('accessToken'); 
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        }
        const { data } = await axios.get('/users/', config);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}
//Lo que debo modificar
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
        const response = await axios.delete(`/users/?rut=${rut}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}