import axios from './root.service.js';
import cookies from "js-cookie";

export async function getChats(email) {
    try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) throw new Error('No token found');

        const config = {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token.replace(/"/g, '')}`
            }
        };

        const { data } = await axios.get('/match/'+ email, config);
        console.log('Se obtuvieron los chats chat.service.js');
        return data;
    }
    catch (error) {
        throw error.response?.data || error.message;
    }
}
